// Einzige Wahrheit: Druckfläche, Maße, Viewer-Drehgeschwindigkeit
// Overlay kalibriert auf B&C TM062 (Gr. L) + Shirt-Fotos 1024×1536 px

export const SHIRT_PHOTO = {
  width: 1024,
  height: 1536,
  aspectRatio: 1024 / 1536, // 2:3 — Container muss gleiches Verhältnis haben
} as const;

export type PrintSide = 'front' | 'back';

/** Prozent der Shirt-Fotos — exakt A4 (210:297) auf Körperfläche Gr. L */
const OVERLAY_FRONT = { top: 26.3, left: 34.7, width: 30.9, height: 29.2 };
const OVERLAY_BACK = { top: 29.9, left: 34.5, width: 28.9, height: 27.3 };

export const PRINT_SPEC = {
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
  shirtSizeRef: 'L' as const,
  shirtLengthMm: 740,
  collarOffsetMm: 110,
  overlay: {
    front: OVERLAY_FRONT,
    back: OVERLAY_BACK,
  },
  maxOffsetPercent: 20,
  scaleMin: 0.3,
  scaleMax: 2.0,
} as const;

export type PrintLocale = 'de' | 'ro' | 'en';

export function getPrintOverlay(side: PrintSide = 'front') {
  return PRINT_SPEC.overlay[side];
}

/** 210 × 297 mm */
export function formatSizeMm(): string {
  return `${PRINT_SPEC.widthMm} × ${PRINT_SPEC.heightMm} mm`;
}

/** 21 × 29,7 cm */
export function formatSizeCm(locale: PrintLocale = 'de'): string {
  const w = (PRINT_SPEC.widthMm / 10).toLocaleString(locale, { maximumFractionDigits: 1 });
  const h = (PRINT_SPEC.heightMm / 10).toLocaleString(locale, { maximumFractionDigits: 1 });
  return `${w} × ${h} cm`;
}

/** Kurzlabel für Badge/UI */
export function formatPrintLabel(locale: PrintLocale = 'de'): string {
  const portrait = { de: 'Hochformat', ro: 'Vertical', en: 'Portrait' }[locale];
  return `${formatSizeMm()} · ${portrait}`;
}

/** Vollständig für FAQ/Produkt */
export function formatPrintSpec(locale: PrintLocale = 'de'): string {
  return `${formatSizeMm()} (${formatSizeCm(locale)}) · ${{ de: 'Hochformat', ro: 'vertical', en: 'portrait' }[locale]}`;
}

export const VIEWER_DEFAULTS = {
  autoRotateSpeed2D: 0.038,
  autoRotateSpeed3D: 1.5,
  idleDelayMs: 2800,
} as const;

export function getPrintOverlayBox(side: PrintSide = 'front') {
  const o = getPrintOverlay(side);
  return {
    position: 'absolute' as const,
    top: `${o.top}%`,
    left: `${o.left}%`,
    width: `${o.width}%`,
    height: `${o.height}%`,
    overflow: 'hidden' as const,
  };
}

/** CSS aspect-ratio Wert für Shirt-Viewer (kein Letterboxing) */
export const SHIRT_VIEWER_ASPECT = `${SHIRT_PHOTO.width} / ${SHIRT_PHOTO.height}`;