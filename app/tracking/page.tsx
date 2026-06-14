'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/app/components/Logo';

interface OrderItem { name: string; size: string; quantity: number; price: number; }
interface Order {
  id: string; status: string; amountTotal: number;
  items: OrderItem[]; createdAt: string; shippingCountry: string;
}

const STEPS = [
  { key: 'paid', label: 'Bezahlt' },
  { key: 'production', label: 'In Produktion' },
  { key: 'shipped', label: 'Versandt' },
  { key: 'delivered', label: 'Zugestellt' },
];

export default function TrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    const id = orderId.trim();
    if (!id) return;
    setLoading(true); setError(''); setOrder(null);
    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(id)}`);
      if (!res.ok) { setError('Keine Bestellung mit dieser Nummer gefunden.'); setLoading(false); return; }
      const data = await res.json();
      if (data.order) setOrder(data.order);
      else setError('Keine Bestellung mit dieser Nummer gefunden.');
    } catch {
      setError('Verbindungsfehler. Bitte erneut versuchen.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? STEPS.findIndex(s => s.key === order.status) : -1;
  const isCancelled = order?.status === 'cancelled';

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.08), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo size={44} />
        <Link href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.875rem' }}>← Shop</Link>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem' }}>
        <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.22em', marginBottom: '0.6rem', textTransform: 'uppercase', fontWeight: 600 }}>Sendungsverfolgung</p>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', color: '#fff', letterSpacing: '-0.02em' }}>Bestellung verfolgen</h1>
        <p style={{ color: '#999', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          Gib deine Bestellnummer ein (z.B. PLT-1781...). Du findest sie in deiner Bestätigungs-E-Mail.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <input
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="PLT-..."
            style={{ flex: 1, background: '#121212', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '10px', padding: '0.85rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
          />
          <button onClick={search} disabled={loading} style={{ background: '#e2001a', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.85rem 1.5rem', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? '...' : 'Suchen'}
          </button>
        </div>

        {error && (
          <div style={{ background: '#121212', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '12px', padding: '1.25rem', color: '#f87171', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {order && (
          <div style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ color: '#666', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Bestellnummer</p>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{order.id}</p>
              </div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem' }}>€{order.amountTotal.toFixed(2)}</p>
            </div>

            {isCancelled ? (
              <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '10px', padding: '1rem', color: '#f87171', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Diese Bestellung wurde storniert.
              </div>
            ) : (
              <div style={{ marginBottom: '1.75rem' }}>
                {STEPS.map((step, i) => {
                  const done = i <= currentStep;
                  const active = i === currentStep;
                  return (
                    <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: i < STEPS.length - 1 ? '0.25rem' : 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: done ? '#e2001a' : '#1c1c1c', border: done ? 'none' : '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff', flexShrink: 0 }}>
                          {done ? '✓' : ''}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div style={{ width: '2px', height: '22px', background: i < currentStep ? '#e2001a' : 'rgba(255,255,255,0.1)' }} />
                        )}
                      </div>
                      <span style={{ fontSize: '0.9rem', color: active ? '#fff' : done ? '#bbb' : '#666', fontWeight: active ? 700 : 500, paddingBottom: i < STEPS.length - 1 ? '1.2rem' : 0 }}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
              <p style={{ color: '#666', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Artikel</p>
              {order.items.map((it, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
                  <span style={{ color: '#ccc' }}>{it.quantity}× {it.name} ({it.size})</span>
                  <span style={{ color: '#fff' }}>€{(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
