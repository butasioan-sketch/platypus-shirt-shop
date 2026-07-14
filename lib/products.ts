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

export const PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'essential-polyester',
    price: 39.99,
    color: '#f5f5f5',
    textColor: '#000',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    fits: ['Regular', 'Oversized'],
    colors: SHIRT_COLORS,
    material: '100% Polyester (sublimationsgeeignet)',
    weight: '160g/m²',
    name: {
      de: 'AirFit Pro',
      ro: 'AirFit Pro',
      en: 'AirFit Pro',
    },
    description: {
      de: 'B&C TM062 · 100% Polyester · 140g/m² · Sublimation 210×297 mm · Unisex',
      ro: 'B&C TM062 · 100% Poliester · 140g/m² · Sublimare 210×297 mm · Unisex',
      en: 'B&C TM062 · 100% Polyester · 140g/m² · 210×297 mm sublimation · Unisex',
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
