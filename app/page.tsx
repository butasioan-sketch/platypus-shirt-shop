'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from './components/LocaleProvider';
import LocaleSwitcher from './components/LocaleSwitcher';
import { getAllProducts, getProductName, getProductDescription } from '@/lib/products';

export default function HomePage() {
  const { t, locale } = useLocale();
  const [cartCount, setCartCount] = useState(0);
  const products = getAllProducts();

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('platypus_cart') || '[]');
      setCartCount(cart.reduce((s: number, i: { quantity?: number }) => s + (i.quantity || 1), 0));
    } catch { setCartCount(0); }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        .produkt-karte:hover { transform: translateY(-6px); border-color: #e2001a !important; }
      `}</style>

      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#0a0a0a', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo.jpeg" alt="PLATYPUS" width={56} height={56} style={{ borderRadius: '10px', marginRight: '0.75rem' }} priority />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em', color: '#fff' }}>PLATYPUS</span>
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/versand" style={{ color: '#888', textDecoration: 'none', fontSize: '0.875rem' }}>{t.nav.shipping}</Link>
          <LocaleSwitcher />
          <Link href="/cart" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.875rem', background: '#e2001a', padding: '0.5rem 1.25rem', borderRadius: '999px', border: 'none', fontWeight: 600 }}>
            {t.nav.cart} {cartCount > 0 && `(${cartCount})`}
          </Link>
        </nav>
      </header>

      <section style={{ padding: '4rem 2rem 6rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <Image src="/logo.jpeg" alt="PLATYPUS" width={260} height={260} style={{ borderRadius: '24px', boxShadow: '0 20px 60px rgba(226,0,26,0.25)' }} priority />
        </div>
        <p style={{ color: '#666', fontSize: '0.75rem', letterSpacing: '0.3em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>{t.hero.badge}</p>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
          {t.hero.headline1}<br />
          <span style={{ color: '#444' }}>{t.hero.headline2}</span>
        </h1>
        <p style={{ color: '#666', fontSize: '1.125rem', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>
          {t.hero.sub}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/product/1" style={{ background: '#e2001a', color: '#fff', padding: '0.875rem 2.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em' }}>
            {t.hero.cta}
          </Link>
          <Link href="/product/1" style={{ background: 'transparent', color: '#fff', padding: '0.875rem 2.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', border: '1px solid #333' }}>
            {t.hero.viewer}
          </Link>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
              <div className="produkt-karte" style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.2s, border-color 0.2s' }}>
                <div style={{ height: '300px', background: `linear-gradient(160deg, ${p.color} 0%, ${p.color} 60%, ${p.color}dd 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {/* Shirt-Silhouette */}
                  <svg width="150" height="180" viewBox="0 0 150 180" style={{ filter: `drop-shadow(0 10px 24px rgba(0,0,0,0.25))` }}>
                    <path d="M45 32 L63 16 L87 16 L105 32 L128 48 L113 70 L100 60 L100 168 L50 168 L50 60 L37 70 L22 48 Z"
                      fill={p.color === '#111111' ? '#1c1c1c' : '#ffffff'}
                      stroke={p.color === '#111111' ? '#333' : '#e5e5e5'} strokeWidth="1.5"/>
                    <path d="M63 16 Q75 34 87 16" fill="none" stroke={p.color === '#111111' ? '#333' : '#e5e5e5'} strokeWidth="1.5"/>
                  </svg>
                  <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(226,0,26,0.9)', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '0.3rem 0.7rem', borderRadius: '999px', letterSpacing: '0.1em' }}>SELBST GESTALTEN</span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ color: '#fff', fontWeight: 700, marginBottom: '0.25rem', fontSize: '1.05rem' }}>{getProductName(p, locale)}</p>
                      <p style={{ color: '#666', fontSize: '0.8rem' }}>{getProductDescription(p, locale)}</p>
                    </div>
                    <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem' }}>€{p.price}</p>
                  </div>
                  <div style={{ marginTop: '1.25rem', background: '#e2001a', color: '#fff', padding: '0.7rem', borderRadius: '10px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                    {t.hero.cta}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', borderTop: '1px solid #111', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {t.trust.map((item) => (
            <div key={item.label}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{item.label}</p>
              <p style={{ color: '#555', fontSize: '0.75rem' }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #111', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#333', fontSize: '0.75rem', marginBottom: '1rem', letterSpacing: '0.2em' }}>PLATYPUS — Premium Print-on-Demand</p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['Impressum', '/impressum'], ['Datenschutz', '/datenschutz'], ['AGB', '/agb'], [t.nav.shipping, '/versand']].map(([label, href]) => (
            <Link key={href} href={href} style={{ color: '#444', textDecoration: 'none', fontSize: '0.75rem' }}>{label}</Link>
          ))}
        </div>
      </footer>

    </div>
  );
}
