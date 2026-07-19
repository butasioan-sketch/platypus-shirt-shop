'use client';

/**
 * Hero / Produkt-Vorschau Shorts — Video-Loop analog ProductHeroViewer (Shirt 3D).
 * Assets: public/airfit-shorts-hero.mp4 (+ dark variant).
 * 2D-Flip mit Motiv: ShirtFlip mit frontSrc/backSrc = airfit-shorts-front/back.
 */
export default function ShortsHeroViewer({
  height = 420,
  variant = 'studio',
}: {
  height?: number;
  /** studio = helles Produkt-Orbit · dark = dunkler Premium-Hintergrund */
  variant?: 'studio' | 'dark';
}) {
  const src =
    variant === 'dark' ? '/airfit-shorts-hero-dark.mp4' : '/airfit-shorts-hero.mp4';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: 16,
        overflow: 'hidden',
        background: variant === 'dark' ? '#0a0a0a' : '#111',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <video
        key={src}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
        aria-label="AirFit Pro Shorts — 360°-Produktvorschau"
      />
    </div>
  );
}
