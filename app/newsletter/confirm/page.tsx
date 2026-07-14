'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import { Suspense } from 'react';

function ConfirmContent() {
  const params = useSearchParams();
  const success = params.get('success') === '1';

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.08), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <SiteHeader />
      <main id="main-content" style={{ maxWidth: '520px', margin: '0 auto', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{success ? '✓' : '⚠'}</div>
        <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.22em', marginBottom: '0.6rem', textTransform: 'uppercase', fontWeight: 600 }}>
          PLATYPUS Newsletter
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          {success ? 'Bestätigt!' : 'Link abgelaufen'}
        </h1>
        <p style={{ color: '#999', lineHeight: 1.65, marginBottom: '2rem', fontSize: '0.95rem' }}>
          {success
            ? 'Du bist jetzt angemeldet. Wir halten dich über neue Drops, Angebote und PLATYPUS-Neuigkeiten auf dem Laufenden.'
            : 'Dieser Bestätigungslink ist ungültig oder bereits abgelaufen. Melde dich einfach erneut an.'}
        </p>
        <Link href="/" className="plt-btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '0.9rem 2rem' }}>
          Zur Startseite
        </Link>
      </main>
    </div>
  );
}

export default function NewsletterConfirmPage() {
  return (
    <Suspense>
      <ConfirmContent />
    </Suspense>
  );
}
