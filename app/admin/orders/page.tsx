'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import DesignPreview from '@/app/components/DesignPreview';
import Link from 'next/link';
import { Order } from '@/lib/types';
import { orderMissingDesign } from '@/lib/order-review';

const STATUS_FLOW: Order['status'][] = ['paid', 'production', 'shipped', 'delivered'];
const STATUS_COLORS: Record<string, string> = {
  paid: '#4ade80', on_hold: '#f97316', production: '#facc15', shipped: '#60a5fa', delivered: '#a78bfa', cancelled: '#f87171', pending: '#888',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter && filter !== 'problems'
        ? `/api/orders?status=${filter}`
        : '/api/orders';
      const data = await fetch(url).then(r => r.json());
      let list: Order[] = data.orders || [];
      if (filter === 'problems') {
        list = list.filter(orderMissingDesign);
      }
      setOrders(list);
    } catch { setOrders([]); }
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const problemCount = useMemo(() => orders.filter(orderMissingDesign).length, [orders]);

  const advance = async (order: Order) => {
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return;
    const next = STATUS_FLOW[idx + 1];
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: order.id, status: next }),
    });
    load();
  };

  const holdOrder = async (order: Order) => {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: order.id, status: 'on_hold' }),
    });
    load();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.06), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS <span style={{ color: '#e2001a', fontSize: '0.7rem' }}>ADMIN</span></Link>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/admin/analytics" style={{ background: '#1a1a1a', border: '1px solid #333', color: '#888', padding: '0.4rem 1rem', borderRadius: '999px', textDecoration: 'none', fontSize: '0.8rem' }}>Analytics</Link>
          <Link href="/admin" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none', alignSelf: 'center' }}>← Admin</Link>
        </div>
      </header>

      <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Bestellungen</h1>
          <span style={{ color: '#555', fontSize: '0.875rem' }}>{orders.length} angezeigt</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {[
            { key: '', label: 'Alle' },
            { key: 'problems', label: `⚠ Ohne Motiv${filter === 'problems' ? '' : ''}` },
            { key: 'on_hold', label: 'On Hold' },
            { key: 'paid', label: 'Bezahlt' },
            { key: 'production', label: 'Produktion' },
            { key: 'shipped', label: 'Versendet' },
            { key: 'delivered', label: 'Zugestellt' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              background: filter === key ? '#fff' : '#111',
              color: filter === key ? '#000' : '#888',
              border: key === 'problems' ? '1px solid #f97316' : '1px solid #222',
              padding: '0.4rem 1rem',
              borderRadius: '999px', cursor: 'pointer', fontSize: '0.8rem',
            }}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: '#555' }}>Laden...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#555', border: '1px solid #222', borderRadius: '12px' }}>
            <p style={{ fontSize: '1.25rem' }}>Keine Bestellungen</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => {
              const missing = orderMissingDesign(order);
              return (
              <div key={order.id} style={{
                background: '#121212',
                border: missing ? '1px solid rgba(249,115,22,0.55)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', padding: '1.5rem',
                boxShadow: missing ? '0 0 0 1px rgba(249,115,22,0.15)' : 'none',
              }}>
                {missing && (
                  <div style={{
                    background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.35)',
                    borderRadius: '8px', padding: '0.6rem 0.9rem', marginBottom: '1rem',
                    fontSize: '0.8rem', color: '#fdba74',
                  }}>
                    <strong>⚠ Kein Motiv hinterlegt</strong> — nicht druckbar. Kundenkontakt oder On Hold setzen.
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.id}</p>
                    <p style={{ color: '#888', fontSize: '0.8rem' }}>{order.customerEmail || '—'} · {order.shippingCountry}{order.shippingMethod ? ' · ' + order.shippingMethod : ''}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 800, fontSize: '1.25rem' }}>€{Number(order.amountTotal).toFixed(2)}</p>
                    <span style={{ background: '#1a1a1a', color: STATUS_COLORS[order.status] || '#888', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem' }}>
                      {order.status}
                    </span>
                  </div>
                </div>
                {order.items?.length > 0 && (
                  <div style={{ borderTop: '1px solid #222', paddingTop: '0.75rem', marginBottom: '0.75rem' }}>
                    {order.items.map((item, i) => (
                      <p key={i} style={{ color: '#aaa', fontSize: '0.8rem' }}>
                        {item.quantity}× {item.name} ({item.size}{item.color ? ', ' + item.color : ''})
                        {!item.designId && <span style={{ color: '#f97316' }}> · kein designId</span>}
                      </p>
                    ))}
                  </div>
                )}
                <a href={`/admin/print/${order.id}`} target="_blank" rel="noreferrer" style={{ background: '#1a1a1a', border: '1px solid #333', padding: '0.35rem 0.8rem', borderRadius: '8px', color: '#fff', fontSize: '0.75rem', textDecoration: 'none', marginRight: '0.4rem', display: 'inline-block' }}>Druckauftrag</a>
                {Array.from(new Set(
                  [...(order.items || []).map((it) => it.designId), order.designId]
                    .filter((d): d is string => Boolean(d))
                )).map((did) => (
                  <DesignPreview key={did} designId={did} />
                ))}
                {missing && order.status !== 'on_hold' && order.status !== 'cancelled' && (
                  <button onClick={() => holdOrder(order)} style={{
                    background: 'rgba(249,115,22,0.15)', border: '1px solid #f97316', color: '#fdba74',
                    padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.4rem',
                  }}>
                    → On Hold
                  </button>
                )}
                {STATUS_FLOW.indexOf(order.status) < STATUS_FLOW.length - 1 && STATUS_FLOW.includes(order.status) && !missing && (
                  <button onClick={() => advance(order)} style={{
                    background: '#1a1a1a', border: '1px solid #333', color: '#fff',
                    padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem',
                  }}>
                    → {STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]}
                  </button>
                )}
              </div>
            );})}
          </div>
        )}

        {filter !== 'problems' && problemCount > 0 && (
          <p style={{ color: '#f97316', fontSize: '0.8rem', marginTop: '1.5rem' }}>
            {problemCount} Bestellung(en) in dieser Ansicht ohne Motiv — Filter „Ohne Motiv“ nutzen.
          </p>
        )}
      </div>
    </div>
  );
}