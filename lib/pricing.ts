// Einzige Wahrheit fuer Produktpreise
export const BASE_PRICE = 39.99;
// BASE_PRICE deckt INCLUDED_IMAGES Motiv-Slots ab (heute: vorne + hinten = 2).
// Jedes weitere Bild (z.B. kuenftiges Multi-Panel) kostet EXTRA_IMAGE_PRICE zusaetzlich.
export const INCLUDED_IMAGES = 2;
export const EXTRA_IMAGE_PRICE = 2.99;

export function calcUnitPrice(front?: string | null, back?: string | null): number {
  const usedImages = (front ? 1 : 0) + (back ? 1 : 0);
  const extraImages = Math.max(0, usedImages - INCLUDED_IMAGES);
  return +(BASE_PRICE + extraImages * EXTRA_IMAGE_PRICE).toFixed(2);
}
