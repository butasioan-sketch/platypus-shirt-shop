// Einzige Wahrheit: Druckfläche, Maße, Viewer-Drehgeschwindigkeit
// Overlay kalibriert auf B&C TM062 (Gr. L) + Shirt-Fotos 1024×1536 px

export const SHIRT_PHOTO = {
  width: 1024,
  height: 1536,
  aspectRatio: 1024 / 1536, // 2:3 — Container muss gleiches Verhältnis haben
} as const;

export type PrintSide = 'front' | 'back';

interface Rect { top: number; left: number; width: number; height: number }

/** Prozent der Shirt-Fotos — exakte A4-Größe (210:297) auf Körperfläche Gr. L bei scale=1 */
const OVERLAY_FRONT = { top: 26.3, left: 34.7, width: 30.9, height: 29.2 };
const OVERLAY_BACK = { top: 29.9, left: 34.5, width: 28.9, height: 27.3 };

/** Nutzbare Fläche (Prozent der Shirt-Fotos) — Bereich, in dem der Mittelpunkt
 *  des Motivs frei verschoben werden darf. No-Print-Zonen bewusst ausgespart:
 *  Kragen/Halsausschnitt (oben), Schulterbereich beider Schultern (oben),
 *  Seitennaht unter den Armen (links/rechts), Saum (unten) — kalibriert auf
 *  dieselben Referenzfotos wie OVERLAY_*. */
const PLACEMENT_FRONT = { top: 20, left: 20, width: 60, height: 58 };
const PLACEMENT_BACK = { top: 20, left: 20, width: 60, height: 58 };

/** Kurzer Hinweistext für UI/PDF — No-Print-Zonen menschenlesbar. */
export const NO_PRINT_NOTE = 'Schulterbereich, Seitennaht (unter den Armen), Kragen und Saum sind bewusst ausgespart.';

// === PRODUKT-PROFILE (Garment-Kalibrierung pro productId) ===
// Jedes Produkt hat eigene Fotos + eigene Overlay/Placement-Kalibrierung —
// die A4-Druckblatt-Spec (widthMm/heightMm/dpi/scale-Grenzen) ist dagegen
// produktübergreifend gleich (derselbe Drucker/dieselbe Presse für alle Teile).
export interface GarmentProfile {
  productId: string;
  photoWidth: number;
  photoHeight: number;
  overlay: { front: Rect; back: Rect };
  placement: { front: Rect; back: Rect };
  blank: string;
  weightGsm: number;
  frontSrc: string;
  backSrc: string;
  /** Näherungs-Referenzhöhe in mm für die mm-Umrechnung im PDF — null wenn keine
   *  belastbare Referenzmessung vorliegt (dann zeigt das PDF nur %, kein mm). */
  mmReferenceHeight: number | null;
}

const TEE_PROFILE: GarmentProfile = {
  productId: '1',
  photoWidth: SHIRT_PHOTO.width,
  photoHeight: SHIRT_PHOTO.height,
  overlay: { front: OVERLAY_FRONT, back: OVERLAY_BACK },
  placement: { front: PLACEMENT_FRONT, back: PLACEMENT_BACK },
  blank: 'B&C TM062',
  weightGsm: 140,
  frontSrc: '/airfit-front-t.png',
  backSrc: '/airfit-back-t.png',
  mmReferenceHeight: 740 + 110, // shirtLengthMm + collarOffsetMm (Gr. L)
};

// Shorts-Fotos: 863×1200 (front) / 864×1200 (back) — gemeinsam auf 864×1200 gerundet.
// Overlay/Placement per Bildinspektion geschätzt (Bund oben, Saum unten, Seitennaht-Paspel
// links/rechts ausgespart) — ERSTVERSION, nicht durch physischen Testdruck verifiziert.
const SHORTS_OVERLAY = { top: 24, left: 25.5, width: 49, height: 50 };
const SHORTS_PLACEMENT = { top: 12, left: 14, width: 72, height: 74 };

const SHORTS_PROFILE: GarmentProfile = {
  productId: '2',
  photoWidth: 864,
  photoHeight: 1200,
  overlay: { front: SHORTS_OVERLAY, back: SHORTS_OVERLAY },
  placement: { front: SHORTS_PLACEMENT, back: SHORTS_PLACEMENT },
  blank: 'James & Nicholson JN387',
  weightGsm: 135,
  frontSrc: '/airfit-shorts-front.png',
  backSrc: '/airfit-shorts-back.png',
  mmReferenceHeight: null, // keine Referenzmessung vorhanden — nicht erfinden
};

export const GARMENT_PROFILES: Record<string, GarmentProfile> = {
  '1': TEE_PROFILE,
  '2': SHORTS_PROFILE,
};

export function getGarmentProfile(productId: string = '1'): GarmentProfile {
  return GARMENT_PROFILES[productId] || TEE_PROFILE;
}

export function getGarmentPhotoSrc(side: PrintSide, productId: string = '1'): string {
  const g = getGarmentProfile(productId);
  return side === 'front' ? g.frontSrc : g.backSrc;
}

/** CSS aspect-ratio Wert für den Viewer-Container, produktabhängig. */
export function getViewerAspect(productId: string = '1'): string {
  const g = getGarmentProfile(productId);
  return `${g.photoWidth} / ${g.photoHeight}`;
}

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

export function getPrintOverlay(side: PrintSide = 'front', productId: string = '1') {
  return getGarmentProfile(productId).overlay[side];
}

export function getPlacementZone(side: PrintSide = 'front', productId: string = '1') {
  return getGarmentProfile(productId).placement[side];
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

export function getPlacementZoneStyle(side: PrintSide = 'front', productId: string = '1') {
  const p = getPlacementZone(side, productId);
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