'use client';

import React, { useState, useRef } from 'react';

interface DesignStudioProps {
  shirtColor?: string;
  onDesignChange?: (data: { front: string | null; back: string | null }) => void;
}

export default function DesignStudio({ shirtColor = '#f5f5f5', onDesignChange }: DesignStudioProps) {
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [frontImg, setFrontImg] = useState<string | null>(null);
  const [backImg, setBackImg] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [posY, setPosY] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const isDark = ['#111111', '#111', '#000', '#000000'].includes(shirtColor);
  const lineColor = isDark ? '#333' : '#ddd';
  const currentImg = side === 'front' ? frontImg : backImg;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (side === 'front') { setFrontImg(dataUrl); onDesignChange?.({ front: dataUrl, back: backImg }); }
      else { setBackImg(dataUrl); onDesignChange?.({ front: frontImg, back: dataUrl }); }
      setScale(1); setPosY(0);
    };
    reader.readAsDataURL(file);
  };

  const removeImg = () => {
    if (side === 'front') { setFrontImg(null); onDesignChange?.({ front: null, back: backImg }); }
    else { setBackImg(null); onDesignChange?.({ front: frontImg, back: null }); }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>

      {/* Vorder-/Rückseite Umschalter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['front', 'back'] as const).map((s) => (
          <button key={s} onClick={() => setSide(s)} style={{
            padding: '0.4rem 1.1rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
            background: side === s ? '#e2001a' : 'rgba(0,0,0,0.4)',
            color: '#fff', border: 'none', letterSpacing: '0.05em',
          }}>
            {s === 'front' ? 'VORDERSEITE' : 'RÜCKSEITE'}
          </button>
        ))}
      </div>

      {/* Shirt-Mockup mit Druckflaeche */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <svg width="260" height="320" viewBox="0 0 260 320" style={{ filter: `drop-shadow(0 14px 24px rgba(0,0,0,${isDark ? 0.5 : 0.25}))` }}>
          <path
            d="M80 55 L110 28 L150 28 L180 55 L218 82 L194 116 L172 100 L172 300 L88 300 L88 100 L66 116 L42 82 Z"
            fill={shirtColor} stroke={lineColor} strokeWidth="2"
          />
          {side === 'front'
            ? <path d="M110 28 Q130 58 150 28" fill="none" stroke={lineColor} strokeWidth="2"/>
            : <path d="M110 28 Q130 38 150 28" fill="none" stroke={lineColor} strokeWidth="2"/>}
          {/* Druckflaeche definieren als clip */}
          <defs>
            <clipPath id="printArea">
              <rect x="95" y="110" width="70" height="95" rx="2" />
            </clipPath>
          </defs>
          {/* Druckflaeche-Rahmen (gestrichelt, nur wenn kein Bild) */}
          {!currentImg && (
            <rect x="95" y="110" width="70" height="95" rx="2" fill="none" stroke={isDark ? '#555' : '#bbb'} strokeWidth="1.5" strokeDasharray="5 4" />
          )}
          {/* Kunden-Bild auf der Druckflaeche */}
          {currentImg && (
            <image
              href={currentImg}
              x={95 + 35 - (35 * scale)}
              y={110 + 47.5 - (47.5 * scale) + posY}
              width={70 * scale}
              height={95 * scale}
              clipPath="url(#printArea)"
              preserveAspectRatio="xMidYMid meet"
            />
          )}
        </svg>

        {/* Seiten-Label */}
        <div style={{ position: 'absolute', top: '0.25rem', left: '50%', transform: 'translateX(-50%)', color: isDark ? '#888' : '#999', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
          {side === 'front' ? 'Vorderseite' : 'Rückseite'}
        </div>
      </div>

      {/* Upload + Steuerung */}
      <div style={{ width: '100%', maxWidth: '300px', marginTop: '1rem' }}>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />

        {!currentImg ? (
          <button onClick={() => fileRef.current?.click()} style={{
            width: '100%', background: '#e2001a', color: '#fff', border: 'none', borderRadius: '10px',
            padding: '0.75rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', letterSpacing: '0.03em',
          }}>
            ⬆ Bild hochladen ({side === 'front' ? 'Vorderseite' : 'Rückseite'})
          </button>
        ) : (
          <>
            <div style={{ marginBottom: '0.6rem' }}>
              <label style={{ color: '#888', fontSize: '0.7rem', display: 'block', marginBottom: '0.25rem' }}>Größe</label>
              <input type="range" min="0.4" max="1.6" step="0.05" value={scale} onChange={(e) => setScale(Number(e.target.value))} style={{ width: '100%', accentColor: '#e2001a' }} />
            </div>
            <div style={{ marginBottom: '0.6rem' }}>
              <label style={{ color: '#888', fontSize: '0.7rem', display: 'block', marginBottom: '0.25rem' }}>Höhe</label>
              <input type="range" min="-40" max="40" step="2" value={posY} onChange={(e) => setPosY(Number(e.target.value))} style={{ width: '100%', accentColor: '#e2001a' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => fileRef.current?.click()} style={{ flex: 1, background: '#1a1a1a', color: '#fff', border: '1px solid #333', borderRadius: '8px', padding: '0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}>Ändern</button>
              <button onClick={removeImg} style={{ flex: 1, background: '#1a1a1a', color: '#f87171', border: '1px solid #333', borderRadius: '8px', padding: '0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}>Entfernen</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
