'use client';

import Link from 'next/link';
import Logo from '@/app/components/Logo';
import { useLocale } from '@/app/components/LocaleProvider';
import ReviewForm from '@/app/components/reviews/ReviewForm';
import ReviewsSection from '@/app/components/reviews/ReviewsSection';

export default function BewertungenPage() {
  const { locale, t } = useLocale();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.08), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <header style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo size={44} />
        <Link href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.875rem' }}>← Atelier</Link>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <ReviewsSection locale={locale} showLink={false} />

        <div style={{ marginTop: '3.5rem', display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t.reviews.formTitle}</h2>
            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{t.reviews.formSub}</p>
            <ReviewForm locale={locale} copy={t.reviews.form} />
          </div>

          <aside style={{
            background: '#121212',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
          }}>
            <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.75rem' }}>
              {t.reviews.moderationLabel}
            </p>
            <p style={{ color: '#aaa', fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>{t.reviews.moderationNote}</p>
          </aside>
        </div>
      </div>
    </div>
  );
}