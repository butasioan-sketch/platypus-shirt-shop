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

// ESSENTIAL COLLECTION — genau 2 Produkte (alles weiß, 100% Polyester / AirFit Performance Fabric,
// gleicher Aufbau: Atelier, 360°, Freeze, PDF). Brand-Zeile:
//   Essential Collection · AirFit Pro [Shorts] · AirFit Performance Fabric · Unisex · Maßgefertigt
// P1 + P2 LIVE. Essential Set (1x Tee + 1x Shorts) = 69.99 (siehe lib/pricing.ts).
// Shorts-Overlay/Placement (lib/print-spec.ts GARMENT_PROFILES['2']) ist eine ERSTVERSION,
// visuell aus den Referenzfotos geschätzt — noch nicht durch physischen Testdruck verifiziert.
// Siehe: ~/Schreibtisch/MeinVault/ClaudeData/BRAND-ESSENTIAL-COLLECTION-2PRODUKTE.md
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
      de: 'AirFit Performance Fabric · 140 g/m² · Vollflächiger Sublimationsdruck 210 × 297 mm · Unisex',
      ro: 'AirFit Performance Fabric · 140 g/m² · Sublimare integrală 210 × 297 mm · Unisex',
      en: 'AirFit Performance Fabric · 140 gsm · Full-area sublimation 210 × 297 mm · Unisex',
    },
    tags: ['essential', 'polyester', 'sublimation', 'hell', 'basic', 'tee'],
    active: true,
    createdAt: '2026-01-01',
  },
  // P2 — Unisex Laufshorts. Blank: James & Nicholson JN387 (100% PE, 135 g/m², S–XXL, Kordelbund, ohne Innenslip).
  {
    id: '2',
    slug: 'airfit-pro-shorts',
    price: 39.99,
    color: '#f5f5f5',
    textColor: '#000',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fits: ['Unisex'],
    colors: SHIRT_COLORS,
    material: 'AirFit Performance Fabric — 100% Polyester (135 g/m², sublimationsgeeignet)',
    weight: '135g/m²',
    name: {
      de: 'AirFit Pro Shorts',
      ro: 'AirFit Pro Shorts',
      en: 'AirFit Pro Shorts',
    },
    description: {
      de: 'AirFit Performance Fabric · 135 g/m² · Vollflächiger Sublimationsdruck · Unisex Laufshorts',
      ro: 'AirFit Performance Fabric · 135 g/m² · Sublimare integrală · Pantaloni scurți unisex',
      en: 'AirFit Performance Fabric · 135 gsm · Full-area sublimation · Unisex running shorts',
    },
    tags: ['essential', 'polyester', 'shorts', 'jn387', 'sublimation'],
    active: true,
    createdAt: '2026-07-19',
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
