'use client';

import { getShipping, DEFAULT_SHIPPING_ID, DEFAULT_COUNTRY } from '@/lib/shipping';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Logo from '@/app/components/Logo';
import CartCount from '@/app/components/CartCount';

const DesignStudio = dynamic(() => import('@/app/components/DesignStudio'), { ssr: false });
import { calcUnitPrice } from '@/lib/pricing';
import { PRINT_SPEC } from '@/lib/print-spec';
import { trackAddToCart } from '@/lib/analytics';

const COLORS = [
  { key: 'weiss', hex: '#f5f5f5', label: 'Weiß' },
  // weitere Farben folgen wenn Blanks bestellt
];

const PRODUCTS: Record<string, { name: string; price: number; color: string; sizes: string[] }> = {
  '1': { name: 'AirFit Pro', price: 39.99, color: '#f5f5f5', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
};

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const product = PRODUCTS[id] || PRODUCTS['1'];

  const [size, setSize] = useState('');
  const [fit] = useState('Unisex');
  const [colorKey, setColorKey] = useState('weiss');
  const activeColor = COLORS.find(c => c.key === colorKey) || COLORS[0];
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const [design, setDesign] = useState<{ front: string | null; back: string | null }>({ front: null, back: null });
  const unitPrice = calcUnitPrice(design?.front, design?.back);

  const saveDesign = async (): Promise<string | null> => {
    if (!design.front && !design.back) return null;
    try {
      const res = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ front: design.front, back: design.back, productId: id }),
      });
      const data = await res.json();
      return data.id || null;
    } catch { return null; }
  };

  const addToCart = async () => {
    if (!size) { setError('Bitte Größe wählen'); return; }
    setError('');
    const designId = await saveDesign();
    try {
      const cart = JSON.parse(localStorage.getItem('platypus_cart') || '[]');
      // Mit Motiv: IMMER eigene Position (jedes Design = eigener Druckauftrag).
      // Ohne Motiv: gleiche Groesse zusammenfassen wie bisher.
      const existing = designId ? -1 : cart.findIndex(
        (i: { id: string; size: string; designId?: string }) =>
          i.id === id && i.size === size && !i.designId
      );
      if (existing >= 0) {
        cart[existing].quantity = (cart[existing].quantity || 1) + 1;
      } else {
        cart.push({ id, name: product.name, price: unitPrice, size, fit, color: activeColor.label, quantity: 1, designId });
      }
      localStorage.setItem('platypus_cart', JSON.stringify(cart));
      trackAddToCart({ id, name: product.name, price: unitPrice, size, color: activeColor.label, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch { setError('Fehler beim Hinzufügen'); }
  };

  const buyNow = async () => {
    if (!size) { setError('Bitte Größe wählen'); return; }
    setError('');
    setLoading(true);
    try {
      const designId = await saveDesign();
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'card',
          reference: `PROD-${id}-${size}`,
          shipping: getShipping(DEFAULT_SHIPPING_ID, DEFAULT_COUNTRY),
          total: unitPrice + getShipping(DEFAULT_SHIPPING_ID, DEFAULT_COUNTRY),
          country: DEFAULT_COUNTRY,
          shippingMethod: 'DHL',
          items: [{ name: product.name, size, color: activeColor.label, price: unitPrice, quantity: 1, designId }],
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError('Checkout Fehler. Bitte erneut versuchen.');
      }
    } catch {
      setError('Verbindungsfehler.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* HEADER */}
      <header style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo size={40} />
        <CartCount />
      </header>

      {/* LAYOUT: Mobile einspaltig, Desktop zweispaltig */}
      <div className="product-grid" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>

        {/* DESIGN-EDITOR */}
        <div className="editor-col" style={{ position: 'sticky', top: '5rem', alignSelf: 'start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ background: '#e2001a', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '999px', letterSpacing: '0.05em' }}>NEU</span>
            <span style={{ color: '#888', fontSize: '0.8rem' }}>DIN A4 Hochformat · vorne & hinten · {PRINT_SPEC.widthMm}×{PRINT_SPEC.heightMm} mm</span>
          </div>
          <div style={{ borderRadius: '16px', overflow: 'visible', background: 'transparent' }}>
            <DesignStudio shirtColor={activeColor.hex} onDesignChange={setDesign} />
          </div>
        </div>

        {/* KAUFBEREICH */}
        <div>
          <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.22em', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>Premium T-Shirt</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{product.name}</h1>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff' }}>€{unitPrice.toFixed(2)}</p>

          {/* FARBE */}
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Farbe: {activeColor.label}</p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {COLORS.map((c) => (
                <button key={c.key} onClick={() => setColorKey(c.key)} title={c.label} style={{
                  width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
                  background: c.hex,
                  border: colorKey === c.key ? '3px solid #e2001a' : '2px solid rgba(255,255,255,0.2)',
                  boxShadow: colorKey === c.key ? '0 0 0 2px rgba(226,0,26,0.3)' : 'none',
                  transition: 'all 0.15s',
                }} />
              ))}
            </div>
          </div>

          {/* GRÖSSE */}
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Größe wählen</p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} style={{
                  padding: '0.5rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                  background: size === s ? '#e2001a' : '#121212',
                  color: size === s ? '#fff' : '#888',
                  border: size === s ? '1px solid #e2001a' : '1px solid rgba(255,255,255,0.10)',
                  transition: 'all 0.15s',
                }}>
                  {s}
                </button>
              ))}
            </div>
            <details style={{ marginTop: '0.7rem' }}>
              <summary style={{ cursor: 'pointer', color: '#888', fontSize: '0.8rem', userSelect: 'none' }}>
                📏 Größentabelle
              </summary>
              <div style={{ marginTop: '0.6rem', background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.9rem', fontSize: '0.8rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc' }}>
                  <thead><tr style={{ color: '#888', textAlign: 'left' }}>
                    <th style={{ padding: '0.3rem 0' }}>Größe</th><th>Brustweite*</th><th>Länge</th>
                  </tr></thead>
                  <tbody>
                    {[['S','50 cm','70 cm'],['M','53 cm','72 cm'],['L','56 cm','74 cm'],['XL','59 cm','76 cm'],['XXL','62 cm','78 cm']].map(([g,b,l]) => (
                      <tr key={g} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={{ padding: '0.35rem 0', fontWeight: 600, color: '#fff' }}>{g}</td><td>{b}</td><td>{l}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ color: '#666', fontSize: '0.7rem', marginTop: '0.6rem', lineHeight: 1.5 }}>
                  *Halbe Brustweite, 1 cm unter der Armöffnung gemessen. Herstellerangaben B&C, Toleranz bis 10 % möglich. Zwischen zwei Größen? Nimm die größere.
                </p>
              </div>
            </details>
          </div>

          {/* SCHNITT */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.4rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Schnitt</p>
            <p style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>Unisex</p>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}

          {/* BUTTONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button onClick={buyNow} disabled={loading} style={{
              background: '#e2001a', color: '#fff', padding: '1rem', borderRadius: '12px',
              fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none', letterSpacing: '0.05em', opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Weiterleitung...' : `JETZT KAUFEN — €${unitPrice.toFixed(2)}`}
            </button>
            <p style={{ color: '#666', fontSize: '0.72rem', textAlign: 'center', marginTop: '0.6rem', lineHeight: 1.5 }}>
              Individuell bedruckte Ware — kein Widerrufsrecht gem. § 312g Abs. 2 Nr. 1 BGB. Kostenloser Ersatz bei Mängeln.
            </p>
            <button onClick={addToCart} style={{
              background: '#121212', color: added ? '#4ade80' : '#fff', padding: '0.9rem', borderRadius: '12px',
              fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.10)', letterSpacing: '0.05em',
            }}>
              {added ? '✓ Im Warenkorb' : '+ In den Warenkorb'}
            </button>
          </div>

          {/* INFO */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
            {[
              ['🔒', 'Sichere Zahlung via Stripe'],
              ['📦', 'Print-on-Demand — Produktion nach Bestellung'],
              ['🚚', 'Versand wählbar (DHL/Hermes/DPD) — DE & RO'],
              ['↩️', 'Qualitätsgarantie'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem' }}>{icon}</span>
                <span style={{ color: '#666', fontSize: '0.78rem' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
