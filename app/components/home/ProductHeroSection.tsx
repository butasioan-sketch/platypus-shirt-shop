import Link from 'next/link';
import { Locale, getTranslation } from '@/lib/i18n';
import { getAllProducts, getProductName, getProduct } from '@/lib/products';
import { PRICE_TEE, PRICE_SHORTS, PRICE_BUNDLE_ESSENTIAL } from '@/lib/pricing';
import ProductHeroViewer from '@/app/components/ProductHeroViewer';
import ShortsHeroViewer from '@/app/components/ShortsHeroViewer';

const SHOP_HREF = '/product/1';
const SHORTS_HREF = '/product/2';

export default function ProductHeroSection({ locale }: { locale: Locale }) {
  const t = getTranslation(locale);
  const product = getAllProducts()[0];
  const shorts = getProduct('2');
  if (!product) return null;

  const bundleSavings = (PRICE_TEE + PRICE_SHORTS - PRICE_BUNDLE_ESSENTIAL).toFixed(2);

  return (
    <section className="hero-product" style={{ padding: '2.5rem 2rem 4rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="hero-product-grid">
        <Link
          href={SHOP_HREF}
          className="hero-product-viewer"
          style={{ position: 'relative', display: 'block', textDecoration: 'none', cursor: 'pointer' }}
          aria-label={t.hero.viewer}
        >
          <ProductHeroViewer height={420} />
          <span className="plt-badge" style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2, pointerEvents: 'none' }}>
            {t.hero.viewer}
          </span>
        </Link>

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
            <p style={{ color: '#888', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>
              {t.brand.collection}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '0 0 0.35rem' }}>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>
                {getProductName(product, locale)}
              </p>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>
                €{PRICE_TEE.toFixed(2)}
              </p>
            </div>
            <p style={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.55, margin: '0 0 1.25rem' }}>
              {t.hero.productHint}
            </p>
            <Link href={SHOP_HREF} className="plt-btn-primary" style={{ width: '100%' }}>
              {t.hero.cta}
            </Link>
          </div>
        </div>
      </div>

      {shorts && (
        <div
          className="hero-essential-strip"
          style={{
            marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem',
            alignItems: 'stretch',
          }}
        >
          <Link
            href={SHORTS_HREF}
            className="plt-card"
            style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '1.25rem', textDecoration: 'none' }}
          >
            <div style={{ width: '140px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden' }}>
              <ShortsHeroViewer height={140} variant="dark" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#888', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>
                {t.brand.collection}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.75rem' }}>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>
                  {getProductName(shorts, locale)}
                </p>
                <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', margin: 0, whiteSpace: 'nowrap' }}>
                  €{PRICE_SHORTS.toFixed(2)}
                </p>
              </div>
              <p style={{ color: '#e2001a', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.5rem' }}>
                {t.hero.shortsCta} →
              </p>
            </div>
          </Link>

          <div className="plt-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(226,0,26,0.06)', border: '1px solid rgba(226,0,26,0.25)' }}>
            <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 0.4rem', fontWeight: 700 }}>
              {t.hero.essentialSetLabel}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem', margin: 0 }}>
                €{PRICE_BUNDLE_ESSENTIAL.toFixed(2)}
              </p>
              <p style={{ color: '#666', fontSize: '0.9rem', margin: 0, textDecoration: 'line-through' }}>
                €{(PRICE_TEE + PRICE_SHORTS).toFixed(2)}
              </p>
            </div>
            <p style={{ color: '#4ade80', fontSize: '0.82rem', fontWeight: 600, margin: '0 0 0.35rem' }}>
              {t.hero.essentialSetSave(bundleSavings)}
            </p>
            <p style={{ color: '#888', fontSize: '0.75rem', lineHeight: 1.5, margin: 0 }}>
              {t.hero.bundleHint}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
