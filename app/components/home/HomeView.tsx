import React from 'react';
import { Locale, getTranslation } from '@/lib/i18n';
import ProductHeroSection from './ProductHeroSection';
import TrustIcon from '@/app/components/TrustIcon';
import ReviewsSection from '@/app/components/reviews/ReviewsSection';

const outdoorIcons: Record<string, React.ReactNode> = {
  climb: <path d="M4 26 L14 8 L20 18 L26 6 L30 26 Z" fill="none" stroke="#e2001a" strokeWidth="2" strokeLinejoin="round" />,
  run: <><circle cx="20" cy="7" r="3" fill="#e2001a" /><path d="M17 12 L11 18 L15 22 L13 28 M17 12 L23 15 L27 12 M17 12 L18 20" fill="none" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>,
  ride: <><circle cx="9" cy="22" r="5" fill="none" stroke="#e2001a" strokeWidth="2" /><circle cx="25" cy="22" r="5" fill="none" stroke="#e2001a" strokeWidth="2" /><path d="M9 22 L15 12 L22 12 M15 12 L25 22 M20 8 L23 8" fill="none" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>,
  wild: <><path d="M16 4 L26 26 L6 26 Z" fill="none" stroke="#e2001a" strokeWidth="2" strokeLinejoin="round" /><path d="M12 26 L16 16 L20 26" fill="none" stroke="#e2001a" strokeWidth="2" strokeLinejoin="round" /></>,
};

export default function HomeView({ locale }: { locale: Locale }) {
  const t = getTranslation(locale);

  return (
    <>
      <ProductHeroSection locale={locale} />

      <section style={{ padding: '4rem 2rem 2rem', borderTop: '1px solid rgba(255,255,255,0.08)', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{t.howItWorks.title}</h2>
          <p style={{ color: '#999', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>{t.howItWorks.sub}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {t.howItWorks.steps.map((step) => (
            <div key={step.num} className="plt-card" style={{ padding: '1.75rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'rgba(226,0,26,0.12)', lineHeight: 1, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>{step.num}</div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.0rem', marginBottom: '0.5rem' }}>{step.label}</p>
              <p style={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '4rem 2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{t.outdoor.title}</h2>
          <p className="outdoor-sub" style={{ color: '#999', fontSize: '0.95rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>{t.outdoor.sub}</p>
        </div>
        <div className="outdoor-grid">
          {t.outdoor.cards.map((c) => (
            <div key={c.key} className="plt-card" style={{ padding: '1.75rem 1.25rem', textAlign: 'center' }}>
              <svg viewBox="0 0 32 32" width="44" height="44" style={{ marginBottom: '1rem' }}>{outdoorIcons[c.key]}</svg>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.35rem' }}>{c.label}</p>
              <p style={{ color: '#888', fontSize: '0.82rem', fontStyle: 'italic' }}>{c.line}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '5rem 2rem 2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <ReviewsSection locale={locale} compact />
      </section>

      <section style={{ padding: '3rem 2rem 5rem', borderTop: '1px solid rgba(255,255,255,0.08)', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="trust-grid">
          {t.trust.map((item) => (
            <div key={item.key} className="plt-card" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              gap: '0.85rem', padding: '1.5rem 1rem',
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%', background: '#141414',
                border: '1px solid rgba(226,0,26,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TrustIcon name={item.key} />
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.2rem' }}>{item.label}</p>
                <p style={{ color: '#888', fontSize: '0.72rem', letterSpacing: '0.02em' }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}