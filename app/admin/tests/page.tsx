'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TestResult {
  name: string;
  status: 'idle' | 'running' | 'ok' | 'fail';
  detail: string;
}

const INITIAL: TestResult[] = [
  { name: 'Homepage erreichbar', status: 'idle', detail: '' },
  { name: 'Produkt 1 erreichbar', status: 'idle', detail: '' },
  { name: 'Warenkorb erreichbar', status: 'idle', detail: '' },
  { name: 'Stripe API erreichbar', status: 'idle', detail: '' },
  { name: 'Stripe Checkout erstellen', status: 'idle', detail: '' },
  { name: 'Admin erreichbar', status: 'idle', detail: '' },
  { name: 'Admin Orders erreichbar', status: 'idle', detail: '' },
  { name: 'Impressum erreichbar', status: 'idle', detail: '' },
  { name: 'Datenschutz erreichbar', status: 'idle', detail: '' },
];

export default function AdminTestsPage() {
  const [tests, setTests] = useState<TestResult[]>(INITIAL);
  const [running, setRunning] = useState(false);

  const update = (i: number, patch: Partial<TestResult>) =>
    setTests(prev => prev.map((t, idx) => idx === i ? { ...t, ...patch } : t));

  const runAll = async () => {
    setRunning(true);
    setTests(INITIAL.map(t => ({ ...t, status: 'idle' })));

    const checks = [
      async (i: number) => {
        update(i, { status: 'running' });
        const r = await fetch('/');
        update(i, { status: r.ok ? 'ok' : 'fail', detail: `HTTP ${r.status}` });
      },
      async (i: number) => {
        update(i, { status: 'running' });
        const r = await fetch('/product/1');
        update(i, { status: r.ok ? 'ok' : 'fail', detail: `HTTP ${r.status}` });
      },
      async (i: number) => {
        update(i, { status: 'running' });
        const r = await fetch('/cart');
        update(i, { status: r.ok ? 'ok' : 'fail', detail: `HTTP ${r.status}` });
      },
      async (i: number) => {
        update(i, { status: 'running' });
        const r = await fetch('/api/payments/create-checkout');
        const d = await r.json();
        update(i, { status: r.ok ? 'ok' : 'fail', detail: d.stripeKeyConfigured ? 'Key konfiguriert' : 'Demo Modus' });
      },
      async (i: number) => {
        update(i, { status: 'running' });
        const r = await fetch('/api/payments/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethod: 'card',
            reference: 'ADMIN-TEST',
            shipping: 4.99,
            total: 34.98,
            items: [{ name: 'Test Shirt', size: 'M', price: 29.99, quantity: 1 }],
          }),
        });
        const d = await r.json();
        const ok = d.status === 'stripe_checkout_created';
        update(i, { status: ok ? 'ok' : 'fail', detail: d.status || d.error || '' });
      },
      async (i: number) => {
        update(i, { status: 'running' });
        const r = await fetch('/admin');
        update(i, { status: r.status === 200 || r.status === 401 ? 'ok' : 'fail', detail: `HTTP ${r.status}` });
      },
      async (i: number) => {
        update(i, { status: 'running' });
        const r = await fetch('/admin/orders');
        update(i, { status: r.status === 200 || r.status === 401 ? 'ok' : 'fail', detail: `HTTP ${r.status}` });
      },
      async (i: number) => {
        update(i, { status: 'running' });
        const r = await fetch('/impressum');
        update(i, { status: r.ok ? 'ok' : 'fail', detail: `HTTP ${r.status}` });
      },
      async (i: number) => {
        update(i, { status: 'running' });
        const r = await fetch('/datenschutz');
        update(i, { status: r.ok ? 'ok' : 'fail', detail: `HTTP ${r.status}` });
      },
    ];

    for (let i = 0; i < checks.length; i++) {
      try { await checks[i](i); } catch (e) {
        update(i, { status: 'fail', detail: e instanceof Error ? e.message : 'Fehler' });
      }
    }

    setRunning(false);
  };

  const statusColor = (s: TestResult['status']) =>
    ({ idle: '#333', running: '#facc15', ok: '#4ade80', fail: '#f87171' })[s];

  const statusIcon = (s: TestResult['status']) =>
    ({ idle: '○', running: '⟳', ok: '✓', fail: '✕' })[s];

  const passed = tests.filter(t => t.status === 'ok').length;
  const failed = tests.filter(t => t.status === 'fail').length;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</Link>
        <Link href="/admin" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none' }}>← Admin</Link>
      </header>

      <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>System Tests</h1>
            {tests.some(t => t.status !== 'idle') && (
              <p style={{ color: '#555', fontSize: '0.875rem' }}>
                {passed} bestanden · {failed} fehlgeschlagen
              </p>
            )}
          </div>
          <button onClick={runAll} disabled={running} style={{
            background: running ? '#1a1a1a' : '#fff',
            color: running ? '#555' : '#000',
            border: 'none', padding: '0.75rem 1.5rem',
            borderRadius: '999px', fontWeight: 700,
            fontSize: '0.875rem', cursor: running ? 'not-allowed' : 'pointer',
          }}>
            {running ? 'Läuft...' : 'Alle testen'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tests.map((test, i) => (
            <div key={i} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: statusColor(test.status), fontSize: '1rem', minWidth: '16px' }}>
                  {statusIcon(test.status)}
                </span>
                <span style={{ fontSize: '0.875rem' }}>{test.name}</span>
              </div>
              {test.detail && (
                <span style={{ color: '#555', fontSize: '0.75rem', fontFamily: 'monospace' }}>{test.detail}</span>
              )}
            </div>
          ))}
        </div>

        {failed > 0 && (
          <div style={{ marginTop: '2rem', background: '#1a0000', border: '1px solid #3a0000', borderRadius: '12px', padding: '1.25rem' }}>
            <p style={{ color: '#f87171', fontWeight: 700, marginBottom: '0.5rem' }}>
              {failed} Test{failed > 1 ? 's' : ''} fehlgeschlagen
            </p>
            <p style={{ color: '#888', fontSize: '0.8rem' }}>
              Stripe Fehler → STRIPE_SECRET_KEY in Vercel setzen<br/>
              404 Fehler → Build neu deployen
            </p>
          </div>
        )}

        {passed === tests.length && tests.every(t => t.status === 'ok') && (
          <div style={{ marginTop: '2rem', background: '#001a00', border: '1px solid #003a00', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '1.125rem' }}>
              ✓ Alle Tests bestanden — Shop ist ready
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
