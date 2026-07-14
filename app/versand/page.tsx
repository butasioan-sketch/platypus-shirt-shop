import Link from 'next/link';
import type { Metadata } from 'next';
import SiteHeader from '@/app/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Versand & Reklamation | PLATYPUS',
  description: 'Versandoptionen für Deutschland und Rumänien, Produktionszeiten und Reklamationsprozess für PLATYPUS Custom-Shirts.',
};

const shippingDE = [
  { label: 'Hermes', detail: '€4.49 · 2–4 Werktage nach Produktion' },
  { label: 'DPD', detail: '€4.79 · 2–4 Werktage nach Produktion' },
  { label: 'DHL', detail: '€4.99 · 1–3 Werktage nach Produktion' },
];

const shippingRO = [
  { label: 'Hermes', detail: '€12.99 · 4–7 Werktage nach Produktion' },
  { label: 'DPD', detail: '€13.49 · 4–7 Werktage nach Produktion' },
  { label: 'DHL', detail: '€13.99 · 3–5 Werktage nach Produktion' },
];

function ShippingCard({ title, rows }: { title: string; rows: { label: string; detail: string }[] }) {
  return (
    <div className="plt-card" style={{ padding: '1.5rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {rows.map((row) => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', flexWrap: 'wrap', gap: '0.25rem' }}>
            <span style={{ fontWeight: 600, color: '#ccc' }}>{row.label}</span>
            <span style={{ color: '#888' }}>{row.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VersandPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.07), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <SiteHeader />

      <main id="main-content" style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>
        <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.22em', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>PLATYPUS</p>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Versand & Reklamation</h1>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          Jedes Shirt wird nach deiner Bestellung gefertigt. Produktionszeit:{' '}
          <strong style={{ color: '#fff' }}>2–3 Werktage</strong>.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
          <ShippingCard title="Deutschland" rows={shippingDE} />
          <ShippingCard title="Rumänien" rows={shippingRO} />
        </div>

        <div className="plt-card" style={{ padding: '1.75rem', border: '1px solid rgba(226,0,26,0.2)', background: 'rgba(226,0,26,0.04)', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>Reklamation & Qualitätsversprechen</h2>
          <p style={{ color: '#aaa', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            Da jedes Shirt individuell mit deinem Motiv bedruckt wird, ist ein Widerruf gesetzlich ausgeschlossen
            (§ 312g Abs. 2 Nr. 1 BGB).
          </p>
          <p style={{ color: '#aaa', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Bei <strong style={{ color: '#fff' }}>Druckfehlern, Beschädigungen oder Falschlieferungen</strong> ersetzen wir
            dein Shirt kostenfrei oder erstatten den Kaufpreis vollständig — ohne Diskussion.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '1rem 1.25rem', fontSize: '0.82rem', color: '#999' }}>
            <p style={{ fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Reklamationsprozess:</p>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', lineHeight: 1.6 }}>
              <li>Foto des Fehlers machen</li>
              <li>
                E-Mail an{' '}
                <a href="mailto:butasioan@googlemail.com" style={{ color: '#e2001a', textDecoration: 'none', fontWeight: 600 }}>
                  butasioan@googlemail.com
                </a>{' '}
                mit Bestellnummer (PLT-…) + Foto
              </li>
              <li>Wir melden uns innerhalb von 48 Stunden mit Lösung</li>
            </ol>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
          <Link href="/faq" style={{ color: '#888', fontSize: '0.82rem', textDecoration: 'none', borderBottom: '1px solid #333' }}>
            Weitere Fragen → FAQ
          </Link>
          <Link href="/product/1" style={{ color: '#888', fontSize: '0.82rem', textDecoration: 'none', borderBottom: '1px solid #333' }}>
            ← Zurück zum Atelier
          </Link>
        </div>
      </main>
    </div>
  );
}
