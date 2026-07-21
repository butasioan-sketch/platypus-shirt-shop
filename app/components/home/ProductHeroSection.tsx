import Link from 'next/link';
import { Locale, getTranslation } from '@/lib/i18n';
import { getAllProducts, getProductName, getProduct, type Product } from '@/lib/products';
import { PRICE_TEE, PRICE_SHORTS, PRICE_BUNDLE_ESSENTIAL } from '@/lib/pricing';
import ProductHeroViewer from '@/app/components/ProductHeroViewer';
import ShortsHeroViewer from '@/app/components/ShortsHeroViewer';

const TEE_HREF = '/product/1';
const SHORTS_HREF = '/product/2';
const CARD_HEIGHT = 320;

function ProductCard({
  href, viewer, badgeLabel, name, price, cta,
}: {
  href: string;
  viewer: React.ReactNode;
  badgeLabel: string;
  name: string;
  price: number;
  cta: string;
}) {
  return (
    <Link href={href} className="plt-card hero-collection-card" style={{ display: 'block', textDecoration: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'relative' }}>{viewer}</div>
      <div style={{ padding: '1.25rem' }}>
        <p style={{ color: '#888', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>
          {badgeLabel}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.9rem' }}>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem', margin: 0 }}>{name}</p>
          <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>€{price.toFixed(2)}</p>
        </div>
        <span className="plt-btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center' }}>
          {cta}
        </span>
      </div>
    </Link>
  );
}

export default function ProductHeroSection({ locale }: { locale: Locale }) {
  const t = getTranslation(locale);
  const tee = getAllProducts()[0];
  const shorts = getProduct('2');
  if (!tee) return null;

  const bundleSavings = (PRICE_TEE + PRICE_SHORTS - PRICE_BUNDLE_ESSENTIAL).toFixed(2);

  return (
    <section className="hero-product" style={{ padding: '2.5rem 2rem 4rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
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
        <p style={{ color: '#9a9a9a', fontSize: '1rem', lineHeight: 1.65 }}>
          {t.hero.sub}
        </p>
      </div>

      {/* Essential Collection — Tee und Shorts gleichwertig, gleich grosse Karten */}
      <div className="hero-collection-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <ProductCard
          href={TEE_HREF}
          viewer={<ProductHeroViewer height={CARD_HEIGHT} />}
          badgeLabel={t.brand.collection}
          name={getProductName(tee, locale)}
          price={PRICE_TEE}
          cta={t.hero.cta}
        />
        {shorts && (
          <ProductCard
            href={SHORTS_HREF}
            viewer={<ShortsHeroViewer height={CARD_HEIGHT} variant="dark" />}
            badgeLabel={t.brand.collection}
            name={getProductName(shorts as Product, locale)}
            price={PRICE_SHORTS}
            cta={t.hero.shortsCta}
          />
        )}
      </div>

      {shorts && (
        <div className="plt-card" style={{ padding: '1.5rem', background: 'rgba(226,0,26,0.06)', border: '1px solid rgba(226,0,26,0.25)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 0.4rem', fontWeight: 700 }}>
              {t.hero.essentialSetLabel}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.6rem', margin: 0 }}>
                €{PRICE_BUNDLE_ESSENTIAL.toFixed(2)}
              </p>
              <p style={{ color: '#666', fontSize: '1rem', margin: 0, textDecoration: 'line-through' }}>
                €{(PRICE_TEE + PRICE_SHORTS).toFixed(2)}
              </p>
              <p style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
                {t.hero.essentialSetSave(bundleSavings)}
              </p>
            </div>
            <p style={{ color: '#888', fontSize: '0.78rem', margin: 0 }}>
              {t.hero.bundleHint}
            </p>
          </div>
          <Link href={TEE_HREF} className="plt-btn-secondary" style={{ whiteSpace: 'nowrap' }}>
            {t.hero.cta} →
          </Link>
        </div>
      )}
    </section>
  );
}
