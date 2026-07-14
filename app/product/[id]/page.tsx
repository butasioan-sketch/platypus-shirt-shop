'use client';

import { getShipping, DEFAULT_SHIPPING_ID, DEFAULT_COUNTRY } from '@/lib/shipping';
import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import SiteHeader from '@/app/components/SiteHeader';
import TrustIcon from '@/app/components/TrustIcon';
import { useLocale } from '@/app/components/LocaleProvider';
import { formatSizeMm } from '@/lib/print-spec';
import { getProduct, getProductName, getProductDescription, SHIRT_COLORS } from '@/lib/products';

const DesignStudio = dynamic(() => import('@/app/components/DesignStudio'), { ssr: false });
import type { DesignState } from '@/app/components/DesignStudio';
import { calcUnitPrice } from '@/lib/pricing';
import { renderPrintSheet } from '@/lib/print-export';
import { trackAddToCart, trackViewProduct } from '@/lib/analytics';

export default function ProductPage() {
  const { t, locale } = useLocale();
  const params = useParams();
  const id = params?.id as string;
  const product = getProduct(id);

  const [size, setSize] = useState('');
  const [colorKey, setColorKey] = useState('weiss');
  const activeColor = SHIRT_COLORS.find(c => c.key === colorKey) || SHIRT_COLORS[0];
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const [design, setDesign] = useState<DesignState>({
    front: null,
    back: null,
    frontTransform: { scale: 1, x: 0, y: 0 },
    backTransform: { scale: 1, x: 0, y: 0 },
  });
  const [editHint, setEditHint] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preSize = params.get('size');
    const preColor = params.get('color');
    if (preSize) setSize(preSize);
    if (preColor) setColorKey(preColor);
    if (params.has('edit')) setEditHint(true);
  }, []);

  useEffect(() => {
    if (product) trackViewProduct({ id, name: product.name?.de ?? id, price: 39.99 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!product) notFound();

  const unitPrice = calcUnitPrice(design?.front, design?.back);
  const productName = getProductName(product, locale);
  const colorLabel = activeColor.label[locale] || activeColor.label.de;

  const saveDesign = async (): Promise<string | null> => {
    if (!design.front && !design.back) return null;
    try {
      const [front, back] = await Promise.all([
        design.front ? renderPrintSheet(design.front, design.frontTransform, { format: 'jpeg', quality: 0.92 }) : Promise.resolve(null),
        design.back ? renderPrintSheet(design.back, design.backTransform, { format: 'jpeg', quality: 0.92 }) : Promise.resolve(null),
      ]);
      const payload = JSON.stringify({ front, back, productId: id });
      console.log('[saveDesign] payload', (payload.length / 1024 / 1024).toFixed(2), 'MB');
      const res = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => `HTTP ${res.status}`);
        throw new Error(`/api/designs ${res.status}: ${errText}`);
      }
      const data = await res.json();
      if (!data.id) throw new Error('Kein Design-ID erhalten');
      return data.id;
    } catch (err) {
      console.error('[saveDesign]', err);
      return null;
    }
  };

  const addToCart = async () => {
    if (!size) { setError(t.product.selectSize); return; }
    if (!design.front && !design.back) { setError(t.shop.needDesign); return; }
    setError('');
    setAddLoading(true);
    try {
      const designId = await saveDesign();
      if (!designId) { setError(t.errors.saveDesign); return; }
      const pages = (design.front ? 1 : 0) + (design.back ? 1 : 0);
      const cart = JSON.parse(localStorage.getItem('platypus_cart') || '[]');
      cart.push({
        id, name: productName, price: unitPrice, size,
        fit: t.product.unisex, color: colorLabel, quantity: 1, designId, pages,
      });
      localStorage.setItem('platypus_cart', JSON.stringify(cart));
      trackAddToCart({ id, name: productName, price: unitPrice, size, color: colorLabel, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch { setError(t.errors.addCart); }
    finally { setAddLoading(false); }
  };

  const buyNow = async () => {
    if (!size) { setError(t.product.selectSize); return; }
    if (!design.front && !design.back) { setError(t.shop.needDesign); return; }
    setError('');
    setLoading(true);
    try {
      const designId = await saveDesign();
      if (!designId) { setError(t.errors.saveDesign); return; }
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
          items: [{ name: productName, size, color: colorLabel, price: unitPrice, quantity: 1, designId }],
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
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
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.08), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <SiteHeader />

      <div className="product-grid" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        <div className="editor-col" style={{ position: 'sticky', top: '5rem', alignSelf: 'start' }}>
          <p className="plt-label" style={{ marginBottom: '0.75rem', color: '#aaa' }}>
            {t.shop.printZone.replace('{size}', formatSizeMm())}
          </p>
          <DesignStudio shirtColor={activeColor.hex} onDesignChange={setDesign} />
        </div>

        <div>
          <p className="plt-label" style={{ color: '#e2001a', marginBottom: '0.5rem' }}>{t.shop.premium}</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{productName}</h1>
          <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.55, marginBottom: '1rem' }}>{getProductDescription(product, locale)}</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff' }}>€{unitPrice.toFixed(2)}</p>

          <div style={{ marginBottom: '1.25rem' }}>
            <p className="plt-label" style={{ marginBottom: '0.6rem' }}>{t.product.color}: {colorLabel}</p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {SHIRT_COLORS.map((c) => (
                <button key={c.key} onClick={() => setColorKey(c.key)} title={c.label[locale] || c.label.de} style={{
                  width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
                  background: c.hex,
                  border: colorKey === c.key ? '3px solid #e2001a' : '2px solid rgba(255,255,255,0.2)',
                  boxShadow: colorKey === c.key ? '0 0 0 2px rgba(226,0,26,0.3)' : 'none',
                  transition: 'all 0.15s',
                }} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <p className="plt-label" style={{ marginBottom: '0.6rem' }}>{t.product.size}</p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {product.sizes.map((s) => (
                <button key={s} type="button" onClick={() => setSize(s)} className={`plt-size-btn${size === s ? ' plt-size-btn-active' : ''}`}>
                  {s}
                </button>
              ))}
            </div>
            <details style={{ marginTop: '0.7rem' }}>
              <summary style={{ cursor: 'pointer', color: '#888', fontSize: '0.8rem', userSelect: 'none' }}>
                📏 {t.product.sizeChart}
              </summary>
              <div style={{ marginTop: '0.6rem', background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.9rem', fontSize: '0.8rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc' }}>
                  <thead><tr style={{ color: '#888', textAlign: 'left' }}>
                    <th style={{ padding: '0.3rem 0' }}>{t.product.sizeCol}</th><th>{t.product.chestCol}</th><th>{t.product.lengthCol}</th>
                  </tr></thead>
                  <tbody>
                    {[['S','50 cm','70 cm'],['M','53 cm','72 cm'],['L','56 cm','74 cm'],['XL','59 cm','76 cm'],['XXL','62 cm','78 cm']].map(([g,b,l]) => (
                      <tr key={g} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={{ padding: '0.35rem 0', fontWeight: 600, color: '#fff' }}>{g}</td><td>{b}</td><td>{l}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ color: '#666', fontSize: '0.7rem', marginTop: '0.6rem', lineHeight: 1.5 }}>{t.product.sizeNote}</p>
              </div>
            </details>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <p className="plt-label" style={{ marginBottom: '0.4rem' }}>{t.product.fit}</p>
            <p style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>{t.product.unisex}</p>
          </div>

          {editHint && (
            <div className="plt-fade-in-up" style={{ background: 'rgba(226,0,26,0.08)', border: '1px solid rgba(226,0,26,0.25)', borderRadius: '10px', padding: '0.7rem 1rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#fca5a5', lineHeight: 1.5 }}>
              Größe & Farbe vorausgewählt. Lade dein Motiv erneut hoch um das Piece zu aktualisieren.
            </div>
          )}

          {/* Design-Status Indikator */}
          <div className="plt-design-status" style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.65rem 0.9rem', borderRadius: '10px', marginBottom: '1rem',
            background: (design.front || design.back) ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${(design.front || design.back) ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.08)'}`,
            fontSize: '0.78rem', fontWeight: 600,
            color: (design.front || design.back) ? '#4ade80' : '#666',
          }}>
            <span style={{ fontSize: '1rem' }}>{(design.front || design.back) ? '✓' : '←'}</span>
            <span>
              {design.front && design.back
                ? `${t.studio.front} & ${t.studio.back} — ${t.studio.twoSides}`
                : design.front
                  ? `${t.studio.front} — ${t.studio.oneSide}`
                  : design.back
                    ? `${t.studio.back} — ${t.studio.oneSide}`
                    : t.shop.uploadFront}
            </span>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button type="button" onClick={buyNow} disabled={loading} className="plt-btn-primary" style={{ width: '100%', fontSize: '1rem', padding: '1rem' }}>
              {loading ? t.cart.redirecting : `${t.product.buyNow} — €${unitPrice.toFixed(2)}`}
            </button>
            <p style={{ color: '#666', fontSize: '0.72rem', textAlign: 'center', marginTop: '0.6rem', lineHeight: 1.5 }}>{t.shop.legal}</p>
            <button type="button" onClick={addToCart} disabled={addLoading} className={`plt-btn-secondary${added ? ' plt-btn-cart-added' : ''}`} style={{ width: '100%', padding: '0.9rem', color: added ? '#4ade80' : '#fff' }}>
              {addLoading ? '...' : added ? `✓ ${t.product.added}` : `+ ${t.product.addCart}`}
            </button>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
            {t.trust.map(({ key, label, sub }) => (
              <div key={key} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', alignItems: 'center' }}>
                <TrustIcon name={key} size={20} />
                <span style={{ color: '#666', fontSize: '0.78rem' }}>{label} — {sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Buy Bar */}
      <div className="mobile-sticky-cta" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(10,10,10,0.96)', backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '0.85rem 1.25rem',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
      }}>
        <div>
          <p style={{ fontSize: '0.7rem', color: '#666', margin: 0 }}>{productName}</p>
          <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>€{unitPrice.toFixed(2)}</p>
        </div>
        <button type="button" onClick={buyNow} disabled={loading} className="plt-btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', flexShrink: 0 }}>
          {loading ? t.cart.redirecting : t.product.buyNow}
        </button>
      </div>
    </div>
  );
}