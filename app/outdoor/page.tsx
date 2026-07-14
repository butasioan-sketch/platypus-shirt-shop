'use client';

import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import { useLocale } from '@/app/components/LocaleProvider';
import ReviewsSection from '@/app/components/reviews/ReviewsSection';

const ICONS: Record<string, string> = {
  climb: '🧗',
  run: '🏃',
  ride: '🚴',
  wild: '🌲',
};

export default function OutdoorPage() {
  const { locale, t } = useLocale();
  const { title, sub, cards } = t.outdoor;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0505 0%, #0a0a0a 40%)', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <SiteHeader />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '6rem 2rem 5rem', textAlign: 'center', background: 'radial-gradient(800px 400px at 50% 0%, rgba(226,0,26,0.12), transparent 70%)' }}>
        <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.3em', fontWeight: 700, marginBottom: '1.25rem', textTransform: 'uppercase' }}>
          PLATYPUS × OUTDOOR
        </p>
        <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto 1.5rem' }}>
          {title}
        </h1>
        <p style={{ color: '#888', fontSize: '1.05rem', lineHeight: 1.65, maxWidth: '520px', margin: '0 auto 2.5rem' }}>
          {sub}
        </p>
        <Link href="/product/1" className="plt-btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '1rem 2.5rem', fontSize: '1rem' }}>
          {locale === 'de' ? 'Jetzt gestalten' : locale === 'ro' ? 'Creează acum' : 'Start designing'}
        </Link>
      </section>

      {/* Activity Cards */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 2rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {cards.map((card) => (
            <div key={card.key} className="plt-card plt-fade-in-up" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{ICONS[card.key] ?? '⚡'}</div>
              <p style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>{card.label}</p>
              <p style={{ color: '#666', fontSize: '0.88rem', fontStyle: 'italic' }}>{card.line}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Strip */}
      <section style={{ background: '#0f0f0f', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
          {[
            { icon: '💧', label: locale === 'de' ? 'Feuchtigkeitsableitend' : locale === 'ro' ? 'Evacuează umiditatea' : 'Moisture-wicking', sub: locale === 'de' ? 'Performance-Polyester hält trocken' : locale === 'ro' ? 'Poliester premium menține uscăciunea' : 'Performance polyester stays dry' },
            { icon: '🎨', label: locale === 'de' ? 'Farben ohne Kompromiss' : locale === 'ro' ? 'Culori fără compromis' : 'Colors without compromise', sub: locale === 'de' ? 'Sublimiert in die Faser — keine Schicht drüber' : locale === 'ro' ? 'Sublimat în fibră — fără strat suplimentar' : 'Sublimated into the fiber — no layer on top' },
            { icon: '♻️', label: locale === 'de' ? 'Maßanfertigung' : locale === 'ro' ? 'Confecționat pe comandă' : 'Made to order', sub: locale === 'de' ? 'Kein Overstock, kein Wegwurf' : locale === 'ro' ? 'Fără stocuri inutile' : 'No overstock, no waste' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{f.label}</p>
                <p style={{ color: '#666', fontSize: '0.82rem', lineHeight: 1.55 }}>{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem 2rem' }}>
        <ReviewsSection locale={locale} showLink />
      </div>

      {/* Final CTA */}
      <section style={{ textAlign: 'center', padding: '4rem 2rem 6rem', background: 'radial-gradient(600px 300px at 50% 50%, rgba(226,0,26,0.07), transparent 70%)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          {locale === 'de' ? 'Dein Statement. Dein Weg.' : locale === 'ro' ? 'Declarația ta. Drumul tău.' : 'Your statement. Your trail.'}
        </h2>
        <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '2rem' }}>
          {locale === 'de' ? 'Jedes Piece wird einzeln für dich gefertigt — kein Lager, keine Kompromisse.' : locale === 'ro' ? 'Fiecare piesă este creată special pentru tine.' : 'Every piece made to order — no stock, no compromise.'}
        </p>
        <Link href="/product/1" className="plt-btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '1rem 2.5rem', fontSize: '1rem' }}>
          {locale === 'de' ? 'Motiv hochladen →' : locale === 'ro' ? 'Încarcă motivul →' : 'Upload your design →'}
        </Link>
      </section>
    </div>
  );
}
