import Link from 'next/link';

export default function VersandPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</Link>
        <Link href="/" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none' }}>← Zurück</Link>
      </header>
      <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Versand</h1>
        <div dangerouslySetInnerHTML={{ __html: `<div style='display:grid;gap:1.5rem'>
        <div style='background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:1.5rem'>
          <h2 style='font-size:1.125rem;margin-bottom:0.5rem'>Deutschland</h2>
          <p style='color:#888;font-size:0.875rem'>€4.99 — 3–5 Werktage nach Produktion</p>
        </div>
        <div style='background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:1.5rem'>
          <h2 style='font-size:1.125rem;margin-bottom:0.5rem'>EU</h2>
          <p style='color:#888;font-size:0.875rem'>€8.99 — 5–10 Werktage</p>
        </div>
        <div style='background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:1.5rem'>
          <h2 style='font-size:1.125rem;margin-bottom:0.5rem'>Produktion</h2>
          <p style='color:#888;font-size:0.875rem'>Print-on-Demand: jedes Shirt wird nach Bestellung gedruckt. Produktionszeit: 2–3 Werktage.</p>
        </div>
        <div style='background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:1.5rem'>
          <h2 style='font-size:1.125rem;margin-bottom:0.5rem'>Rückgabe</h2>
          <p style='color:#888;font-size:0.875rem'>14 Tage ab Erhalt. Rücksendekosten trägt der Käufer.</p>
        </div>
      </div>` }} />
      </div>
    </div>
  );
}
