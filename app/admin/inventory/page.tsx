'use client';

import Link from 'next/link';

const PRODUCTS = [
  { id: '1', name: 'AirFit Pro', price: 39.99, sizes: ['S', 'M', 'L', 'XL', 'XXL'], status: 'aktiv', color: '#f5f5f5' },
];

export default function InventoryPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.06), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</Link>
        <Link href="/admin" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none' }}>← Admin</Link>
      </header>

      <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Inventory</h1>
          <span style={{ color: '#555', fontSize: '0.875rem' }}>{PRODUCTS.length} Produkte</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {PRODUCTS.map((p) => (
            <div key={p.id} style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: p.color, borderRadius: '8px', flexShrink: 0, border: '1px solid #333' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <p style={{ fontWeight: 700 }}>{p.name}</p>
                  <p style={{ fontWeight: 700 }}>€{p.price}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {p.sizes.map(s => (
                    <span key={s} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#888' }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ background: '#052e16', color: '#4ade80', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem' }}>{p.status}</span>
                  <Link href={`/product/${p.id}`} style={{ color: '#555', fontSize: '0.75rem', textDecoration: 'none' }}>Produktseite →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
          <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Print-on-Demand System</p>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>Produkte werden nach Bestellung individuell produziert. Kein Lagerbestand notwendig.</p>
        </div>
      </div>
    </div>
  );
}
