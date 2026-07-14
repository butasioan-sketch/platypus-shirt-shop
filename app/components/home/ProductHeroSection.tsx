import Link from 'next/link';
import { Locale, getTranslation } from '@/lib/i18n';
import { getAllProducts, getProductName, getProductDescription } from '@/lib/products';
import ProductHeroViewer from '@/app/components/ProductHeroViewer';

export default function ProductHeroSection({ locale }: { locale: Locale }) {
  const t = getTranslation(locale);
  const product = getAllProducts()[0];
  if (!product) return null;

  const productHref = `/product/${product.id}`;

  return (
    <section className="hero-product" style={{ padding: '2.5rem 2rem 4rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="hero-product-grid">
        <div className="hero-product-viewer" style={{ position: 'relative' }}>
          <ProductHeroViewer height={420} />
          <span style={{
            position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(226,0,26,0.92)',
            color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '0.35rem 0.75rem',
            borderRadius: '999px', letterSpacing: '0.1em', zIndex: 2,
          }}>
            SELBST GESTALTEN
          </span>
        </div>

        <div className="hero-product-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="hero-badge" style={{
            color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.12em',
            margin: '0 0 1rem', textTransform: 'uppercase', fontWeight: 600,
          }}>
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

          <div className="hero-product-card" style={{
            background: '#121212', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem',
          }}>
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
            <Link href={productHref} className="btn-primary" style={{
              display: 'block', background: '#e2001a', color: '#fff', padding: '0.9rem 1.5rem',
              borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem',
              letterSpacing: '0.05em', textAlign: 'center', boxShadow: '0 8px 24px rgba(226,0,26,0.35)',
            }}>
              {t.hero.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}