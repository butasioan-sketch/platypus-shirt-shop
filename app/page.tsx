'use client';
import React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from './components/LocaleProvider';
import LocaleSwitcher from './components/LocaleSwitcher';
import CartCount from '@/app/components/CartCount';
import ProductHeroViewer from '@/app/components/ProductHeroViewer';
import ShirtFlip from '@/app/components/ShirtFlip';
import dynamic from 'next/dynamic';
import { BRAND_DEMO_PRINT, VIEWER_DEFAULTS } from '@/lib/print-spec';

const Shirt3D = dynamic(() => import('@/app/components/Shirt3D'), {
  ssr: false,
  loading: () => (
    <ShirtFlip
      autoRotateSpeed={VIEWER_DEFAULTS.autoRotateSpeed2D}
      showControls={false}
      showHint={false}
      frontPrint={BRAND_DEMO_PRINT.front}
      backPrint={BRAND_DEMO_PRINT.back}
    />
  ),
});
import { getAllProducts, getProductName, getProductDescription } from '@/lib/products';

export default function HomePage() {
  const { t, locale } = useLocale();
  const outdoorIcons: Record<string, React.ReactNode> = {
    climb: <path d="M4 26 L14 8 L20 18 L26 6 L30 26 Z" fill="none" stroke="#e2001a" strokeWidth="2" strokeLinejoin="round"/>,
    run: <><circle cx="20" cy="7" r="3" fill="#e2001a"/><path d="M17 12 L11 18 L15 22 L13 28 M17 12 L23 15 L27 12 M17 12 L18 20" fill="none" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
    ride: <><circle cx="9" cy="22" r="5" fill="none" stroke="#e2001a" strokeWidth="2"/><circle cx="25" cy="22" r="5" fill="none" stroke="#e2001a" strokeWidth="2"/><path d="M9 22 L15 12 L22 12 M15 12 L25 22 M20 8 L23 8" fill="none" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
    wild: <><path d="M16 4 L26 26 L6 26 Z" fill="none" stroke="#e2001a" strokeWidth="2" strokeLinejoin="round"/><path d="M12 26 L16 16 L20 26" fill="none" stroke="#e2001a" strokeWidth="2" strokeLinejoin="round"/></>,
  };

  const products = getAllProducts();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      setPaymentSuccess(true);
      localStorage.removeItem('platypus_cart');
      window.dispatchEvent(new Event('cart-updated'));
      window.history.replaceState({}, '', '/');
      const timer = setTimeout(() => setPaymentSuccess(false), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1200px 600px at 50% -10%, rgba(226,0,26,0.10), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {paymentSuccess && (
        <div style={{ position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#16a34a', color: '#fff', padding: '0.9rem 1.5rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 12px 32px rgba(22,163,74,0.4)', maxWidth: '90vw', textAlign: 'center' }}>
          ✅ Zahlung erfolgreich! Du erhältst deine Bestellbestätigung per E-Mail.
        </div>
      )}
      <style>{`
        .produkt-karte:hover { transform: translateY(-6px); border-color: #e2001a !important; box-shadow: 0 16px 40px rgba(226,0,26,0.12); }
        .produkt-karte { transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
        .btn-primary:hover { background: #ff1a33 !important; transform: translateY(-2px); }
        .btn-primary { transition: background 0.2s, transform 0.2s; }
        .btn-ghost:hover { border-color: #e2001a !important; color: #fff !important; }
        .trust-grid, .outdoor-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
        @media (min-width: 768px) {
          .trust-grid { grid-template-columns: repeat(4, 1fr); }
          .outdoor-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 640px) {
          .site-header { padding: 0.85rem 1rem !important; }
          .site-header nav { gap: 0.75rem !important; }
          .brand-text { display: none; }
        }
      `}</style>

      <header className="site-header" style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo.jpeg" alt="PLATYPUS" width={56} height={56} style={{ borderRadius: '10px', marginRight: '0.75rem' }} priority />
          <span className="brand-text" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em', color: '#fff' }}>PLATYPUS</span>
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/versand" style={{ color: '#888', textDecoration: 'none', fontSize: '0.875rem' }}>{t.nav.shipping}</Link>
          <LocaleSwitcher />
          <CartCount />
        </nav>
      </header>

      <section style={{ padding: '3rem 2rem 5rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <ProductHeroViewer height={400} />
        <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.28em', margin: '1.5rem 0 1rem', textTransform: 'uppercase', fontWeight: 600 }}>{t.hero.badge}</p>
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4.2rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
          {t.hero.headline1}<br />
          <span style={{ background: 'linear-gradient(90deg, #e2001a, #ff5577)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{t.hero.headline2}</span>
        </h1>
        <p style={{ color: '#9a9a9a', fontSize: '1.05rem', lineHeight: 1.65, maxWidth: '540px', margin: '0 auto 2rem' }}>
          {t.hero.sub}
        </p>
        <Link href="/product/1" className="btn-primary" style={{ display: 'inline-block', background: '#e2001a', color: '#fff', padding: '0.95rem 2.75rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', boxShadow: '0 8px 24px rgba(226,0,26,0.35)' }}>
          {t.hero.cta}
        </Link>
      </section>

      <section style={{ padding: '3rem 2rem 4rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Was trägst du eigentlich?</h2>
          <p style={{ color: '#888', fontSize: '0.95rem' }}>Fremde Marken? Fremde Worte?
Oder endlich: dich selbst.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
              <div className="produkt-karte" style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.2s, border-color 0.2s', position: 'relative' }}>
                <div style={{ height: '340px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  {/* Shirt-Flip-Animation */}
                  <div style={{ width: '100%', height: '340px' }}>
                    <Shirt3D enableTouch={false} frontPrint={BRAND_DEMO_PRINT.front} backPrint={BRAND_DEMO_PRINT.back} />
                  </div>
                  <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(226,0,26,0.9)', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '0.3rem 0.7rem', borderRadius: '999px', letterSpacing: '0.1em' }}>SELBST GESTALTEN</span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ color: '#fff', fontWeight: 700, marginBottom: '0.25rem', fontSize: '1.05rem' }}>{getProductName(p, locale)}</p>
                      <p style={{ color: '#999', fontSize: '0.8rem', lineHeight: 1.5 }}>{getProductDescription(p, locale)}</p>
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

      <section style={{ padding: '5rem 2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{t.outdoor.title}</h2>
          <p style={{ color: '#999', fontSize: '0.95rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>{t.outdoor.sub}</p>
        </div>
        <div className="outdoor-grid">
          {t.outdoor.cards.map((c) => (
            <div key={c.key} style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.75rem 1.25rem', textAlign: 'center', transition: 'border-color 0.2s' }}>
              <svg viewBox="0 0 32 32" width="44" height="44" style={{ marginBottom: '1rem' }}>{outdoorIcons[c.key]}</svg>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.35rem' }}>{c.label}</p>
              <p style={{ color: '#888', fontSize: '0.82rem', fontStyle: 'italic' }}>{c.line}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.08)', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="trust-grid">
          {t.trust.map((item) => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.85rem', padding: '1.5rem 1rem', background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#141414', border: '1px solid rgba(226,0,26,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                {item.icon}
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.2rem' }}>{item.label}</p>
                <p style={{ color: '#888', fontSize: '0.72rem', letterSpacing: '0.02em' }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
