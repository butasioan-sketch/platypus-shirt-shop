import Link from 'next/link';
import Logo from '@/app/components/Logo';

export default function ImpressumPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.07), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo size={44} />
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
