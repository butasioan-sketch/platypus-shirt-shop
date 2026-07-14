// Einzige Wahrheit: Druckfläche, A4-Spec, Viewer-Drehgeschwindigkeit
// overlay-Werte nach physischem Testdruck kalibrieren (Phase 0)

export const PRINT_SPEC = {
  format: 'DIN A4',
  orientation: 'portrait' as const,
  widthMm: 210,
  heightMm: 297,
  dpi: 300,
  widthPx: 2480,
  heightPx: 3508,
  minUploadPx: 1000,
  aspectRatio: 210 / 297,
  sides: ['front', 'back'] as const,
  method: 'sublimation' as const,
  blank: 'B&C TM062',
  // UI-Overlay auf Shirt-Foto (% der Bildgröße, A4-Hochformat-Verhältnis)
  overlay: { top: 18, left: 32, width: 37, height: 52 },
  maxOffsetPercent: 20,
  scaleMin: 0.3,
  scaleMax: 2.0,
} as const;

/** Demo-Motiv: Logo auf Shirt (Hero, Ladeanimation, Produktkarte) */
export const BRAND_DEMO_PRINT = {
  front: { src: '/logo.jpeg', x: 0, y: -3, scale: 0.62 },
  back: { src: '/logo.jpeg', x: 0, y: -3, scale: 0.55 },
} as const;

export const VIEWER_DEFAULTS = {
  autoRotateSpeed2D: 0.038,
  autoRotateSpeed3D: 1.5,
  idleDelayMs: 2800,
} as const;

export function getPrintOverlayBox() {
  const o = PRINT_SPEC.overlay;
  return {
    position: 'absolute' as const,
    top: `${o.top}%`,
    left: `${o.left}%`,
    width: `${o.width}%`,
    height: `${o.height}%`,
    overflow: 'hidden' as const,
  };
}