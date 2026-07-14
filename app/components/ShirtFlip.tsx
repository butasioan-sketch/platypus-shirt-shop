'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getPrintOverlayBox } from '@/lib/print-spec';
import { getPrintImageStyle } from '@/lib/print-position';

interface ShirtFlipProps {
  frontSrc?: string;
  backSrc?: string;
  altFront?: string;
  altBack?: string;
  initialRotation?: number;
  autoRotateSpeed?: number;    // Stellschraube 1
  dragSensitivity?: number;    // Stellschraube 2
  idleDelayMs?: number;        // Stellschraube 3
  perspective?: number;        // Stellschraube 4
  shadow?: string;             // Stellschraube 5
  inertiaFriction?: number;    // Stellschraube 6
  frontPrint?: { src: string; x?: number; y?: number; scale?: number };
  backPrint?: { src: string; x?: number; y?: number; scale?: number };
  showHint?: boolean;
  showControls?: boolean;
  enableInertia?: boolean;
  onRotationChange?: (deg: number) => void;
}

const DEFAULTS = {
  autoRotateSpeed: 0.022,
  dragSensitivity: 0.55,
  idleDelayMs: 3800,
  perspective: 1200,
  shadow: '0 8px 24px rgba(0,0,0,0.5)',
  inertiaFriction: 0.91,
  minVelocity: 0.08,
} as const;

