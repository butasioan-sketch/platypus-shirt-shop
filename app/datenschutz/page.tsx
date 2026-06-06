import Link from 'next/link';

export default function DatenschutzPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</Link>
        <Link href="/" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none' }}>← Zurück</Link>
      </header>
      <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Datenschutz</h1>
        <div dangerouslySetInnerHTML={{ __html: `<p>Wir nehmen den Schutz deiner Daten ernst.</p>
        <h2 style='margin-top:2rem;font-size:1.25rem'>Datenerhebung</h2>
        <p style='margin-top:0.75rem;color:#888'>Beim Kauf werden deine Daten ausschließlich zur Bestellabwicklung via Stripe verarbeitet. Wir speichern keine Zahlungsdaten.</p>
        <h2 style='margin-top:2rem;font-size:1.25rem'>Stripe</h2>
        <p style='margin-top:0.75rem;color:#888'>Zahlungen werden über Stripe Inc. abgewickelt. Es gelten die Datenschutzbestimmungen von Stripe: stripe.com/privacy</p>
        <h2 style='margin-top:2rem;font-size:1.25rem'>Cookies</h2>
        <p style='margin-top:0.75rem;color:#888'>Wir verwenden LocalStorage für den Warenkorb. Keine Tracking-Cookies.</p>` }} />
      </div>
    </div>
  );
}
