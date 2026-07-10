import Link from 'next/link';
import Logo from '@/app/components/Logo';

export default function ImpressumPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.07), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo size={44} />
        <Link href="/" style={{ color: '#888', fontSize: '0.8rem', textDecoration: 'none' }}>← Zurück</Link>
      </header>
      <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 2rem', lineHeight: 1.7 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Impressum</h1>
        <p style={{ color: '#888' }}>Angaben gemäß § 5 DDG</p>
        <p style={{ marginTop: '1rem' }}>Vorname Nachname<br/>PLATYPUS Shop<br/>Straße Hausnummer<br/>60000 Frankfurt am Main<br/>Deutschland</p>
        <p style={{ marginTop: '1rem' }}>Kontakt:<br/>E-Mail: kontakt@platypus-shop.de</p>
        <p style={{ marginTop: '1rem', color: '#888' }}>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:<br/>Vorname Nachname, Anschrift wie oben</p>
        <p style={{ marginTop: '2rem', color: '#555', fontSize: '0.85rem' }}>Plattform der EU-Kommission zur Online-Streitbeilegung: https://ec.europa.eu/consumers/odr — Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </div>
    </div>
  );
}
