// Einzige Wahrheit fuer Produktpreise — Essential Collection (Tee + Shorts) + Bundle.
// Serverseitig (create-checkout) MUSS dieselben Funktionen nutzen wie hier — Client-Preise
// werden nie vertraut.

export const PRICE_TEE = 39.99;
export const PRICE_SHORTS = 39.99;
export const PRICE_BUNDLE_ESSENTIAL = 69.99; // 1x Tee + 1x Shorts als Paar

// BASE-Preis deckt INCLUDED_IMAGES Motiv-Slots ab (heute: vorne + hinten = 2).
// Jedes weitere Bild (z.B. kuenftiges Multi-Panel) kostet EXTRA_IMAGE_PRICE zusaetzlich, pro Teil.
export const INCLUDED_IMAGES = 2;
export const EXTRA_IMAGE_PRICE = 2.99;

export const PRODUCT_FLAT: Record<string, number> = {
  '1': PRICE_TEE,
  '2': PRICE_SHORTS,
};

/** Basis-Fixpreis fuer ein Produkt (ohne Extra-Bild-Aufpreis). */
export function getProductFlatPrice(productId: string): number {
  return PRODUCT_FLAT[productId] ?? PRICE_TEE;
}

/** Einzelpreis eines Teils inkl. Extra-Motiv-Aufpreis ab dem 3. Bild. */
export function calcUnitPriceForProduct(productId: string, panelCount: number): number {
  const flat = getProductFlatPrice(productId);
  const extra = Math.max(0, panelCount - INCLUDED_IMAGES) * EXTRA_IMAGE_PRICE;
  return +(flat + extra).toFixed(2);
}

/** @deprecated Nutze calcUnitPriceForProduct(productId, panelCount) — bleibt fuer alte Aufrufer (Tee-only). */
export function calcUnitPrice(front?: string | null, back?: string | null): number {
  const usedImages = (front ? 1 : 0) + (back ? 1 : 0);
  return calcUnitPriceForProduct('1', usedImages);
}

export interface MerchandiseItem {
  productId: string;
  /** genutzte Motiv-Slots (front/back = 1-2) fuer den Extra-Bild-Aufpreis */
  pages: number;
  qty: number;
}

/**
 * Server-Gesamtsumme (Warenwert, ohne Versand) fuer eine Menge von Teilen.
 * Bundle: je 1x Tee + 1x Shorts bilden ein Paar zum Set-Preis; Extra-Motiv-Aufpreis
 * bleibt pro Teil bestehen (wird nicht vom Bundle "verschluckt"). Ueberzaehlige
 * Tees/Shorts oder andere Produkte werden normal (Flat + Extra) abgerechnet.
 */
export function calcMerchandiseTotal(items: MerchandiseItem[], applyBundle: boolean): number {
  type Unit = { productId: string; extra: number };
  const units: Unit[] = [];
  for (const item of items) {
    const extra = Math.max(0, item.pages - INCLUDED_IMAGES) * EXTRA_IMAGE_PRICE;
    for (let i = 0; i < Math.max(0, item.qty); i++) units.push({ productId: item.productId, extra });
  }

  const tees = units.filter((u) => u.productId === '1');
  const shorts = units.filter((u) => u.productId === '2');
  const others = units.filter((u) => u.productId !== '1' && u.productId !== '2');

  let total = 0;
  const pairCount = applyBundle ? Math.min(tees.length, shorts.length) : 0;

  for (let i = 0; i < pairCount; i++) {
    total += PRICE_BUNDLE_ESSENTIAL + tees[i].extra + shorts[i].extra;
  }
  const leftover = [...tees.slice(pairCount), ...shorts.slice(pairCount), ...others];
  for (const u of leftover) {
    total += getProductFlatPrice(u.productId) + u.extra;
  }

  return +total.toFixed(2);
}

/** Essential Set gilt sobald mindestens 1 Tee UND 1 Shorts in den Items stecken. */
export function isBundleEligible(items: MerchandiseItem[]): boolean {
  const teeQty = items.filter((i) => i.productId === '1').reduce((s, i) => s + i.qty, 0);
  const shortsQty = items.filter((i) => i.productId === '2').reduce((s, i) => s + i.qty, 0);
  return teeQty >= 1 && shortsQty >= 1;
}
