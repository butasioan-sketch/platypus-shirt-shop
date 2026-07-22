'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { calcUnitPriceForProduct } from '@/lib/pricing';
import { PRINT_SPEC, formatSizeMm, getNoPrintNote, getPlacementZone, getGarmentPhotoSrc, getViewerAspect, getGarmentProfile } from '@/lib/print-spec';
import { defaultPrintTransform, type PrintTransform } from '@/lib/print-position';
import { renderTextImage, TEXT_COLOR_OPTIONS } from '@/lib/print-text';
import { useLocale } from '@/app/components/LocaleProvider';
import ShirtPrintOverlay from './ShirtPrintOverlay';

// Ohne `loading` zeigte next/dynamic waehrend des JS-Chunk-Ladens (three.js/fiber/
// drei-Bundle) buchstaeblich nichts an — auf dem dunklen Seiten-Hintergrund sah das
// wie ein kaputter schwarzer Kasten aus, nicht wie ein Ladezustand (Ursache des vom
// User gemeldeten "schwarzer Viewer" beim ersten Klick auf 360°).
const Shirt3D = dynamic(() => import('./Shirt3D'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '55%', height: '55%', borderRadius: '16px', background: 'rgba(255,255,255,0.06)', animation: 'plt-glb-pulse 1.3s ease-in-out infinite' }} />
    </div>
  ),
});

/** Frei vom Kunden bestimmt: jede Ebene (Bild oder Text) hat eigene Position/Größe —
 *  kein vorgeschriebener Katalog, keine Pflicht-Motive. Siehe REPORT-ATELIER-FREI-KUNDE.md */
export interface DesignLayer {
  id: string;
  kind: 'image' | 'text';
  src: string;
  transform: PrintTransform;
  text?: string;
  color?: string;
}

export interface DesignState {
  frontLayers: DesignLayer[];
  backLayers: DesignLayer[];
}

interface DesignStudioProps {
  productId?: string;
  shirtColor?: string;
  onDesignChange?: (data: DesignState) => void;
}

/** Harte Obergrenze pro Seite — schützt Payload-Größe/Performance, kein künstliches Limit fürs Motiv selbst. */
const MAX_LAYERS_PER_SIDE = 6;

