import type { Metadata } from 'next';
import SiteHeader from '@/app/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Impressum | PLATYPUS',
  description: 'Impressum und Kontaktdaten von PLATYPUS — Premium Custom Shirts.',
};

const OPERATOR = {
  brand: 'ON ME – Personalisierte Textilien',
  name: 'Sergiu-Andrei Junc',
  address: 'Auf den Flachsbeckwiesen 13',
  postal: '45659 Recklinghausen',
  country: 'Deutschland',
  email: 's.junc@yahoo.com',
  phone: '01728224958',
};

const S = {
  section: { marginTop: '1.5rem' } as const,
  label: { color: '#888', fontSize: '0.9rem', marginBottom: '0.35rem' } as const,
  value: { lineHeight: 1.8 } as const,
};

export default function ImpressumPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.07), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <SiteHeader />
      <main id="main-content" style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem 5rem', lineHeight: 1.7 }}>
        <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.22em', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>PLATYPUS</p>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Impressum</h1>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '2rem' }}>Angaben gemäß § 5 DDG</p>

        <div style={S.section}>
          <p style={S.label}>Betreiber</p>
          <p style={S.value}>
            <strong>{OPERATOR.brand}</strong><br />
            {OPERATOR.name}<br />
            {OPERATOR.address}<br />
            {OPERATOR.postal}<br />
            {OPERATOR.country}
          </p>
        </div>

        <div style={S.section}>
          <p style={S.label}>Kontakt</p>
          <p style={S.value}>
            E-Mail: <a href={`mailto:${OPERATOR.email}`} style={{ color: '#e2001a' }}>{OPERATOR.email}</a><br />
            Telefon: {OPERATOR.phone}
          </p>
        </div>

        <div style={S.section}>
          <p style={S.label}>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</p>
          <p style={S.value}>{OPERATOR.name}, {OPERATOR.address}, {OPERATOR.postal}</p>
        </div>

        <div style={{ marginTop: '2.5rem', color: '#555', fontSize: '0.82rem', lineHeight: 1.6 }}>
          <p>
            Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>
      </main>
    </div>
  );
}
