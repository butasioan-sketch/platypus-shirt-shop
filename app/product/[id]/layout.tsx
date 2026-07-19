import type { Metadata } from 'next';
import { getProduct, getProductName, getProductDescription } from '@/lib/products';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  const name = product ? getProductName(product, 'de') : 'AirFit Pro';
  const desc = product ? getProductDescription(product, 'de') : 'AirFit Performance Fabric, Vollflächendruck. Maßgefertigt auf Bestellung.';

  return {
    title: `${name} — Dein Design | PLATYPUS`,
    description: `${name} — ${desc}. Lade dein Motiv hoch und gestalte dein Statement-Piece.`,
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Params }) {
  const { id } = await params;
  const product = getProduct(id);
  const name = product ? getProductName(product, 'de') : 'AirFit Pro';
  const desc = product ? getProductDescription(product, 'de') : 'Premium-Polyester-Piece mit Vollflächendruck — sublimiert in die Faser. Maßgefertigt auf Bestellung.';
  const kind = id === '2' ? 'Shorts' : 'Shirt';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${name} — PLATYPUS Custom ${kind}`,
    description: `${desc} Maßgefertigt auf Bestellung.`,
    brand: { '@type': 'Brand', name: 'PLATYPUS' },
    offers: {
      '@type': 'Offer',
      price: String(product?.price ?? 39.99),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2027-12-31',
      seller: { '@type': 'Organization', name: 'PLATYPUS' },
    },
    image: 'https://platypus-shirt-shop.vercel.app/og.png',
  };

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
