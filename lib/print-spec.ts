// Einzige Wahrheit: Druckfläche, Maße, Viewer-Drehgeschwindigkeit
// overlay-Werte nach physischem Testdruck kalibrieren (Phase 0)

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
  overlay: { top: 18, left: 32, width: 37, height: 52 },
  maxOffsetPercent: 20,
  scaleMin: 0.3,
  scaleMax: 2.0,
} as const;

export type PrintLocale = 'de' | 'ro' | 'en';

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