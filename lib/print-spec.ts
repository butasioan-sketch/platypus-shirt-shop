// Einzige Wahrheit: Druckfläche, Maße, Viewer-Drehgeschwindigkeit
// Overlay kalibriert auf B&C TM062 (Gr. L) + Shirt-Fotos 1024×1536 px

export const SHIRT_PHOTO = {
  width: 1024,
  height: 1536,
  aspectRatio: 1024 / 1536, // 2:3 — Container muss gleiches Verhältnis haben
} as const;

export type PrintSide = 'front' | 'back';

/** Prozent der Shirt-Fotos — exakte A4-Größe (210:297) auf Körperfläche Gr. L bei scale=1 */
const OVERLAY_FRONT = { top: 26.3, left: 34.7, width: 30.9, height: 29.2 };
const OVERLAY_BACK = { top: 29.9, left: 34.5, width: 28.9, height: 27.3 };

/** Nutzbare Fläche (Prozent der Shirt-Fotos) — Bereich, in dem der Mittelpunkt
 *  des Motivs frei verschoben werden darf. Hals, Ärmel, Seiten und Saum sind
 *  ausgespart (kalibriert auf dieselben Referenzfotos wie OVERLAY_*). */
const PLACEMENT_FRONT = { top: 20, left: 20, width: 60, height: 58 };
const PLACEMENT_BACK = { top: 20, left: 20, width: 60, height: 58 };

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
  placement: {
    front: PLACEMENT_FRONT,
    back: PLACEMENT_BACK,
  },
  /** Offset des Motiv-Mittelpunkts vom Mittelpunkt der nutzbaren Fläche, in
   *  Prozent von deren Breite/Höhe. ±50 = Mittelpunkt erreicht den Rand der
   *  nutzbaren Fläche → Motiv deckt die gesamte Fläche ab. */
  maxOffsetPercent: 50,
  scaleMin: 0.3,
  scaleMax: 2.0,
} as const;

export type PrintLocale = 'de' | 'ro' | 'en';

export function getPrintOverlay(side: PrintSide = 'front') {
  return PRINT_SPEC.overlay[side];
}

export function getPlacementZone(side: PrintSide = 'front') {
  return PRINT_SPEC.placement[side];
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

export function getPlacementZoneStyle(side: PrintSide = 'front') {
  const p = getPlacementZone(side);
  return {
    position: 'absolute' as const,
    top: `${p.top}%`,
    left: `${p.left}%`,
    width: `${p.width}%`,
    height: `${p.height}%`,
  };
}

/** CSS aspect-ratio Wert für Shirt-Viewer (kein Letterboxing) */
export const SHIRT_VIEWER_ASPECT = `${SHIRT_PHOTO.width} / ${SHIRT_PHOTO.height}`;