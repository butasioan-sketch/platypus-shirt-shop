'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Logo from '@/app/components/Logo';

const DesignStudio = dynamic(() => import('@/app/components/DesignStudio'), { ssr: false });

const PRODUCTS: Record<string, { name: string; price: number; color: string; sizes: string[] }> = {
  '1': { name: 'Essential Weiß', price: 29.99, color: '#f5f5f5', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  '2': { name: 'Essential Schwarz', price: 29.99, color: '#111111', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
};

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const product = PRODUCTS[id] || PRODUCTS['1'];

  const [size, setSize] = useState('');
  const [fit, setFit] = useState('Regular');
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const [design, setDesign] = useState<{ front: string | null; back: string | null }>({ front: null, back: null });

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
    } catch {
      return null;
    }
  };

  const addToCart = () => {
    if (!size) { setError('Bitte Größe wählen'); return; }
    setError('');
    try {
      const cart = JSON.parse(localStorage.getItem('platypus_cart') || '[]');
      const existing = cart.findIndex((i: { id: string; size: string }) => i.id === id && i.size === size);
      if (existing >= 0) {
        cart[existing].quantity = (cart[existing].quantity || 1) + 1;
      } else {
        cart.push({ id, name: product.name, price: product.price, size, fit, quantity: 1 });
      }
      localStorage.setItem('platypus_cart', JSON.stringify(cart));
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
          shipping: 4.99,
          total: product.price + 4.99,
          items: [{ name: product.name, size, price: product.price, quantity: 1, designId }],
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
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</Link>
        <Link href="/cart" style={{ color: '#888', textDecoration: 'none', fontSize: '0.875rem' }}>Warenkorb</Link>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>

        {/* VIEWER */}
        <div style={{ background: product.color, borderRadius: '16px', overflow: 'hidden', height: '500px', position: 'sticky', top: '5rem' }}>
          <DesignStudio shirtColor={product.color} onDesignChange={setDesign} />
        </div>

        {/* KAUFBEREICH */}
        <div>
          <p style={{ color: '#555', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Premium T-Shirt</p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{product.name}</h1>
          <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>€{product.price}</p>

          {/* GRÖSSE */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Größe wählen</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} style={{
                  padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                  background: size === s ? '#fff' : '#111',
                  color: size === s ? '#000' : '#888',
                  border: size === s ? '1px solid #fff' : '1px solid #222',
                  transition: 'all 0.15s',
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* FIT */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Schnitt</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['Regular', 'Oversized'].map((f) => (
                <button key={f} onClick={() => setFit(f)} style={{
                  padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem',
                  background: fit === f ? '#fff' : '#111',
                  color: fit === f ? '#000' : '#888',
                  border: fit === f ? '1px solid #fff' : '1px solid #222',
                }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}

          {/* BUTTONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            <button onClick={buyNow} disabled={loading} style={{
              background: '#fff', color: '#000', padding: '1rem', borderRadius: '12px',
              fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none', letterSpacing: '0.05em', opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Weiterleitung...' : 'JETZT KAUFEN — €' + (product.price + 4.99).toFixed(2)}
            </button>
            <button onClick={addToCart} style={{
              background: '#111', color: added ? '#4ade80' : '#fff', padding: '1rem', borderRadius: '12px',
              fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
              border: '1px solid #333', letterSpacing: '0.05em',
            }}>
              {added ? '✓ Im Warenkorb' : '+ In den Warenkorb'}
            </button>
          </div>

          {/* INFO */}
          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1.5rem' }}>
            {[
              ['🔒', 'Sichere Zahlung via Stripe'],
              ['📦', 'Print-on-Demand — Produktion nach Bestellung'],
              ['🚚', 'Versand DE: 3–5 Werktage (+€4.99)'],
              ['↩️', '14 Tage Rückgabe'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem' }}>{icon}</span>
                <span style={{ color: '#666', fontSize: '0.8rem' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE STICKY CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1rem', background: '#0a0a0a', borderTop: '1px solid #1a1a1a', display: 'none' }}>
        <button onClick={buyNow} style={{ width: '100%', background: '#fff', color: '#000', padding: '1rem', borderRadius: '12px', fontWeight: 800, border: 'none', fontSize: '1rem' }}>
          KAUFEN — €{(product.price + 4.99).toFixed(2)}
        </button>
      </div>

    </div>
  );
}
