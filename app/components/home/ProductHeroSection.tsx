import Link from 'next/link';
import { Locale, getTranslation } from '@/lib/i18n';
import { getAllProducts, getProductName, getProductDescription } from '@/lib/products';
import ProductHeroViewer from '@/app/components/ProductHeroViewer';

export default function ProductHeroSection({ locale }: { locale: Locale }) {
  const t = getTranslation(locale);
  const product = getAllProducts()[0];
  if (!product) return null;

  return (
    <section className="hero-product" style={{ padding: '2.5rem 2rem 4rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="hero-product-grid">
        <div className="hero-product-viewer" style={{ position: 'relative' }}>
          <ProductHeroViewer height={420} />
          <span className="plt-badge" style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }}>
            SELBST GESTALTEN
          </span>
        </div>

        <div className="hero-product-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="plt-label hero-badge" style={{ color: '#e2001a', margin: '0 0 1rem' }}>
            {t.hero.badge}
          </p>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.05,
            marginBottom: '1rem', letterSpacing: '-0.03em',
          }}>
            {t.hero.headline1}<br />
            <span style={{
              background: 'linear-gradient(90deg, #e2001a, #ff5577)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {t.hero.headline2}
            </span>
          </h1>

          <p style={{ color: '#9a9a9a', fontSize: '1rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
            {t.hero.sub}
          </p>

          <div className="plt-card hero-product-card" style={{ padding: '1.5rem', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>
                {getProductName(product, locale)}
              </p>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.35rem', margin: 0, whiteSpace: 'nowrap' }}>
                €{product.price}
              </p>
            </div>
            <p style={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.55, margin: '0 0 1.25rem' }}>
              {getProductDescription(product, locale)}
            </p>
            <Link href={`/product/${product.id}`} className="plt-btn-primary" style={{ width: '100%' }}>
              {t.hero.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}