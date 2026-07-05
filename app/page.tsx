'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from './components/LocaleProvider';
import LocaleSwitcher from './components/LocaleSwitcher';
import CartCount from '@/app/components/CartCount';
import ShirtFlip from '@/app/components/ShirtFlip';
import { getAllProducts, getProductName, getProductDescription } from '@/lib/products';

export default function HomePage() {
  const { t, locale } = useLocale();
  const products = getAllProducts();

  useEffect(() => {
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1200px 600px at 50% -10%, rgba(226,0,26,0.10), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        .produkt-karte:hover { transform: translateY(-6px); border-color: #e2001a !important; box-shadow: 0 16px 40px rgba(226,0,26,0.12); }
        .produkt-karte { transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
        .btn-primary:hover { background: #ff1a33 !important; transform: translateY(-2px); }
        .btn-primary { transition: background 0.2s, transform 0.2s; }
        .btn-ghost:hover { border-color: #e2001a !important; color: #fff !important; }
      `}</style>

      <header style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo.jpeg" alt="PLATYPUS" width={56} height={56} style={{ borderRadius: '10px', marginRight: '0.75rem' }} priority />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em', color: '#fff' }}>PLATYPUS</span>
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/versand" style={{ color: '#888', textDecoration: 'none', fontSize: '0.875rem' }}>{t.nav.shipping}</Link>
          <LocaleSwitcher />
          <CartCount />
        </nav>
      </header>

      <section style={{ padding: '5rem 2rem 7rem', textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.75rem', position: 'relative' }}>
          <div style={{ position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(226,0,26,0.28), transparent 65%)', filter: 'blur(20px)', zIndex: 0 }} />
          <Image src="/logo.jpeg" alt="PLATYPUS" width={240} height={240} style={{ borderRadius: '28px', boxShadow: '0 24px 70px rgba(226,0,26,0.30)', position: 'relative', zIndex: 1 }} priority />
        </div>
        <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.32em', marginBottom: '1.5rem', textTransform: 'uppercase', fontWeight: 600 }}>{t.hero.badge}</p>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 0.95, marginBottom: '1.75rem', letterSpacing: '-0.03em' }}>
          {t.hero.headline1}<br />
          <span style={{ background: 'linear-gradient(90deg, #e2001a, #ff5577)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{t.hero.headline2}</span>
        </h1>
        <p style={{ color: '#9a9a9a', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 3rem' }}>
          {t.hero.sub}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/product/1" className="btn-primary" style={{ background: '#e2001a', color: '#fff', padding: '0.95rem 2.75rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', boxShadow: '0 8px 24px rgba(226,0,26,0.35)' }}>
            {t.hero.cta}
          </Link>
          <Link href="/product/1" className="btn-ghost" style={{ background: 'rgba(255,255,255,0.03)', color: '#ccc', padding: '0.95rem 2.75rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', border: '1px solid #2a2a2a', transition: 'all 0.2s' }}>
            {t.hero.viewer}
          </Link>
        </div>
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
                <div style={{ height: '300px', background: `linear-gradient(160deg, ${p.color} 0%, ${p.color} 60%, ${p.color}dd 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {/* Shirt-Flip-Animation */}
                  <div style={{ width: '100%', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <ShirtFlip color={p.color} />
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

      <section style={{ padding: '5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.08)', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
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
