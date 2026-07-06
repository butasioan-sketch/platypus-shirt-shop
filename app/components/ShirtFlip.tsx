'use client';
import { useEffect, useRef, useState } from 'react';

export default function ShirtFlip() {
  const [rot, setRot] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const idle = useRef(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let last = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      if (idle.current && !dragging.current) {
        setRot(r => r + (t - last) * 0.025);
      }
      last = t;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    idle.current = false;
    lastX.current = e.clientX;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setRot(r => r + (e.clientX - lastX.current) * 0.6);
    lastX.current = e.clientX;
  };
  const onUp = () => {
    dragging.current = false;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => { idle.current = true; }, 4000);
  };
  return (
    <div
      onPointerDown={onDown} onPointerMove={onMove}
      onPointerUp={onUp} onPointerCancel={onUp}
      style={{ cursor: 'grab', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', boxSizing: 'border-box', touchAction: 'pan-y', userSelect: 'none' }}
    >
      <div style={{ perspective: '1200px', width: '100%', flex: 1 }}>
        <div style={{
          width: '100%', height: '100%', position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rot}deg)`,
        }}>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/airfit-front-t.png" alt="Vorderseite" draggable={false}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))', pointerEvents: 'none' }} />
          </div>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/airfit-back-t.png" alt="Rückseite" draggable={false}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>
      <p style={{ color: '#666', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.5rem', flexShrink: 0 }}>
        ↔ Ziehen zum Drehen — 360°
      </p>
    </div>
  );
}
