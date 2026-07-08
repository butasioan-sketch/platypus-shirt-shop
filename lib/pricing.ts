// Einzige Wahrheit fuer Produktpreise
export const BASE_PRICE = 29.99;
export const PRINT_SURCHARGE = 4.00; // Aufpreis je bedruckter Seite

export function calcUnitPrice(front?: string | null, back?: string | null): number {
  return +(BASE_PRICE + (front ? PRINT_SURCHARGE : 0) + (back ? PRINT_SURCHARGE : 0)).toFixed(2);
}
