'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/app/components/Logo';

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  fit?: string;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('platypus_cart') || '[]');
      setItems(cart);
    } catch { setItems([]); }
  }, []);

  const remove = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    localStorage.setItem('platypus_cart', JSON.stringify(updated));
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = items.length > 0 ? 4.99 : 0;
  const total = subtotal + shipping;

  const checkout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'card',
          reference: `CART-${Date.now()}`,
          shipping,
          total,
          items: items.map(i => ({ name: i.name, size: i.size, price: i.price, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        localStorage.removeItem('platypus_cart');
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
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.08), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo size={44} />
        <span style={{ color: '#555', fontSize: '0.875rem' }}>Warenkorb</span>
      </header>

      <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Warenkorb</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#555' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Warenkorb ist leer</p>
            <Link href="/" style={{ color: '#fff', fontSize: '0.875rem' }}>← Zurück zum Shop</Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {items.map((item, i) => (
                <div key={i} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{item.name}</p>
                    <p style={{ color: '#999', fontSize: '0.8rem' }}>Größe: {item.size} | {item.fit || 'Regular'} | Menge: {item.quantity}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <p style={{ fontWeight: 700 }}>€{(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1.25rem' }}>×</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#888' }}>
                <span>Zwischensumme</span><span>€{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#888' }}>
                <span>Versand</span><span>€{shipping.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem' }}>
                <span>Gesamt</span><span>€{total.toFixed(2)}</span>
              </div>
            </div>

            {error && <p style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}

            <button onClick={checkout} disabled={loading} style={{
              width: '100%', background: '#e2001a', color: '#fff', padding: '1.1rem',
              borderRadius: '12px', fontWeight: 800, fontSize: '1rem',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, letterSpacing: '0.05em',
            }}>
              {loading ? 'Weiterleitung zu Stripe...' : `JETZT BEZAHLEN — €${total.toFixed(2)}`}
            </button>

            <p style={{ textAlign: 'center', color: '#555', fontSize: '0.75rem', marginTop: '1rem' }}>
              🔒 Sichere Zahlung via Stripe
            </p>
          </>
        )}
      </div>
    </div>
  );
}
