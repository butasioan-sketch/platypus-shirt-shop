import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/app/components/Logo';

export const metadata: Metadata = {
  title: 'Impressum | PLATYPUS',
  description: 'Impressum und Kontaktdaten von PLATYPUS — I. Butas, Premium Custom Shirts.',
};

const OPERATOR = {
  name: 'I. Butas',
  brand: 'PLATYPUS · On Me',
  email: 'butasioan@googlemail.com',
  phone: '+49 157 77283535',
  country: 'Deutschland',
};

export default function ImpressumPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.07), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo size={44} />
        <Link href="/" style={{ color: '#888', fontSize: '0.8rem', textDecoration: 'none' }}>← Zurück</Link>
      </header>
      <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 2rem 4rem', lineHeight: 1.7 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Impressum</h1>
        <p style={{ color: '#888' }}>Angaben gemäß § 5 DDG</p>

        <p style={{ marginTop: '1.25rem' }}>
          <strong>{OPERATOR.name}</strong><br />
          {OPERATOR.brand}<br />
          {OPERATOR.country}
        </p>

        <p style={{ marginTop: '1.25rem' }}>
          <strong>Kontakt</strong><br />
          Telefon: <a href={`tel:${OPERATOR.phone.replace(/\s/g, '')}`} style={{ color: '#e2001a', textDecoration: 'none' }}>{OPERATOR.phone}</a><br />
          E-Mail: <a href={`mailto:${OPERATOR.email}`} style={{ color: '#e2001a', textDecoration: 'none' }}>{OPERATOR.email}</a>
        </p>

        <p style={{ marginTop: '1.25rem', color: '#888' }}>
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:<br />
          {OPERATOR.name}
        </p>

        <p style={{ marginTop: '2rem', color: '#555', fontSize: '0.85rem' }}>
          Plattform der EU-Kommission zur Online-Streitbeilegung:{' '}
          <a href="https://ec.europa.eu/consumers/odr" style={{ color: '#888' }}>ec.europa.eu/consumers/odr</a>
          <br />
          Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </div>
    </div>
  );
}