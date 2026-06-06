import Link from 'next/link';

export default function ImpressumPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</Link>
        <Link href="/" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none' }}>← Zurück</Link>
      </header>
      <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Impressum</h1>
        <div dangerouslySetInnerHTML={{ __html: `<p>Angaben gemäß § 5 TMG</p>
        <p style='margin-top:1rem'>PLATYPUS Shop<br/>Musterstraße 1<br/>12345 Musterstadt<br/>Deutschland</p>
        <p style='margin-top:1rem'>Kontakt:<br/>E-Mail: kontakt@platypus-shop.de</p>
        <p style='margin-top:1rem;color:#555;font-size:0.8rem'>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV: Inhaber PLATYPUS Shop</p>` }} />
      </div>
    </div>
  );
}
