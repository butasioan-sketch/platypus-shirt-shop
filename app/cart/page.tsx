'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/app/components/Logo';
import CartCount from '@/app/components/CartCount';
import { SHIPPING_OPTIONS, COUNTRIES, DEFAULT_SHIPPING_ID, DEFAULT_COUNTRY, getShipping, type Country } from '@/lib/shipping';
import { BASE_PRICE } from '@/lib/pricing';

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  fit?: string;
  color?: string;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [shipId, setShipId] = useState<string>(DEFAULT_SHIPPING_ID);

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
  const shipping = items.length > 0 ? getShipping(shipId, country) : 0;
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
          shippingId: shipId,
          shipping,
          total,
          country,
          shippingMethod: SHIPPING_OPTIONS.find(o => o.id === shipId)?.carrier || 'DHL',
          items: items.map(i => ({ name: i.name, size: i.size, color: i.color, price: i.price, quantity: i.quantity, designId: (i as any).designId })),
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
        <CartCount />
      </header>

      <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 2rem 6rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Warenkorb</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Warenkorb ist leer</p>
            <Link href="/" style={{ color: '#fff', fontSize: '0.875rem' }}>← Zurück zum Shop</Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {items.map((item, i) => (
                <div key={i} style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{item.name}</p>
                    <p style={{ color: '#999', fontSize: '0.8rem' }}>Größe: {item.size}{item.color ? ' | Farbe: ' + item.color : ''} | {item.fit || 'Unisex'} | Menge: {item.quantity}</p>
                    <p style={{ color: '#666', fontSize: '0.72rem', marginTop: '0.2rem' }}>
                      {item.price > BASE_PRICE
                        ? <>Basis €{BASE_PRICE.toFixed(2)} + Druck €{(item.price - BASE_PRICE).toFixed(2)}</>
                        : <>Basis €{BASE_PRICE.toFixed(2)}</>} je Stück
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <p style={{ fontWeight: 700 }}>€{(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.25rem' }}>×</button>
                  </div>
                </div>
              ))}
            </div>

            {/* VERSAND-AUSWAHL */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Lieferland</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                {COUNTRIES.map((c) => (
                  <button key={c.code} onClick={() => setCountry(c.code)} style={{
                    padding: '0.55rem 1.1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                    background: country === c.code ? '#e2001a' : '#121212',
                    color: country === c.code ? '#fff' : '#888',
                    border: country === c.code ? '1px solid #e2001a' : '1px solid rgba(255,255,255,0.10)',
                  }}>{c.label}</button>
                ))}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Versanddienst</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {SHIPPING_OPTIONS.map((o) => (
                  <button key={o.id} onClick={() => setShipId(o.id)} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.8rem 1rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left',
                    background: shipId === o.id ? 'rgba(226,0,26,0.12)' : '#121212',
                    color: '#fff',
                    border: shipId === o.id ? '2px solid #e2001a' : '1px solid rgba(255,255,255,0.10)',
                  }}>
                    <span style={{ fontWeight: 700 }}>{o.carrier}<span style={{ color: '#888', fontWeight: 400, fontSize: '0.78rem', marginLeft: '0.5rem' }}>{o.eta[country]}</span></span>
                    <span style={{ fontWeight: 700 }}>€{o.price[country].toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
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
            <p style={{ color: '#666', fontSize: '0.72rem', textAlign: 'center', marginTop: '0.6rem', lineHeight: 1.5 }}>
              Individuell bedruckte Ware — kein Widerrufsrecht gem. § 312g Abs. 2 Nr. 1 BGB. Kostenloser Ersatz bei Mängeln.
            </p>

            <p style={{ textAlign: 'center', color: '#888', fontSize: '0.75rem', marginTop: '1rem' }}>
              🔒 Sichere Zahlung via Stripe
            </p>
          </>
        )}
      </div>
    </div>
  );
}
