import { Locale } from './i18n';

export interface ShirtColor {
  key: string;
  hex: string;
  label: Record<Locale, string>;
}

export const SHIRT_COLORS: ShirtColor[] = [
  { key: 'weiss',    hex: '#f5f5f5', label: { de: 'Weiß',     ro: 'Alb',        en: 'White'      } },
  { key: 'hellgelb', hex: '#f5ecc8', label: { de: 'Hellgelb', ro: 'Galben deschis', en: 'Light Yellow' } },
  { key: 'hellgrau', hex: '#d4d6d8', label: { de: 'Hellgrau', ro: 'Gri deschis',en: 'Light Grey' } },
  { key: 'hellblau', hex: '#cfe0ec', label: { de: 'Hellblau', ro: 'Bleu',       en: 'Light Blue' } },
  { key: 'mint',     hex: '#d4e8da', label: { de: 'Mint',     ro: 'Mentă',      en: 'Mint'       } },
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
    price: 29.99,
    color: '#f5f5f5',
    textColor: '#000',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    fits: ['Regular', 'Oversized'],
    colors: SHIRT_COLORS,
    material: '100% Polyester (sublimationsgeeignet)',
    weight: '160g/m²',
    name: {
      de: 'Essential Polyester',
      ro: 'Essential Poliester',
      en: 'Essential Polyester',
    },
    description: {
      de: 'Helles Premium-Polyester, unisex, ideal für brillanten Sublimationsdruck',
      ro: 'Poliester premium deschis, unisex, ideal pentru sublimare vibrantă',
      en: 'Light premium polyester, unisex, ideal for vibrant sublimation print',
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
