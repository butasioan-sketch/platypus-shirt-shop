'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { calcUnitPriceForProduct } from '@/lib/pricing';
import { PRINT_SPEC, formatSizeMm, NO_PRINT_NOTE, getPlacementZone, getGarmentPhotoSrc, getViewerAspect } from '@/lib/print-spec';
import { defaultPrintTransform, type PrintTransform } from '@/lib/print-position';
import { renderTextImage } from '@/lib/print-text';
import { useLocale } from '@/app/components/LocaleProvider';
import ShirtPrintOverlay from './ShirtPrintOverlay';

const Shirt3D = dynamic(() => import('./Shirt3D'), { ssr: false });

export interface TextLayerMeta {
  templateId?: string;
  text: string;
  fontScale: number;
}

export interface Template {
  id: string;
  text: string;
  meaning?: string;
  category?: string;
}

export interface DesignState {
  front: string | null;
  back: string | null;
  frontTransform: PrintTransform;
  backTransform: PrintTransform;
  frontText: TextLayerMeta | null;
  backText: TextLayerMeta | null;
}

interface DesignStudioProps {
  productId?: string;
  shirtColor?: string;
  onDesignChange?: (data: DesignState) => void;
}

export default function DesignStudio({ productId = '1', onDesignChange }: DesignStudioProps) {
  const { t } = useLocale();
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [preview360, setPreview360] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [frontImg, setFrontImg] = useState<string | null>(null);
  const [backImg, setBackImg] = useState<string | null>(null);
  const [frontScale, setFrontScale] = useState(1);
  const [backScale, setBackScale] = useState(1);
  const [frontPos, setFrontPos] = useState({ x: 0, y: 0 });
  const [backPos, setBackPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [uploadHint, setUploadHint] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);

  // Text-Motiv: wird als Bild gerendert und lauft danach durch dieselbe Pipeline
  // wie ein Upload (Zoom/Position/Druckblatt/Kundenblick) — siehe lib/print-text.ts.
  const [templates, setTemplates] = useState<Template[]>([]);
  const [inputMode, setInputMode] = useState<'image' | 'text'>('image');
  const [frontSource, setFrontSource] = useState<'image' | 'text' | null>(null);
  const [backSource, setBackSource] = useState<'image' | 'text' | null>(null);
  const [frontTextMeta, setFrontTextMeta] = useState<TextLayerMeta | null>(null);
  const [backTextMeta, setBackTextMeta] = useState<TextLayerMeta | null>(null);
  const [textDraft, setTextDraft] = useState('');
  const [textTemplateId, setTextTemplateId] = useState('');
  const [textFontScale, setTextFontScale] = useState(1);
  const [textError, setTextError] = useState('');

  useEffect(() => {
    fetch('/api/templates')
      .then((r) => r.json())
      .then((d) => setTemplates(Array.isArray(d?.templates) ? d.templates : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    onDesignChange?.({
      front: frontImg,
      back: backImg,
      frontTransform: { scale: frontScale, x: frontPos.x, y: frontPos.y },
      backTransform: { scale: backScale, x: backPos.x, y: backPos.y },
      frontText: frontTextMeta,
      backText: backTextMeta,
    });
  }, [frontImg, backImg, frontScale, backScale, frontPos, backPos, frontTextMeta, backTextMeta, onDesignChange]);

  const currentImg = side === 'front' ? frontImg : backImg;
  const currentScale = side === 'front' ? frontScale : backScale;
  const currentPos = side === 'front' ? frontPos : backPos;
  const currentSource = side === 'front' ? frontSource : backSource;
  const currentTextMeta = side === 'front' ? frontTextMeta : backTextMeta;
  const setCurrentScale = (v: number) => (side === 'front' ? setFrontScale(v) : setBackScale(v));
  const setCurrentPos = (p: { x: number; y: number }) => (side === 'front' ? setFrontPos(p) : setBackPos(p));
  const setCurrentSource = (s: 'image' | 'text' | null) => (side === 'front' ? setFrontSource(s) : setBackSource(s));
  const setCurrentTextMeta = (m: TextLayerMeta | null) => (side === 'front' ? setFrontTextMeta(m) : setBackTextMeta(m));

  const switchSide = (newSide: 'front' | 'back') => {
    if (newSide === side) return;
    setFlipping(true);
    setTimeout(() => { setSide(newSide); setFlipping(false); }, 280);
  };

  const applyUpload = (dataUrl: string, w: number, h: number, source: 'image' | 'text' = 'image') => {
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
    const tr = defaultPrintTransform();
    if (side === 'front') { setFrontImg(dataUrl); setFrontScale(tr.scale); setFrontPos({ x: tr.x, y: tr.y }); }
    else { setBackImg(dataUrl); setBackScale(tr.scale); setBackPos({ x: tr.x, y: tr.y }); }
    setCurrentSource(source);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const probe = new window.Image();
      probe.onload = () => applyUpload(dataUrl, probe.width, probe.height, 'image');
      probe.onerror = () => applyUpload(dataUrl, 0, 0, 'image');
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
    const { dataUrl, width, height } = renderTextImage(trimmed, textFontScale);
    applyUpload(dataUrl, width, height, 'text');
    setCurrentTextMeta({ templateId: textTemplateId || undefined, text: trimmed, fontScale: textFontScale });
  };

  const editText = () => {
    if (currentTextMeta) {
      setTextDraft(currentTextMeta.text);
      setTextTemplateId(currentTextMeta.templateId || '');
      setTextFontScale(currentTextMeta.fontScale);
    }
    setTextError('');
    setInputMode('text');
    if (side === 'front') setFrontImg(null); else setBackImg(null);
  };

  const removeImg = () => {
    if (side === 'front') { setFrontImg(null); setFrontTextMeta(null); } else { setBackImg(null); setBackTextMeta(null); }
    setCurrentPos({ x: 0, y: 0 }); setCurrentScale(1); setCurrentSource(null);
  };

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!currentImg) return;
    e.preventDefault();
    const pt = 'touches' in e ? e.touches[0] : e;
    setDragging(true);
    dragStart.current = { mx: pt.clientX, my: pt.clientY, px: currentPos.x, py: currentPos.y };
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (!dragging || !dragStart.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const zone = getPlacementZone(side, productId);
    // 1:1-Drag: Pixel-Delta -> Prozent des Containers -> Prozent der (kleineren) Placement-Zone
    const dx = (clientX - dragStart.current.mx) * (100 / rect.width) * (100 / zone.width);
    const dy = (clientY - dragStart.current.my) * (100 / rect.height) * (100 / zone.height);
    const limit = PRINT_SPEC.maxOffsetPercent;
    setCurrentPos({
      x: Math.max(-limit, Math.min(limit, dragStart.current.px + dx)),
      y: Math.max(-limit, Math.min(limit, dragStart.current.py + dy)),
    });
  };

  const endDrag = () => { setDragging(false); dragStart.current = null; };

  const printData = (img: string | null, scale: number, pos: { x: number; y: number }) =>
    img ? { src: img, x: pos.x, y: pos.y, scale } : undefined;

  const sideLabel = side === 'front' ? t.studio.front : t.studio.back;
  const priceSuffix = frontImg && backImg ? t.studio.twoSides : (frontImg || backImg) ? t.studio.oneSide : '';

  return (
    <div className="plt-card" style={{ padding: '1.25rem', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
      <div className="plt-tab-group" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
        {(['front', 'back'] as const).map((s) => (
          <button key={s} type="button" onClick={() => switchSide(s)} className={`plt-tab${side === s ? ' plt-tab-active' : ''}`}>
            {s === 'front' ? t.studio.front.toUpperCase() : t.studio.back.toUpperCase()}
            {(s === 'front' ? frontImg : backImg) && (
              <span style={{ marginLeft: '0.35rem', width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            )}
          </button>
        ))}
        <button type="button" onClick={() => setPreview360(v => !v)} className={`plt-tab${preview360 ? ' plt-tab-active' : ''}`}>360°</button>
      </div>

      <div className="plt-price-bar" style={{ marginBottom: '1rem' }}>
        <span className="plt-label" style={{ margin: 0 }}>{t.studio.price} {priceSuffix}</span>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.15rem' }}>€{calcUnitPriceForProduct(productId, (frontImg ? 1 : 0) + (backImg ? 1 : 0)).toFixed(2)}</span>
      </div>

      {preview360 ? (
        <div style={{ width: '100%', aspectRatio: getViewerAspect(productId), marginBottom: '1rem' }}>
          <Shirt3D
            frontPrint={printData(frontImg, frontScale, frontPos)}
            backPrint={printData(backImg, backScale, backPos)}
            frontSrc={getGarmentPhotoSrc('front', productId)}
            backSrc={getGarmentPhotoSrc('back', productId)}
            productId={productId}
            fallback="flip"
          />
        </div>
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
            imageSrc={currentImg}
            scale={currentScale}
            pos={currentPos}
            interactive={!!currentImg}
            onPointerDown={startDrag}
            productId={productId}
          />
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />

      {!currentImg ? (
        <div>
          <div className="plt-tab-group" style={{ marginBottom: '0.75rem' }}>
            <button type="button" onClick={() => setInputMode('image')} className={`plt-tab${inputMode === 'image' ? ' plt-tab-active' : ''}`}>
              {t.studio.imageTab}
            </button>
            <button type="button" onClick={() => setInputMode('text')} className={`plt-tab${inputMode === 'text' ? ' plt-tab-active' : ''}`}>
              {t.studio.textTab}
            </button>
          </div>

          {inputMode === 'image' ? (
            <button type="button" className="plt-btn-primary" style={{ width: '100%' }} onClick={() => fileRef.current?.click()}>
              {t.studio.upload} — {sideLabel}
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <select
                value={textTemplateId}
                onChange={(e) => {
                  const id = e.target.value;
                  setTextTemplateId(id);
                  const tpl = templates.find((x) => x.id === id);
                  if (tpl) { setTextDraft(tpl.text); setTextError(''); }
                }}
                style={{ width: '100%', background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.6rem', fontSize: '0.85rem' }}
              >
                <option value="">{t.studio.templatePlaceholder} ({templates.length})</option>
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>{tpl.id} · {tpl.text}</option>
                ))}
              </select>

              <input
                type="text"
                value={textDraft}
                maxLength={48}
                placeholder={t.studio.customTextPlaceholder}
                onChange={(e) => { setTextDraft(e.target.value); setTextTemplateId(''); setTextError(''); }}
                style={{ width: '100%', background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.6rem', fontSize: '0.9rem' }}
              />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span className="plt-label">{t.studio.fontSize}</span>
                  <span style={{ color: '#666', fontSize: '0.72rem' }}>{textDraft.length}/48</span>
                </div>
                <input type="range" min={0.6} max={1.6} step="0.05" value={textFontScale}
                  onChange={(e) => setTextFontScale(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#e2001a', cursor: 'pointer' }} />
              </div>

              {textError && <p style={{ color: '#f87171', fontSize: '0.72rem', margin: 0 }}>{textError}</p>}

              <button type="button" className="plt-btn-primary" style={{ width: '100%' }} onClick={applyText} disabled={!textDraft.trim()}>
                {t.studio.applyText} — {sideLabel}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span className="plt-label">{t.studio.zoom}</span>
              <span style={{ color: '#666', fontSize: '0.72rem' }}>{Math.round(currentScale * 100)}%</span>
            </div>
            <input type="range" min={PRINT_SPEC.scaleMin} max={PRINT_SPEC.scaleMax} step="0.05" value={currentScale}
              onChange={(e) => setCurrentScale(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#e2001a', cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="plt-btn-secondary" style={{ flex: 1 }} onClick={() => setCurrentPos({ x: 0, y: 0 })}>{t.studio.center}</button>
            <button type="button" className="plt-btn-secondary" style={{ flex: 1 }} onClick={() => currentSource === 'text' ? editText() : fileRef.current?.click()}>{t.studio.change}</button>
            <button type="button" className="plt-btn-secondary" style={{ flex: 1, color: '#f87171' }} onClick={removeImg}>{t.studio.remove}</button>
          </div>
          {uploadHint && (
            <p style={{ color: '#fbbf24', fontSize: '0.68rem', lineHeight: 1.45, margin: 0, textAlign: 'center' }}>{uploadHint}</p>
          )}
          <p className="plt-label" style={{ textAlign: 'center', margin: 0, color: '#555' }}>
            {t.studio.dragHint.replace('{size}', formatSizeMm())}
          </p>
          <p className="plt-label" style={{ textAlign: 'center', margin: 0, color: '#444', fontSize: '0.65rem' }}>
            {NO_PRINT_NOTE}
          </p>
        </div>
      )}
    </div>
  );
}