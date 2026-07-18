import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AirFit Pro — Dein Design | PLATYPUS',
  description: 'AirFit Pro — AirFit Performance Fabric, Vollflächendruck Vorder- & Rückseite. Maßgefertigt auf Bestellung. Lade dein Motiv hoch und gestalte dein Statement-Shirt.',
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'AirFit Pro — PLATYPUS Custom Shirt',
  description: 'Premium-Polyester-Shirt mit Vollflächendruck — sublimiert in die Faser, vorne und hinten. Maßgefertigt auf Bestellung.',
  brand: { '@type': 'Brand', name: 'PLATYPUS' },
  offers: {
    '@type': 'Offer',
    price: '39.99',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    priceValidUntil: '2027-12-31',
    seller: { '@type': 'Organization', name: 'PLATYPUS' },
  },
  image: 'https://platypus-shirt-shop.vercel.app/og.png',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {children}
    </>
  );
}
