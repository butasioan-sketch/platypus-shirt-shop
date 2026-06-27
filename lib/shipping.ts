// Zentrale Versand-Definition — an EINER Stelle pflegen, überall genutzt.

export type Country = 'DE' | 'RO';

export interface ShippingOption {
  id: string;
  carrier: string;
  price: Record<Country, number>;
  eta: Record<Country, string>;
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'dhl',
    carrier: 'DHL',
    price: { DE: 4.99, RO: 13.99 },
    eta:   { DE: '2–4 Werktage', RO: '4–7 Werktage' },
  },
  {
    id: 'hermes',
    carrier: 'Hermes',
    price: { DE: 4.49, RO: 12.99 },
    eta:   { DE: '3–5 Werktage', RO: '5–8 Werktage' },
  },
  {
    id: 'dpd',
    carrier: 'DPD',
    price: { DE: 4.79, RO: 12.99 },
    eta:   { DE: '2–4 Werktage', RO: '4–7 Werktage' },
  },
];

export const COUNTRIES: { code: Country; label: string }[] = [
  { code: 'DE', label: 'Deutschland' },
  { code: 'RO', label: 'Rumänien' },
];

export function getShipping(id: string, country: Country): number {
  const opt = SHIPPING_OPTIONS.find(o => o.id === id);
  return opt ? opt.price[country] : SHIPPING_OPTIONS[0].price[country];
}

// Standard-Auswahl (günstigste in DE)
export const DEFAULT_SHIPPING_ID = 'dhl';
export const DEFAULT_COUNTRY: Country = 'DE';
