import { Locale } from './i18n';

export interface Product {
  id: string;
  slug: string;
  price: number;
  color: string;
  textColor: string;
  sizes: string[];
  fits: string[];
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
    slug: 'essential-weiss',
    price: 29.99,
    color: '#f5f5f5',
    textColor: '#000',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    fits: ['Regular', 'Oversized'],
    material: '100% Baumwolle',
    weight: '180g/m²',
    name: {
      de: 'Essential Weiß',
      ro: 'Essential Alb',
      en: 'Essential White',
    },
    description: {
      de: 'Premium Baumwolle, unisex, Print-on-Demand',
      ro: 'Bumbac premium, unisex, print la comandă',
      en: 'Premium cotton, unisex, print-on-demand',
    },
    tags: ['essential', 'weiss', 'white', 'alb', 'basic'],
    active: true,
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    slug: 'essential-schwarz',
    price: 29.99,
    color: '#111111',
    textColor: '#fff',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    fits: ['Regular', 'Oversized'],
    material: '100% Baumwolle',
    weight: '180g/m²',
    name: {
      de: 'Essential Schwarz',
      ro: 'Essential Negru',
      en: 'Essential Black',
    },
    description: {
      de: 'Premium Baumwolle, unisex, Print-on-Demand',
      ro: 'Bumbac premium, unisex, print la comandă',
      en: 'Premium cotton, unisex, print-on-demand',
    },
    tags: ['essential', 'schwarz', 'black', 'negru', 'basic'],
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
