'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/app/components/LocaleProvider';
import { calcMerchandiseTotal, isBundleEligible, type MerchandiseItem } from '@/lib/pricing';

export default function CartCount() {
  const { t } = useLocale();
  const pathname = usePathname();
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const showPrice = pathname?.startsWith('/product/') || pathname === '/cart';

  const update = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('platypus_cart') || '[]');
      const c = cart.reduce((s: number, i: { quantity?: number }) => s + (i.quantity || 1), 0);
      const merchItems: MerchandiseItem[] = cart.map((i: { id?: string; pages?: number; quantity?: number }) => ({
        productId: i.id || '1', pages: i.pages || 1, qty: i.quantity || 1,
      }));
      const t = calcMerchandiseTotal(merchItems, isBundleEligible(merchItems));
      setCount(c);
      setTotal(t);
    } catch { setCount(0); setTotal(0); }
  };

  useEffect(() => {
    update();
    window.addEventListener('storage', update);
    window.addEventListener('focus', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('focus', update);
    };
  }, []);

  return (
    <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', color: '#fff', padding: '0.5rem 0.9rem', borderRadius: '999px', background: count > 0 ? '#e2001a' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 600, fontSize: '0.85rem' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      {count > 0 ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ background: '#fff', color: '#e2001a', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800, padding: '0.05rem 0.45rem' }}>{count}</span>
          {showPrice && <span className="cart-label-text">€{total.toFixed(2)}</span>}
        </span>
      ) : (
        <span className="cart-label-text" style={{ color: '#888' }}>{t.nav.cart}</span>
      )}
    </Link>
  );
}