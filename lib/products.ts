import { Locale } from './i18n';

export interface ShirtColor {
  key: string;
  hex: string;
  label: Record<Locale, string>;
}

export const SHIRT_COLORS: ShirtColor[] = [
  { key: 'weiss', hex: '#f5f5f5', label: { de: 'Weiß', ro: 'Alb', en: 'White' } },
];

export interface Product {
  id: string;
  slug: string;
  price: number;
  color: string;
  textColor: string;
  sizes: string[];
  fits: string[];
  colors: ShirtColor[];
  material: string;
  weight: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  tags: string[];
  active: boolean;
  createdAt: string;
}

// PLACEHOLDER_PRODUCTS (noch NICHT im Shop, keine Specs vorhanden — nicht erfinden):
// P2 — Kurze Hose (Shorts), weiß, 3D analog Shirt3D — Specs kommen später von Jonny
// P3 — Boxershorts Herren, weiß — Specs kommen später von Jonny
// P4 — Boxershorts Damen, weiß — Specs kommen später von Jonny
// Sobald Specs da sind: Product-Eintrag + eigene Placement-Kalibrierung, kein Checkout ohne Specs.
export const PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'essential-polyester',
    price: 39.99,
    color: '#f5f5f5',
    textColor: '#000',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fits: ['Unisex'],
    colors: SHIRT_COLORS,
    material: 'AirFit Performance Fabric — Performance-Polyester-Strick (sublimationsgeeignet)',
    weight: '140g/m²',
    name: {
      de: 'AirFit Pro',
      ro: 'AirFit Pro',
      en: 'AirFit Pro',
    },
    description: {
      de: 'Performance-Polyester · 140 g/m² · Vollflächiger Sublimationsdruck 210 × 297 mm · Unisex',
      ro: 'Poliester performance · 140 g/m² · Sublimare integrală 210 × 297 mm · Unisex',
      en: 'Performance polyester · 140 gsm · Full-area sublimation 210 × 297 mm · Unisex',
    },
    tags: ['essential', 'polyester', 'sublimation', 'hell', 'basic'],
    active: true,
    createdAt: '2026-01-01',
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id && p.active);
}

export function getAllProducts(): Product[] {
  return PRODUCTS.filter(p => p.active);
}

export function getProductName(product: Product, locale: Locale): string {
  return product.name[locale] || product.name.de;
}

export function getProductDescription(product: Product, locale: Locale): string {
  return product.description[locale] || product.description.de;
}
