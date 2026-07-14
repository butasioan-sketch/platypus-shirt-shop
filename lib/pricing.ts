// Einzige Wahrheit fuer Produktpreise
export const BASE_PRICE = 39.99;
export const PRINT_SURCHARGE = 0.00; // 39.99 flat — kein Seitenaufpreis

export function calcUnitPrice(front?: string | null, back?: string | null): number {
  return +(BASE_PRICE + (front ? PRINT_SURCHARGE : 0) + (back ? PRINT_SURCHARGE : 0)).toFixed(2);
}
