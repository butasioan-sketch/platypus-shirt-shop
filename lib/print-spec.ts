// Einzige Wahrheit: Druckfläche, Maße, Viewer-Drehgeschwindigkeit
// Overlay/Placement/mmReferenceHeight sind auf den BESTEHENDEN Foto-Satz kalibriert
// (ehem. B&C TM062, 1024×1536 px) — der Blank-Bezug (TEE_PROFILE.blank) wurde am
// 21.07.2026 auf James & Nicholson JN827 aktualisiert (finale Produktentscheidung),
// die Fotos selbst NICHT getauscht (kein JN827-Rückenfoto vorhanden — siehe
// FINAL-CLAUDE-LAUNCH-21-07.md Abschnitt 6). Kein Halb-Update: Maße/mm bleiben die
// bisherige Näherung, nicht neu erfunden für JN827.

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

/** Kurzer Hinweistext für UI/PDF — No-Print-Zonen menschenlesbar, produktabhängig
 *  (Tee und Shorts haben unterschiedliche Nähte/Zonen — siehe getNoPrintNote unten). */
const NO_PRINT_NOTE_BY_PRODUCT: Record<string, string> = {
  '1': 'Schulterbereich, Seitennaht (unter den Armen), Kragen und Saum sind bewusst ausgespart.',
  '2': 'Kordelbund, Seitennaht-Paspel, Schritt und Saum sind bewusst ausgespart.',
};

export function getNoPrintNote(productId: string = '1'): string {
  return NO_PRINT_NOTE_BY_PRODUCT[productId] || NO_PRINT_NOTE_BY_PRODUCT['1'];
}

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
  blank: 'James & Nicholson JN827',
  weightGsm: 165,
  frontSrc: '/airfit-front-t.png',
  backSrc: '/airfit-back-t.png',
  mmReferenceHeight: 740 + 110, // shirtLengthMm + collarOffsetMm (Gr. L)
};

// Shorts-Fotos: 863×1200 (front) / 864×1200 (back) — gemeinsam auf 864×1200 gerundet.
// Front- und Rückfoto sind unterschiedlich eng zugeschnitten (Front zeigt die Hose
// näher/randabschneidend, Rückseite mit deutlich mehr Rand links/rechts) — per
// Pixel-Messung (Gridline-Overlay) verifiziert: Seitennaht-Paspel liegt vorne bei
// ca. 7–9 % / 90–92 %, hinten aber schon bei ca. 16–19 % / 78–80 %. Da Overlay/
// Placement für beide Seiten gemeinsam gelten, ist die ENGERE (Rückseiten-)Grenze
// maßgeblich, sonst würde ein rechts/links gezogenes Motiv auf der Rückseite in die
// Paspel laufen. Bund-Ende ~10 %, Saum ~86–91 % (hinten enger) — mit Sicherheitsabstand.
const SHORTS_OVERLAY = { top: 28.5, left: 29, width: 38, height: 39 };
const SHORTS_PLACEMENT = { top: 14, left: 20, width: 56, height: 68 };

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
  /** Nur Fallback falls ein Druckauftrag ohne jedes Design vorliegt (Edge-Case) —
   *  der eigentliche Blank-Name kommt produktabhaengig aus GARMENT_PROFILES.
   *  War frueher faelschlich 'B&C TM062' fest eingetragen, obwohl kein aktives
   *  Produkt (mehr) diesen Blank fuehrt. */
  blank: 'kein Design zugeordnet',
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