const genId = () => `L-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export default function DesignStudio({ productId = '1', onDesignChange }: DesignStudioProps) {
  const { t } = useLocale();
  const profile = getGarmentProfile(productId);
  // Tee-Atelierfoto ist noch das alte einfarbige Blank-Foto, nicht JN827 (das hat
  // Kontrast-Einsaetze an Schulter/Seite) — siehe REPORT-AUDIT-WEBSHOP-DOWNLOADS-22-07.md.
  // Shorts-Foto ist bereits das reale JN387-Foto (Hash-verifiziert), braucht keinen Hinweis.
  const photoIsCalibrationPreview = productId === '1';
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [preview360, setPreview360] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [frontLayers, setFrontLayersState] = useState<DesignLayer[]>([]);
  const [backLayers, setBackLayersState] = useState<DesignLayer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadHint, setUploadHint] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ mx: number; my: number; px: number; py: number; id: string } | null>(null);

  const [inputMode, setInputMode] = useState<'image' | 'text'>('image');
  const [textDraft, setTextDraft] = useState('');
  const [textColor, setTextColor] = useState<string>(TEXT_COLOR_OPTIONS[0].hex);
  const [textFontScale, setTextFontScale] = useState(1);
  const [textError, setTextError] = useState('');

  // onDesignChange darf nie synchron aus einem setState-Updater heraus aufgerufen werden
  // (React wirft "Cannot update a component while rendering a different component") —
  // daher ueber einen Effekt an frontLayers/backLayers gekoppelt, nicht inline in setLayers.
  useEffect(() => {
    onDesignChange?.({ frontLayers, backLayers });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frontLayers, backLayers]);

  const setLayers = (newSide: 'front' | 'back', updater: DesignLayer[] | ((prev: DesignLayer[]) => DesignLayer[])) => {
    if (newSide === 'front') setFrontLayersState(updater);
    else setBackLayersState(updater);
  };

  const currentLayers = side === 'front' ? frontLayers : backLayers;
  const setCurrentLayers = (updater: DesignLayer[] | ((prev: DesignLayer[]) => DesignLayer[])) => setLayers(side, updater);
  const selectedLayer = currentLayers.find((l) => l.id === selectedId) || null;

  const switchSide = (newSide: 'front' | 'back') => {
    if (newSide === side) return;
    setFlipping(true);
    setTimeout(() => {
      setSide(newSide);
      setFlipping(false);
      const nextLayers = newSide === 'front' ? frontLayers : backLayers;
      setSelectedId(nextLayers.length ? nextLayers[nextLayers.length - 1].id : null);
    }, 280);
  };

  const selectLayer = (id: string) => {
    setSelectedId(id);
    const layer = currentLayers.find((l) => l.id === id);
    if (layer?.kind === 'text') {
      setTextDraft(layer.text || '');
      setTextColor(layer.color || TEXT_COLOR_OPTIONS[0].hex);
      setInputMode('text');
    } else if (layer?.kind === 'image') {
      setInputMode('image');
    }
  };

  const addImageLayer = (dataUrl: string, w: number, h: number) => {
    const ratio = w / h;
    const target = PRINT_SPEC.aspectRatio;
    const sizeLabel = formatSizeMm();
    if (Math.min(w, h) < PRINT_SPEC.minUploadPx) {
      setUploadHint(t.studio.lowRes
        .replace('{w}', String(w))
        .replace('{h}', String(h))
        .replace('{pxW}', String(PRINT_SPEC.widthPx))
        .replace('{pxH}', String(PRINT_SPEC.heightPx)));
    } else if (Math.abs(ratio - target) > 0.25 && Math.abs(ratio - 1 / target) > 0.25) {
      setUploadHint(t.studio.badRatio.replace('{size}', sizeLabel));
    } else {
      setUploadHint('');
    }
    const layer: DesignLayer = { id: genId(), kind: 'image', src: dataUrl, transform: defaultPrintTransform() };
    setCurrentLayers((prev) => [...prev, layer]);
    setSelectedId(layer.id);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const probe = new window.Image();
      probe.onload = () => addImageLayer(dataUrl, probe.width, probe.height);
      probe.onerror = () => addImageLayer(dataUrl, 0, 0);
      probe.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const applyText = () => {
    const trimmed = textDraft.trim();
    if (!trimmed) { setTextError(t.studio.textRequired); return; }
    if (trimmed.length > 48) { setTextError(t.studio.textTooLong); return; }
    setTextError('');
    const { dataUrl } = renderTextImage(trimmed, textFontScale, textColor);
    if (selectedLayer?.kind === 'text') {
      const id = selectedLayer.id;
      setCurrentLayers((prev) => prev.map((l) => (l.id === id ? { ...l, src: dataUrl, text: trimmed, color: textColor } : l)));
    } else {
      const layer: DesignLayer = { id: genId(), kind: 'text', src: dataUrl, transform: defaultPrintTransform(), text: trimmed, color: textColor };
      setCurrentLayers((prev) => [...prev, layer]);
      setSelectedId(layer.id);
    }
  };

  /** Verlässt den "Ebene X bearbeiten"-Modus, damit der nächste Klick auf Anwenden
   *  eine NEUE Text-Ebene anlegt statt die aktuell ausgewählte zu überschreiben. */
  const startNewText = () => {
    setSelectedId(null);
    setTextDraft('');
    setTextColor(TEXT_COLOR_OPTIONS[0].hex);
    setTextError('');
  };

  const removeLayer = (id: string) => {
    setCurrentLayers((prev) => {
      const next = prev.filter((l) => l.id !== id);
      if (selectedId === id) setSelectedId(next.length ? next[next.length - 1].id : null);
      return next;
    });
  };

  const moveLayer = (id: string, dir: 'forward' | 'backward') => {
    setCurrentLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      const swapWith = dir === 'forward' ? idx + 1 : idx - 1;
      if (idx < 0 || swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return next;
    });
  };

  const startDrag = (e: React.MouseEvent | React.TouchEvent, layer: DesignLayer) => {
    e.preventDefault();
    selectLayer(layer.id);
    const pt = 'touches' in e ? e.touches[0] : e;
    setDragging(true);
    dragStart.current = { mx: pt.clientX, my: pt.clientY, px: layer.transform.x, py: layer.transform.y, id: layer.id };
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (!dragging || !dragStart.current || !containerRef.current) return;
    const id = dragStart.current.id;
    const rect = containerRef.current.getBoundingClientRect();
    const zone = getPlacementZone(side, productId);
    const dx = (clientX - dragStart.current.mx) * (100 / rect.width) * (100 / zone.width);
    const dy = (clientY - dragStart.current.my) * (100 / rect.height) * (100 / zone.height);
    const limit = PRINT_SPEC.maxOffsetPercent;
    const newX = Math.max(-limit, Math.min(limit, dragStart.current.px + dx));
    const newY = Math.max(-limit, Math.min(limit, dragStart.current.py + dy));
    setCurrentLayers((prev) => prev.map((l) => (l.id === id ? { ...l, transform: { ...l.transform, x: newX, y: newY } } : l)));
  };

  const endDrag = () => { setDragging(false); dragStart.current = null; };

  const setSelectedScale = (v: number) => {
    if (!selectedLayer) return;
    const id = selectedLayer.id;
    setCurrentLayers((prev) => prev.map((l) => (l.id === id ? { ...l, transform: { ...l.transform, scale: v } } : l)));
  };

  const centerSelected = () => {
    if (!selectedLayer) return;
    const id = selectedLayer.id;
    setCurrentLayers((prev) => prev.map((l) => (l.id === id ? { ...l, transform: { ...l.transform, x: 0, y: 0 } } : l)));
  };

  const sideLabel = side === 'front' ? t.studio.front : t.studio.back;
  const totalLayers = frontLayers.length + backLayers.length;
  const priceSuffix = frontLayers.length && backLayers.length ? t.studio.twoSides : (frontLayers.length || backLayers.length) ? t.studio.oneSide : '';
  const atLimit = currentLayers.length >= MAX_LAYERS_PER_SIDE;

  const miniBtnStyle: React.CSSProperties = {
    width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: 'none', color: '#999', cursor: 'pointer', fontSize: '0.75rem', borderRadius: '4px',
  };

  return (
    <div className="plt-card" style={{ padding: '1.25rem', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
      <div className="plt-tab-group" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
        {(['front', 'back'] as const).map((s) => (
          <button key={s} type="button" onClick={() => switchSide(s)} className={`plt-tab${side === s ? ' plt-tab-active' : ''}`}>
            {s === 'front' ? t.studio.front.toUpperCase() : t.studio.back.toUpperCase()}
            {(s === 'front' ? frontLayers.length : backLayers.length) > 0 && (
              <span style={{ marginLeft: '0.35rem', width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            )}
          </button>
        ))}
        <button type="button" onClick={() => setPreview360(v => !v)} className={`plt-tab${preview360 ? ' plt-tab-active' : ''}`}>360°</button>
      </div>

      <div className="plt-price-bar" style={{ marginBottom: '1rem' }}>
        <span className="plt-label" style={{ margin: 0 }}>{t.studio.price} {priceSuffix}</span>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.15rem' }}>€{calcUnitPriceForProduct(productId, totalLayers).toFixed(2)}</span>
      </div>

      {preview360 ? (
        <>
          <div style={{ width: '100%', aspectRatio: getViewerAspect(productId), marginBottom: '0.5rem' }}>
            <Shirt3D
              frontPrint={frontLayers.map((l) => ({ src: l.src, x: l.transform.x, y: l.transform.y, scale: l.transform.scale }))}
              backPrint={backLayers.map((l) => ({ src: l.src, x: l.transform.x, y: l.transform.y, scale: l.transform.scale }))}
              frontSrc={getGarmentPhotoSrc('front', productId)}
              backSrc={getGarmentPhotoSrc('back', productId)}
              productId={productId}
              fallback="flip"
            />
          </div>
          <p className="plt-label" style={{ textAlign: 'center', margin: '0 0 1rem', color: '#555', fontSize: '0.68rem' }}>
            {t.studio.preview360Note}
          </p>
        </>
      ) : (
        <div
          ref={containerRef}
          style={{
            position: 'relative', width: '100%', aspectRatio: getViewerAspect(productId), marginBottom: '1rem',
            opacity: flipping ? 0.4 : 1, transform: flipping ? 'scale(0.98)' : 'scale(1)',
            transition: 'opacity 0.28s, transform 0.28s',
          }}
          onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchMove={(e) => { const touch = e.touches[0]; moveDrag(touch.clientX, touch.clientY); }}
          onTouchEnd={endDrag}
        >
          <img
            src={getGarmentPhotoSrc(side, productId)}
            alt={sideLabel}
            style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.5))' }}
            draggable={false}
          />
          <ShirtPrintOverlay
            side={side}
            layers={currentLayers}
            selectedId={selectedId}
            onLayerPointerDown={startDrag}
            productId={productId}
          />
        </div>
      )}

      {!preview360 && photoIsCalibrationPreview && (
        <p className="plt-label" style={{ textAlign: 'center', margin: '-0.6rem 0 1rem', color: '#555', fontSize: '0.68rem' }}>
          {t.studio.calibrationPhotoNote.replace('{blank}', profile.blank).replace('{gsm}', String(profile.weightGsm))}
        </p>
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />

      <div className="plt-tab-group" style={{ marginBottom: '0.75rem' }}>
        <button type="button" onClick={() => setInputMode('image')} className={`plt-tab${inputMode === 'image' ? ' plt-tab-active' : ''}`}>
          {t.studio.imageTab}
        </button>
        <button type="button" onClick={() => setInputMode('text')} className={`plt-tab${inputMode === 'text' ? ' plt-tab-active' : ''}`}>
          {t.studio.textTab}
        </button>
      </div>

      {inputMode === 'image' ? (
        <div style={{ marginBottom: '0.65rem' }}>
          <button type="button" className="plt-btn-primary" style={{ width: '100%' }} onClick={() => fileRef.current?.click()} disabled={atLimit}>
            {t.studio.addImage} — {sideLabel}
          </button>
          {atLimit && <p style={{ color: '#666', fontSize: '0.68rem', margin: '0.4rem 0 0', textAlign: 'center' }}>{t.studio.layerLimit}</p>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.65rem' }}>
          <input
            type="text"
            value={textDraft}
            maxLength={48}
            placeholder={t.studio.customTextPlaceholder}
            onChange={(e) => { setTextDraft(e.target.value); setTextError(''); }}
            style={{ width: '100%', background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.6rem', fontSize: '0.9rem' }}
          />

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span className="plt-label">{t.studio.textColor}</span>
              <span style={{ color: '#666', fontSize: '0.72rem' }}>{textDraft.length}/48</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {TEXT_COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  title={opt.label}
                  onClick={() => setTextColor(opt.hex)}
                  style={{
                    width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', background: opt.hex,
                    border: textColor === opt.hex ? '2px solid #e2001a' : '2px solid rgba(255,255,255,0.25)',
                    boxShadow: textColor === opt.hex ? '0 0 0 2px rgba(226,0,26,0.3)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span className="plt-label">{t.studio.fontSize}</span>
            </div>
            <input type="range" min={0.6} max={1.6} step="0.05" value={textFontScale}
              onChange={(e) => setTextFontScale(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#e2001a', cursor: 'pointer' }} />
          </div>

          {textError && <p style={{ color: '#f87171', fontSize: '0.72rem', margin: 0 }}>{textError}</p>}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="plt-btn-primary"
              style={{ flex: 1 }}
              onClick={applyText}
              disabled={!textDraft.trim() || (!selectedLayer && atLimit)}
            >
              {selectedLayer?.kind === 'text' ? t.studio.updateText : t.studio.addText} — {sideLabel}
            </button>
            {selectedLayer?.kind === 'text' && !atLimit && (
              <button type="button" className="plt-btn-secondary" onClick={startNewText} title={t.studio.newText}>
                +
              </button>
            )}
          </div>
        </div>
      )}

      {currentLayers.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.65rem' }}>
          {currentLayers.map((layer, idx) => (
            <div
              key={layer.id}
              onClick={() => selectLayer(layer.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.4rem', borderRadius: '8px', cursor: 'pointer',
                background: layer.id === selectedId ? 'rgba(226,0,26,0.15)' : 'rgba(255,255,255,0.05)',
                border: layer.id === selectedId ? '1px solid #e2001a' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {layer.kind === 'image' ? (
                <img src={layer.src} alt="" style={{ width: 18, height: 18, objectFit: 'cover', borderRadius: 4 }} />
              ) : (
                <span style={{ width: 18, height: 18, borderRadius: 4, background: layer.color, display: 'inline-block' }} />
              )}
              <span style={{ fontSize: '0.68rem', color: '#ccc', maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {layer.kind === 'text' ? layer.text : `${t.studio.imageTab} ${idx + 1}`}
              </span>
              <button type="button" title={t.studio.moveBackward} onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'backward'); }} disabled={idx === 0} style={miniBtnStyle}>↓</button>
              <button type="button" title={t.studio.moveForward} onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'forward'); }} disabled={idx === currentLayers.length - 1} style={miniBtnStyle}>↑</button>
              <button type="button" title={t.studio.remove} onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }} style={{ ...miniBtnStyle, color: '#f87171' }}>×</button>
            </div>
          ))}
        </div>
      )}

      {selectedLayer && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span className="plt-label">{t.studio.zoom}</span>
              <span style={{ color: '#666', fontSize: '0.72rem' }}>{Math.round(selectedLayer.transform.scale * 100)}%</span>
            </div>
            <input type="range" min={PRINT_SPEC.scaleMin} max={PRINT_SPEC.scaleMax} step="0.05" value={selectedLayer.transform.scale}
              onChange={(e) => setSelectedScale(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#e2001a', cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="plt-btn-secondary" style={{ flex: 1 }} onClick={centerSelected}>{t.studio.center}</button>
            <button type="button" className="plt-btn-secondary" style={{ flex: 1, color: '#f87171' }} onClick={() => removeLayer(selectedLayer.id)}>{t.studio.remove}</button>
          </div>
          {uploadHint && (
            <p style={{ color: '#fbbf24', fontSize: '0.68rem', lineHeight: 1.45, margin: 0, textAlign: 'center' }}>{uploadHint}</p>
          )}
          <p className="plt-label" style={{ textAlign: 'center', margin: 0, color: '#555' }}>
            {t.studio.dragHint.replace('{size}', formatSizeMm())}
          </p>
          <p className="plt-label" style={{ textAlign: 'center', margin: 0, color: '#444', fontSize: '0.65rem' }}>
            {getNoPrintNote(productId)}
          </p>
        </div>
      )}
    </div>
  );
}
