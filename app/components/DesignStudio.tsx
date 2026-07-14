'use client';
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { calcUnitPrice } from '@/lib/pricing';
import { PRINT_SPEC, getPrintOverlayBox } from '@/lib/print-spec';
const Shirt3D = dynamic(() => import('./Shirt3D'), { ssr: false });

interface DesignStudioProps {
  shirtColor?: string;
  onDesignChange?: (data: { front: string | null; back: string | null }) => void;
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

  useEffect(() => { onDesignChange?.({ front: frontImg, back: backImg }); }, [frontImg, backImg]);

  const currentImg = side === 'front' ? frontImg : backImg;
  const currentScale = side === 'front' ? frontScale : backScale;
  const currentPos = side === 'front' ? frontPos : backPos;
  const setCurrentScale = (v: number) => side === 'front' ? setFrontScale(v) : setBackScale(v);
  const setCurrentPos = (p: { x: number; y: number }) => side === 'front' ? setFrontPos(p) : setBackPos(p);

  const switchSide = (newSide: 'front' | 'back') => {
    if (newSide === side) return;
    setFlipping(true);
    setTimeout(() => { setSide(newSide); setFlipping(false); }, 300);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const probe = new window.Image();
      probe.onload = () => {
        const short = Math.min(probe.width, probe.height);
        const ratio = probe.width / probe.height;
        const a4 = PRINT_SPEC.aspectRatio;
        if (short < PRINT_SPEC.minUploadPx) {
          setUploadHint(`Auflösung niedrig (${probe.width}×${probe.height}). Empfohlen: ${PRINT_SPEC.widthPx}×${PRINT_SPEC.heightPx} px.`);
        } else if (Math.abs(ratio - a4) > 0.25 && Math.abs(ratio - 1 / a4) > 0.25) {
          setUploadHint(`Seitenverhältnis weicht von DIN A4 ab. Hochformat (${PRINT_SPEC.widthMm}×${PRINT_SPEC.heightMm} mm) liefert das beste Ergebnis.`);
        } else {
          setUploadHint('');
        }
        if (side === 'front') setFrontImg(dataUrl);
        else setBackImg(dataUrl);
        setCurrentScale(1); setCurrentPos({ x: 0, y: 0 });
      };
      probe.onerror = () => {
        setUploadHint('');
        if (side === 'front') setFrontImg(dataUrl);
        else setBackImg(dataUrl);
        setCurrentScale(1); setCurrentPos({ x: 0, y: 0 });
      };
      probe.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeImg = () => {
    if (side === 'front') setFrontImg(null);
    else setBackImg(null);
    setCurrentPos({ x: 0, y: 0 }); setCurrentScale(1);
  };

  const startDrag = (clientX: number, clientY: number) => {
    if (!currentImg) return;
    setDragging(true);
    dragStart.current = { mx: clientX, my: clientY, px: currentPos.x, py: currentPos.y };
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (!dragging || !dragStart.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = 100 / rect.width;
    const scaleY = 100 / rect.height;
    const dx = (clientX - dragStart.current.mx) * scaleX;
    const dy = (clientY - dragStart.current.my) * scaleY;
    const limit = PRINT_SPEC.maxOffsetPercent;
    setCurrentPos({
      x: Math.max(-limit, Math.min(limit, dragStart.current.px + dx)),
      y: Math.max(-limit, Math.min(limit, dragStart.current.py + dy)),
    });
  };

  const endDrag = () => { setDragging(false); dragStart.current = null; };

  const printStyle: React.CSSProperties = {
    ...getPrintOverlayBox(),
    cursor: currentImg ? (dragging ? 'grabbing' : 'grab') : 'default',
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', boxSizing: 'border-box' }}>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', padding: '0.25rem' }}>
        {(['front', 'back'] as const).map((s) => (
          <button key={s} onClick={() => switchSide(s)} style={{
            padding: '0.45rem 1.25rem', borderRadius: '999px', cursor: 'pointer',
            fontSize: '0.72rem', fontWeight: 700, border: 'none', letterSpacing: '0.08em',
            background: side === s ? '#e2001a' : 'transparent',
            color: side === s ? '#fff' : '#666',
            transition: 'all 0.2s',
          }}>
            {s === 'front' ? 'VORDERSEITE' : 'RÜCKSEITE'}
            {s === 'front' && frontImg && <span style={{ marginLeft: '0.4rem', width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', verticalAlign: 'middle' }} />}
            {s === 'back' && backImg && <span style={{ marginLeft: '0.4rem', width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', verticalAlign: 'middle' }} />}
          </button>
        ))}
        <button onClick={() => setPreview360(v => !v)} style={{
          padding: '0.45rem 1.25rem', borderRadius: '999px', cursor: 'pointer',
          fontSize: '0.72rem', fontWeight: 700, border: 'none', letterSpacing: '0.08em',
          background: preview360 ? '#e2001a' : 'transparent',
          color: preview360 ? '#fff' : '#666',
          transition: 'all 0.2s',
        }}>
          360°
        </button>
      </div>

      {/* LIVE-PREIS */}
      <div style={{ width: '100%', maxWidth: '380px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '0.6rem 1rem' }}>
        <span style={{ color: '#888', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Dein Preis {frontImg && backImg ? '(2 Seiten bedruckt)' : (frontImg || backImg) ? '(1 Seite bedruckt)' : ''}
        </span>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
          €{calcUnitPrice(frontImg, backImg).toFixed(2)}
        </span>
      </div>

      {/* 360-GRAD-VORSCHAU */}
      {preview360 && (
        <div style={{ width: '100%', maxWidth: '420px', aspectRatio: '4/5' }}>
          <Shirt3D
            frontPrint={frontImg ? { src: frontImg, x: frontPos.x, y: frontPos.y, scale: frontScale } : undefined}
            backPrint={backImg ? { src: backImg, x: backPos.x, y: backPos.y, scale: backScale } : undefined}
          />
        </div>
      )}

      {!preview360 && (
      <>

      {/* Shirt-Container */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          aspectRatio: '4/5',
          opacity: flipping ? 0 : 1,
          transform: flipping ? 'scale(0.97)' : 'scale(1)',
          transition: 'opacity 0.3s, transform 0.3s',
          background: 'transparent',
        }}
        onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchMove={(e) => { const t = e.touches[0]; moveDrag(t.clientX, t.clientY); }}
        onTouchEnd={endDrag}
      >
        {/* Echtes Shirt-Foto */}
        <img
          src={side === 'front' ? '/airfit-front-t.png' : '/airfit-back-t.png'}
          alt={side === 'front' ? 'Vorderseite' : 'Rückseite'}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', userSelect: 'none', pointerEvents: 'none', filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.45))' }}
          draggable={false}
        />

        {/* Druckfläche */}
        <div
          style={printStyle}
          onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
          onTouchStart={(e) => { const t = e.touches[0]; startDrag(t.clientX, t.clientY); }}
        >
          {/* Gestrichelte Linie wenn kein Bild */}
          {!currentImg && (
            <div style={{
              position: 'absolute', inset: 0,
              border: '1.5px dashed rgba(255,255,255,0.25)',
              borderRadius: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.4 }}>
                DIN A4 · Hochformat<br />{PRINT_SPEC.widthMm}×{PRINT_SPEC.heightMm} mm
              </span>
            </div>
          )}

          {/* Kunden-Motiv */}
          {currentImg && (
            <img
              src={currentImg}
              alt="Motiv"
              style={{
                position: 'absolute',
                width: `${currentScale * 100}%`,
                height: `${currentScale * 100}%`,
                objectFit: 'contain',
                top: `${50 + currentPos.y}%`,
                left: `${50 + currentPos.x}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
              draggable={false}
            />
          )}
        </div>
      </div>

      {/* Upload + Steuerung */}
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />

        {!currentImg ? (
          <button onClick={() => fileRef.current?.click()} style={{
            width: '100%', background: '#e2001a', color: '#fff', border: 'none',
            borderRadius: '12px', padding: '0.75rem', fontWeight: 700,
            fontSize: '0.85rem', cursor: 'pointer', letterSpacing: '0.04em',
          }}>
            ⬆ Motiv hochladen ({side === 'front' ? 'Vorderseite' : 'Rückseite'})
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <label style={{ color: '#666', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Größe</label>
                <span style={{ color: '#555', fontSize: '0.7rem' }}>{Math.round(currentScale * 100)}%</span>
              </div>
              <input type="range" min={PRINT_SPEC.scaleMin} max={PRINT_SPEC.scaleMax} step="0.05" value={currentScale}
                onChange={(e) => setCurrentScale(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#e2001a', cursor: 'pointer' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setCurrentPos({ x: 0, y: 0 })} style={{ flex: 1, background: '#111', color: '#888', border: '1px solid #222', borderRadius: '10px', padding: '0.5rem', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}>Zentrieren</button>
              <button onClick={() => fileRef.current?.click()} style={{ flex: 1, background: '#111', color: '#fff', border: '1px solid #222', borderRadius: '10px', padding: '0.5rem', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}>Ändern</button>
              <button onClick={removeImg} style={{ flex: 1, background: '#111', color: '#f87171', border: '1px solid #222', borderRadius: '10px', padding: '0.5rem', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}>Entfernen</button>
            </div>
            {uploadHint && (
              <p style={{ textAlign: 'center', color: '#fbbf24', fontSize: '0.68rem', lineHeight: 1.45, margin: 0 }}>
                ⚠ {uploadHint}
              </p>
            )}
            <p style={{ textAlign: 'center', color: '#444', fontSize: '0.65rem', letterSpacing: '0.08em' }}>
              ✋ Motiv auf dem Shirt ziehen zum Positionieren
            </p>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}
