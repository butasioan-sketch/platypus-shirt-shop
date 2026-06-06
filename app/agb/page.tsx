import Link from 'next/link';

export default function AGBPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</Link>
        <Link href="/" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none' }}>← Zurück</Link>
      </header>
      <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>AGB</h1>
        <div dangerouslySetInnerHTML={{ __html: `<h2 style='font-size:1.25rem'>§1 Geltungsbereich</h2>
        <p style='margin-top:0.75rem;color:#888'>Diese AGB gelten für alle Bestellungen über platypus-shirt-shop.vercel.app</p>
        <h2 style='margin-top:2rem;font-size:1.25rem'>§2 Vertragsschluss</h2>
        <p style='margin-top:0.75rem;color:#888'>Der Kauf kommt mit Abschluss des Stripe Checkouts zustande.</p>
        <h2 style='margin-top:2rem;font-size:1.25rem'>§3 Preise</h2>
        <p style='margin-top:0.75rem;color:#888'>Alle Preise inkl. MwSt. zzgl. Versandkosten (€4.99 DE).</p>
        <h2 style='margin-top:2rem;font-size:1.25rem'>§4 Rückgabe</h2>
        <p style='margin-top:0.75rem;color:#888'>14 Tage Widerrufsrecht ab Erhalt der Ware.</p>
        <h2 style='margin-top:2rem;font-size:1.25rem'>§5 Produktion</h2>
        <p style='margin-top:0.75rem;color:#888'>Print-on-Demand — jedes Shirt wird individuell produziert. Lieferzeit 5–10 Werktage.</p>` }} />
      </div>
    </div>
  );
}
