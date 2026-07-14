'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import { useLocale } from '@/app/components/LocaleProvider';
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
  designId?: string;
}

function DesignThumb({ designId }: { designId?: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!designId) return;
    fetch(`/api/designs?id=${designId}`)
      .then(r => r.json())
      .then(data => { if (data.design?.front_image) setSrc(data.design.front_image); })
      .catch(() => {});
  }, [designId]);

  const baseStyle: React.CSSProperties = {
    width: 48, height: 64, borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.10)',
    flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  if (!designId) return (
    <div style={{ ...baseStyle, background: '#1a1a1a', color: '#444', fontSize: '1.1rem' }}>🎨</div>
  );
  if (!src) return (
    <div style={{ ...baseStyle, background: '#1a1a1a' }} />
  );
  return (
    <img src={src} alt="Design-Vorschau" style={{ ...baseStyle, objectFit: 'cover', background: '#1a1a1a' }} />
  );
}

export default function CartPage() {
  const { t } = useLocale();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [shipId, setShipId] = useState<string>(DEFAULT_SHIPPING_ID);

  useEffect(() => {
    try {
      const raw: CartItem[] = JSON.parse(localStorage.getItem('platypus_cart') || '[]');
      const valid = raw.filter(i => i.designId);
      const removed = raw.length - valid.length;
      if (removed > 0) {
        localStorage.setItem('platypus_cart', JSON.stringify(valid));
        setError(t.cart.purgedNotice(removed));
        setTimeout(() => setError(''), 6000);
      }
      setItems(valid);
    } catch { setItems([]); }
  }, [t.cart]);

  const remove = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    localStorage.setItem('platypus_cart', JSON.stringify(updated));
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = items.length > 0 ? getShipping(shipId, country) : 0;
  const total = subtotal + shipping;
  const missingDesign = items.some((i) => !i.designId);

  const checkout = async () => {
    if (items.length === 0 || missingDesign) return;
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
          items: items.map(i => ({ name: i.name, size: i.size, color: i.color, price: i.price, quantity: i.quantity, designId: i.designId })),
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        localStorage.removeItem('platypus_cart');
        window.location.href = data.redirectUrl;
      } else {
        setError(t.errors.checkout);
      }
    } catch {
      setError(t.errors.connection);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.08), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <SiteHeader />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 2rem 6rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>{t.cart.title}</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t.cart.empty}</p>
            <Link href="/product/1" style={{ color: '#fff', fontSize: '0.875rem' }}>{t.cart.back}</Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {items.map((item, i) => (
                <div key={i} className="plt-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <DesignThumb designId={item.designId} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{item.name}</p>
                      <p style={{ color: '#999', fontSize: '0.8rem' }}>{t.product.size}: {item.size}{item.color ? ' | ' + t.product.color + ': ' + item.color : ''} | {item.fit || t.product.unisex} | {t.cart.qty}: {item.quantity}</p>
                      <p style={{ color: '#666', fontSize: '0.72rem', marginTop: '0.2rem' }}>
                        {item.price > BASE_PRICE
                          ? <>Basis €{BASE_PRICE.toFixed(2)} + Druck €{(item.price - BASE_PRICE).toFixed(2)}</>
                          : <>Basis €{BASE_PRICE.toFixed(2)}</>} je Stück
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
                      <p style={{ fontWeight: 700 }}>€{(item.price * item.quantity).toFixed(2)}</p>
                      <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.25rem' }}>×</button>
                    </div>
                  </div>
                  {!item.designId && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.78rem', color: '#fca5a5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span>{t.cart.noDesignItem}</span>
                      <a href={`/product/${item.id}`} style={{ color: '#e2001a', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>{t.cart.addDesignLink}</a>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* VERSAND-AUSWAHL */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.cart.deliveryCountry}</p>
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
              <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.cart.shippingService}</p>
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
                <span>{t.cart.subtotal}</span><span>€{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#888' }}>
                <span>{t.cart.shipping}</span><span>€{shipping.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem' }}>
                <span>{t.cart.total}</span><span>€{total.toFixed(2)}</span>
              </div>
              <p style={{ color: '#555', fontSize: '0.7rem', marginTop: '0.5rem', lineHeight: 1.4 }}>
                {t.cart.vatNote}
              </p>
            </div>

            {missingDesign && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#fca5a5' }}>
                {t.cart.needDesign}
              </div>
            )}
            {error && <p style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}

            <button type="button" onClick={checkout} disabled={loading || missingDesign} className="plt-btn-primary" style={{ width: '100%', padding: '1.1rem', fontSize: '1rem', opacity: missingDesign ? 0.4 : 1, cursor: missingDesign ? 'not-allowed' : 'pointer' }}>
              {loading ? t.cart.redirecting : `${t.cart.checkout} — €${total.toFixed(2)}`}
            </button>
            <p style={{ color: '#666', fontSize: '0.72rem', textAlign: 'center', marginTop: '0.6rem', lineHeight: 1.5 }}>
              {t.shop.legal}
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