export default function ShirtFlip({
  frontSrc = '/airfit-front-t.png',
  backSrc = '/airfit-back-t.png',
  altFront = 'AirFit Pro — Vorderseite',
  altBack = 'AirFit Pro — Rückseite',
  initialRotation = 0,
  autoRotateSpeed = DEFAULTS.autoRotateSpeed,
  dragSensitivity = DEFAULTS.dragSensitivity,
  idleDelayMs = DEFAULTS.idleDelayMs,
  perspective = DEFAULTS.perspective,
  shadow = DEFAULTS.shadow,
  inertiaFriction = DEFAULTS.inertiaFriction,
  showHint = true,
  showControls = true,
  enableInertia = true,
  frontPrint,
  backPrint,
  onRotationChange,
}: ShirtFlipProps) {
  const rotationRef = useRef(initialRotation);
  const velocityRef = useRef(0);
  const modeRef = useRef<'idle' | 'dragging' | 'coasting'>('idle');
  const viewerRef = useRef<HTMLDivElement>(null);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const loadedCountRef = useRef(0);

  const [isIdle, setIsIdle] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const updateTransform = useCallback((deg?: number) => {
    if (!viewerRef.current) return;
    const r = deg ?? rotationRef.current;
    viewerRef.current.style.transform = `rotateY(${r}deg)`;
    if (onRotationChange) onRotationChange(((r % 360) + 360) % 360);
  }, [onRotationChange]);

  const normalize = (r: number) => { let n = r % 360; if (n < 0) n += 360; return n; };
  const startIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (modeRef.current !== 'dragging') { modeRef.current = 'idle'; setIsIdle(true); }
    }, idleDelayMs);
  }, [idleDelayMs]);

  const stopIdleTimer = () => {
    if (idleTimerRef.current) { clearTimeout(idleTimerRef.current); idleTimerRef.current = null; }
  };

  const tick = useCallback((t: number) => {
    const delta = t - lastTimeRef.current;
    lastTimeRef.current = t;
    let needsUpdate = false;
    if (modeRef.current === 'idle' && !isDraggingRef.current) {
      rotationRef.current += delta * autoRotateSpeed;
      needsUpdate = true;
    } else if (modeRef.current === 'coasting' && enableInertia) {
      rotationRef.current += velocityRef.current;
      velocityRef.current *= inertiaFriction;
      needsUpdate = true;
      if (Math.abs(velocityRef.current) < DEFAULTS.minVelocity) {
        modeRef.current = 'idle'; velocityRef.current = 0; startIdleTimer();
      }
    }
    if (needsUpdate) { rotationRef.current = normalize(rotationRef.current); updateTransform(); }
    rafRef.current = requestAnimationFrame(tick);
  }, [autoRotateSpeed, enableInertia, inertiaFriction, updateTransform, startIdleTimer]);

  useEffect(() => {
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [tick]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    modeRef.current = 'dragging';
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    stopIdleTimer();
    setIsIdle(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (viewerRef.current) viewerRef.current.style.cursor = 'grabbing';
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = Math.max(now - lastTimeRef.current, 1);
    const deltaX = e.clientX - lastXRef.current;
    rotationRef.current += deltaX * dragSensitivity;
    velocityRef.current = (deltaX / dt) * 18;
    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
    updateTransform();
  };

  const onPointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (enableInertia && Math.abs(velocityRef.current) > DEFAULTS.minVelocity * 1.8) {
      modeRef.current = 'coasting';
    } else {
      modeRef.current = 'idle'; velocityRef.current = 0; startIdleTimer();
    }
    if (viewerRef.current) viewerRef.current.style.cursor = 'grab';
  };

  const resetToFront = () => {
    stopIdleTimer();
    modeRef.current = 'idle'; velocityRef.current = 0; isDraggingRef.current = false;
    rotationRef.current = 0; updateTransform(0); setIsIdle(true);
    setTimeout(startIdleTimer, 300);
  };

  const toggleAutoRotate = () => {
    if (modeRef.current === 'idle') {
      modeRef.current = 'coasting'; velocityRef.current = 0.6; setIsIdle(false); stopIdleTimer();
    } else {
      modeRef.current = 'idle'; velocityRef.current = 0; setIsIdle(true); startIdleTimer();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = 12;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault(); stopIdleTimer(); modeRef.current = 'idle';
      rotationRef.current += e.key === 'ArrowRight' ? step : -step;
      updateTransform(); setIsIdle(false); startIdleTimer();
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault(); toggleAutoRotate();
    } else if (e.key.toLowerCase() === 'r' || e.key === 'Escape') {
      e.preventDefault(); resetToFront();
    }
  };

  const handleImageLoad = () => { loadedCountRef.current += 1; if (loadedCountRef.current >= 2) setImagesLoaded(true); };
  const handleImageError = () => { setHasError(true); setImagesLoaded(true); };

  useEffect(() => { rotationRef.current = initialRotation; updateTransform(initialRotation); }, [initialRotation, updateTransform]);
  if (hasError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(226,0,26,0.08)', color: '#f87171', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(226,0,26,0.3)', width: '100%', height: '100%' }}>
        <p style={{ fontWeight: 600 }}>Bild konnte nicht geladen werden.</p>
      </div>
    );
  }

  const faceStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  const imgStyle: React.CSSProperties = {
    width: '100%', height: '100%', objectFit: 'contain',
    pointerEvents: 'none', filter: `drop-shadow(${shadow})`,
  };
  const wrapStyle: React.CSSProperties = { position: 'relative', height: '100%', aspectRatio: '4/5', maxWidth: '100%' };
  const printBox: React.CSSProperties = { ...getPrintOverlayBox(), pointerEvents: 'none', zIndex: 2, opacity: 0.98 };
  const renderPrint = (pr?: { src: string; x?: number; y?: number; scale?: number }) => pr ? (
    <div style={printBox}>
      <img src={pr.src} alt="" draggable={false} style={getPrintImageStyle(pr.scale ?? 1, { x: pr.x ?? 0, y: pr.y ?? 0 })} />
    </div>
  ) : null;
  const ctrlBtn: React.CSSProperties = {
    padding: '0.5rem', background: 'transparent', border: 'none', color: '#999',
    borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  return (
    <div
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', userSelect: 'none', outline: 'none', touchAction: 'pan-y' }}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="img"
      aria-label={'Interaktive 360-Grad-Ansicht des Shirts. Ziehen zum Drehen, Pfeiltasten, Leertaste = Auto-Drehung, R = Reset.'}
    >
      {!imagesLoaded && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '70%', maxWidth: '300px', aspectRatio: '4/5', borderRadius: '16px', background: 'rgba(255,255,255,0.04)' }} />
        </div>
      )}

      <div style={{ perspective: `${perspective}px`, position: 'relative', width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '260px' }}>
        <div
          ref={viewerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={resetToFront}
          style={{ transformStyle: 'preserve-3d', cursor: 'grab', width: '100%', height: '100%', position: 'relative', willChange: 'transform' }}
        >
          <div style={faceStyle}>
            <div style={wrapStyle}>
              <img src={frontSrc} alt={altFront} draggable={false} onLoad={handleImageLoad} onError={handleImageError} style={imgStyle} />
              {renderPrint(frontPrint)}
            </div>
          </div>
          <div style={{ ...faceStyle, transform: 'rotateY(180deg)' }}>
            <div style={wrapStyle}>
              <img src={backSrc} alt={altBack} draggable={false} onLoad={handleImageLoad} onError={handleImageError} style={imgStyle} />
              {renderPrint(backPrint)}
            </div>
          </div>
        </div>
      </div>

      {showControls && imagesLoaded && (
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 30, display: 'flex', alignItems: 'center', gap: '0.15rem', borderRadius: '999px', background: 'rgba(18,18,18,0.85)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.2rem', backdropFilter: 'blur(8px)' }}>
          <button onClick={resetToFront} style={ctrlBtn} title="Zur Vorderseite (R)" aria-label="Zur Vorderseite zurücksetzen">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.058 11H1M12 3v2m0 16v2m9-9H15m-6 0a8.002 8.002 0 01-3.356-2.5" />
            </svg>
          </button>
          <button onClick={toggleAutoRotate} style={ctrlBtn} title={isIdle ? 'Auto-Drehung pausieren' : 'Auto-Drehung starten'} aria-label="Auto-Drehung umschalten">
            {isIdle ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
        </div>
      )}

      {showHint && imagesLoaded && (
        <p style={{ color: '#666', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '0.6rem', textAlign: 'center', flexShrink: 0 }}>
          ↔ Ziehen • Doppelklick = Reset • 360°
        </p>
      )}
    </div>
  );
}
