'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { calcUnitPrice } from '@/lib/pricing';
import { PRINT_SPEC, SHIRT_VIEWER_ASPECT } from '@/lib/print-spec';
import { defaultPrintTransform, type PrintTransform } from '@/lib/print-position';
import ShirtPrintOverlay from './ShirtPrintOverlay';

const Shirt3D = dynamic(() => import('./Shirt3D'), { ssr: false });

export interface DesignState {
  front: string | null;
  back: string | null;
  frontTransform: PrintTransform;
  backTransform: PrintTransform;
}

interface DesignStudioProps {
  shirtColor?: string;
  onDesignChange?: (data: DesignState) => void;
}

export default function DesignStudio({ onDesignChange }: DesignStudioProps) {
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

  useEffect(() => {
    onDesignChange?.({
      front: frontImg,
      back: backImg,
      frontTransform: { scale: frontScale, x: frontPos.x, y: frontPos.y },
      backTransform: { scale: backScale, x: backPos.x, y: backPos.y },
    });
  }, [frontImg, backImg, frontScale, backScale, frontPos, backPos, onDesignChange]);

  const currentImg = side === 'front' ? frontImg : backImg;
  const currentScale = side === 'front' ? frontScale : backScale;
  const currentPos = side === 'front' ? frontPos : backPos;
  const setCurrentScale = (v: number) => (side === 'front' ? setFrontScale(v) : setBackScale(v));
  const setCurrentPos = (p: { x: number; y: number }) => (side === 'front' ? setFrontPos(p) : setBackPos(p));

  const switchSide = (newSide: 'front' | 'back') => {
    if (newSide === side) return;
    setFlipping(true);
    setTimeout(() => { setSide(newSide); setFlipping(false); }, 280);
  };

  const applyUpload = (dataUrl: string, w: number, h: number) => {
    const ratio = w / h;
    const target = PRINT_SPEC.aspectRatio;
    if (Math.min(w, h) < PRINT_SPEC.minUploadPx) {
      setUploadHint(`Auflösung niedrig (${w}×${h}). Empfohlen: ${PRINT_SPEC.widthPx}×${PRINT_SPEC.heightPx} px.`);
    } else if (Math.abs(ratio - target) > 0.25 && Math.abs(ratio - 1 / target) > 0.25) {
      setUploadHint(`Seitenverhältnis weicht ab. ${PRINT_SPEC.widthMm} × ${PRINT_SPEC.heightMm} mm liefert das beste Ergebnis.`);
    } else {
      setUploadHint('');
    }
    const t = defaultPrintTransform();
    if (side === 'front') { setFrontImg(dataUrl); setFrontScale(t.scale); setFrontPos({ x: t.x, y: t.y }); }
    else { setBackImg(dataUrl); setBackScale(t.scale); setBackPos({ x: t.x, y: t.y }); }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const probe = new window.Image();
      probe.onload = () => applyUpload(dataUrl, probe.width, probe.height);
      probe.onerror = () => applyUpload(dataUrl, 0, 0);
      probe.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeImg = () => {
    if (side === 'front') setFrontImg(null); else setBackImg(null);
    setCurrentPos({ x: 0, y: 0 }); setCurrentScale(1);
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
    const dx = (clientX - dragStart.current.mx) * (100 / rect.width);
    const dy = (clientY - dragStart.current.my) * (100 / rect.height);
    const limit = PRINT_SPEC.maxOffsetPercent;
    setCurrentPos({
      x: Math.max(-limit, Math.min(limit, dragStart.current.px + dx)),
      y: Math.max(-limit, Math.min(limit, dragStart.current.py + dy)),
    });
  };

  const endDrag = () => { setDragging(false); dragStart.current = null; };

  const printData = (img: string | null, scale: number, pos: { x: number; y: number }) =>
    img ? { src: img, x: pos.x, y: pos.y, scale } : undefined;

  return (
    <div className="plt-card" style={{ padding: '1.25rem', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
      <div className="plt-tab-group" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
        {(['front', 'back'] as const).map((s) => (
          <button key={s} type="button" onClick={() => switchSide(s)} className={`plt-tab${side === s ? ' plt-tab-active' : ''}`}>
            {s === 'front' ? 'VORDERSEITE' : 'RÜCKSEITE'}
            {(s === 'front' ? frontImg : backImg) && (
              <span style={{ marginLeft: '0.35rem', width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            )}
          </button>
        ))}
        <button type="button" onClick={() => setPreview360(v => !v)} className={`plt-tab${preview360 ? ' plt-tab-active' : ''}`}>360°</button>
      </div>

      <div className="plt-price-bar" style={{ marginBottom: '1rem' }}>
        <span className="plt-label" style={{ margin: 0 }}>
          Preis {frontImg && backImg ? '· 2 Seiten' : (frontImg || backImg) ? '· 1 Seite' : ''}
        </span>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.15rem' }}>€{calcUnitPrice(frontImg, backImg).toFixed(2)}</span>
      </div>

      {preview360 ? (
        <div style={{ width: '100%', aspectRatio: SHIRT_VIEWER_ASPECT, marginBottom: '1rem' }}>
          <Shirt3D
            frontPrint={printData(frontImg, frontScale, frontPos)}
            backPrint={printData(backImg, backScale, backPos)}
          />
        </div>
      ) : (
        <div
          ref={containerRef}
          style={{
            position: 'relative', width: '100%', aspectRatio: SHIRT_VIEWER_ASPECT, marginBottom: '1rem',
            opacity: flipping ? 0.4 : 1, transform: flipping ? 'scale(0.98)' : 'scale(1)',
            transition: 'opacity 0.28s, transform 0.28s',
          }}
          onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchMove={(e) => { const t = e.touches[0]; moveDrag(t.clientX, t.clientY); }}
          onTouchEnd={endDrag}
        >
          <img
            src={side === 'front' ? '/airfit-front-t.png' : '/airfit-back-t.png'}
            alt={side === 'front' ? 'Vorderseite' : 'Rückseite'}
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
          />
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />

      {!currentImg ? (
        <button type="button" className="plt-btn-primary" style={{ width: '100%' }} onClick={() => fileRef.current?.click()}>
          Motiv hochladen — {side === 'front' ? 'Vorderseite' : 'Rückseite'}
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span className="plt-label">Zoom</span>
              <span style={{ color: '#666', fontSize: '0.72rem' }}>{Math.round(currentScale * 100)}%</span>
            </div>
            <input type="range" min={PRINT_SPEC.scaleMin} max={PRINT_SPEC.scaleMax} step="0.05" value={currentScale}
              onChange={(e) => setCurrentScale(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#e2001a', cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="plt-btn-secondary" style={{ flex: 1 }} onClick={() => setCurrentPos({ x: 0, y: 0 })}>Zentrieren</button>
            <button type="button" className="plt-btn-secondary" style={{ flex: 1 }} onClick={() => fileRef.current?.click()}>Ändern</button>
            <button type="button" className="plt-btn-secondary" style={{ flex: 1, color: '#f87171' }} onClick={removeImg}>Entfernen</button>
          </div>
          {uploadHint && (
            <p style={{ color: '#fbbf24', fontSize: '0.68rem', lineHeight: 1.45, margin: 0, textAlign: 'center' }}>{uploadHint}</p>
          )}
          <p className="plt-label" style={{ textAlign: 'center', margin: 0, color: '#555' }}>
            Motiv ziehen zum Positionieren · Druckfläche {PRINT_SPEC.widthMm} × {PRINT_SPEC.heightMm} mm
          </p>
        </div>
      )}
    </div>
  );
}