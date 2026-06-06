#!/bin/bash
set -euo pipefail

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'
ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
info() { echo -e "${CYAN}[->]${NC} $1"; }
warn() { echo -e "${YELLOW}[!!]${NC} $1"; }

# ============================================================
# 1. DATENBANK ABSTRAKTION (funktioniert mit & ohne DB)
# ============================================================
info "Datenbank Layer wird erstellt..."

mkdir -p lib

cat > lib/db.ts << 'EOF'
// Datenbank Abstraktion: nutzt Postgres wenn DATABASE_URL gesetzt,
// sonst In-Memory Fallback. So läuft alles auch ohne DB-Setup.

import { Order } from './types';

let memoryStore: Order[] = [];
let pgClient: unknown = null;

async function getPg() {
  if (pgClient) return pgClient;
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;

  try {
    const { neon } = await import('@neondatabase/serverless');
    pgClient = neon(url);
    return pgClient;
  } catch {
    return null;
  }
}

export async function initDb() {
  const sql = await getPg() as ((q: string) => Promise<unknown>) | null;
  if (!sql) return false;

  try {
    await sql(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        stripe_session_id TEXT UNIQUE,
        customer_email TEXT,
        amount_total NUMERIC,
        currency TEXT DEFAULT 'EUR',
        status TEXT DEFAULT 'paid',
        items JSONB DEFAULT '[]',
        locale TEXT DEFAULT 'de',
        shipping_country TEXT DEFAULT 'DE',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    return true;
  } catch (err) {
    console.error('DB init error:', err);
    return false;
  }
}

export async function createOrder(order: Order): Promise<Order> {
  const sql = await getPg() as ((q: string, p: unknown[]) => Promise<unknown[]>) | null;

  if (!sql) {
    memoryStore.unshift(order);
    return order;
  }

  try {
    await sql(
      `INSERT INTO orders (id, stripe_session_id, customer_email, amount_total, currency, status, items, locale, shipping_country)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (stripe_session_id) DO NOTHING`,
      [order.id, order.stripeSessionId, order.customerEmail, order.amountTotal, order.currency, order.status, JSON.stringify(order.items), order.locale, order.shippingCountry]
    );
  } catch (err) {
    console.error('createOrder error:', err);
    memoryStore.unshift(order);
  }
  return order;
}

export async function getOrders(status?: string, limit = 50): Promise<Order[]> {
  const sql = await getPg() as ((q: string, p?: unknown[]) => Promise<Record<string, unknown>[]>) | null;

  if (!sql) {
    let orders = memoryStore;
    if (status) orders = orders.filter(o => o.status === status);
    return orders.slice(0, limit);
  }

  try {
    const rows = status
      ? await sql(`SELECT * FROM orders WHERE status=$1 ORDER BY created_at DESC LIMIT $2`, [status, limit])
      : await sql(`SELECT * FROM orders ORDER BY created_at DESC LIMIT $1`, [limit]);

    return rows.map(mapRow);
  } catch (err) {
    console.error('getOrders error:', err);
    return memoryStore.slice(0, limit);
  }
}

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  const sql = await getPg() as ((q: string, p: unknown[]) => Promise<unknown>) | null;

  if (!sql) {
    const order = memoryStore.find(o => o.id === id);
    if (order) { order.status = status as Order['status']; return true; }
    return false;
  }

  try {
    await sql(`UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2`, [status, id]);
    return true;
  } catch {
    return false;
  }
}

export async function getOrderStats() {
  const orders = await getOrders(undefined, 1000);
  const now = Date.now();

  return {
    total: orders.length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.amountTotal), 0),
    last24h: orders.filter(o => now - new Date(o.createdAt).getTime() < 86400000).length,
    byStatus: {
      paid: orders.filter(o => o.status === 'paid').length,
      production: orders.filter(o => o.status === 'production').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    },
    byCountry: orders.reduce((acc, o) => {
      acc[o.shippingCountry] = (acc[o.shippingCountry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}

function mapRow(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    stripeSessionId: row.stripe_session_id as string,
    customerEmail: row.customer_email as string,
    amountTotal: Number(row.amount_total),
    currency: row.currency as string,
    status: row.status as Order['status'],
    items: (typeof row.items === 'string' ? JSON.parse(row.items) : row.items) as Order['items'],
    locale: row.locale as string,
    shippingCountry: row.shipping_country as string,
    createdAt: new Date(row.created_at as string).toISOString(),
    updatedAt: new Date(row.updated_at as string).toISOString(),
  };
}
EOF
ok "Datenbank Layer fertig (Postgres + Fallback)"

# ============================================================
# 2. GEMEINSAME TYPES
# ============================================================
cat > lib/types.ts << 'EOF'
export interface OrderItem {
  name: string;
  size: string;
  fit?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  stripeSessionId?: string;
  customerEmail?: string;
  amountTotal: number;
  currency: string;
  status: 'pending' | 'paid' | 'production' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  locale: string;
  shippingCountry: string;
  createdAt: string;
  updatedAt: string;
}
EOF
ok "Types fertig"

# ============================================================
# 3. ORDER API AUF DB UMSTELLEN
# ============================================================
info "Order API nutzt jetzt DB Layer..."

mkdir -p app/api/orders

cat > app/api/orders/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders, updateOrderStatus, getOrderStats, initDb } from '@/lib/db';
import { Order } from '@/lib/types';

let initialized = false;
async function ensureInit() {
  if (!initialized) { await initDb(); initialized = true; }
}

export async function GET(request: NextRequest) {
  await ensureInit();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const stats = searchParams.get('stats');

  if (stats === 'true') {
    return NextResponse.json(await getOrderStats());
  }

  const orders = await getOrders(status, parseInt(searchParams.get('limit') || '50'));
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  await ensureInit();
  try {
    const body = await request.json();
    const order: Order = {
      id: `PLT-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      stripeSessionId: body.stripeSessionId,
      customerEmail: body.customerEmail,
      amountTotal: body.amountTotal || 0,
      currency: body.currency || 'EUR',
      status: body.status || 'paid',
      items: body.items || [],
      locale: body.locale || 'de',
      shippingCountry: body.shippingCountry || 'DE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await createOrder(order);
    return NextResponse.json({ order, success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Fehler' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  await ensureInit();
  try {
    const { id, status } = await request.json();
    const success = await updateOrderStatus(id, status);
    return NextResponse.json({ success });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Fehler' }, { status: 500 });
  }
}
EOF
ok "Order API auf DB umgestellt"

# ============================================================
# 4. ADMIN ANALYTICS DASHBOARD
# ============================================================
info "Admin Analytics Dashboard wird erstellt..."

mkdir -p app/admin/analytics

cat > app/admin/analytics/page.tsx << 'EOF'
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  total: number;
  revenue: number;
  last24h: number;
  byStatus: Record<string, number>;
  byCountry: Record<string, number>;
}

interface AnalyticsData {
  total: number;
  last24h: number;
  byType: Record<string, number>;
  byLocale: Record<string, number>;
  byProduct: Record<string, number>;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, a] = await Promise.all([
        fetch('/api/orders?stats=true').then(r => r.json()),
        fetch('/api/analytics').then(r => r.json()),
      ]);
      setStats(s);
      setAnalytics(a);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const FLAGS: Record<string, string> = { de: '🇩🇪', ro: '🇷🇴', en: '🇬🇧', DE: '🇩🇪', RO: '🇷🇴' };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={load} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#888', padding: '0.4rem 1rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.8rem' }}>↻ Refresh</button>
          <Link href="/admin" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none', alignSelf: 'center' }}>← Admin</Link>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '3rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Analytics</h1>

        {loading ? (
          <p style={{ color: '#555' }}>Laden...</p>
        ) : (
          <>
            {/* KENNZAHLEN */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
              {[
                { label: 'Umsatz gesamt', value: `€${(stats?.revenue || 0).toFixed(2)}`, color: '#4ade80' },
                { label: 'Bestellungen', value: (stats?.total || 0).toString(), color: '#60a5fa' },
                { label: 'Letzte 24h', value: (stats?.last24h || 0).toString(), color: '#a78bfa' },
                { label: 'Seitenaufrufe 24h', value: (analytics?.last24h || 0).toString(), color: '#facc15' },
              ].map((kpi) => (
                <div key={kpi.label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem' }}>
                  <p style={{ color: '#555', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{kpi.label}</p>
                  <p style={{ color: kpi.color, fontSize: '2rem', fontWeight: 800 }}>{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* ORDER STATUS PIPELINE */}
            <h2 style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>Order Pipeline</h2>
            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
              {[
                { key: 'paid', label: 'Bezahlt', color: '#4ade80' },
                { key: 'production', label: 'In Produktion', color: '#facc15' },
                { key: 'shipped', label: 'Versendet', color: '#60a5fa' },
                { key: 'delivered', label: 'Geliefert', color: '#a78bfa' },
                { key: 'cancelled', label: 'Storniert', color: '#f87171' },
              ].map((s) => {
                const count = stats?.byStatus?.[s.key] || 0;
                const total = stats?.total || 1;
                const pct = (count / total) * 100;
                return (
                  <div key={s.key} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#ccc' }}>{s.label}</span>
                      <span style={{ fontSize: '0.875rem', color: s.color, fontWeight: 700 }}>{count}</span>
                    </div>
                    <div style={{ height: '6px', background: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: '3px', transition: 'width 0.3s' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* NACH LAND & SPRACHE */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>Bestellungen nach Land</h3>
                {Object.entries(stats?.byCountry || {}).length === 0 ? (
                  <p style={{ color: '#444', fontSize: '0.875rem' }}>Noch keine Daten</p>
                ) : (
                  Object.entries(stats?.byCountry || {}).map(([country, count]) => (
                    <div key={country} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                      <span style={{ fontSize: '0.875rem' }}>{FLAGS[country] || '🌍'} {country}</span>
                      <span style={{ fontSize: '0.875rem', color: '#888' }}>{count}</span>
                    </div>
                  ))
                )}
              </div>

              <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>Traffic nach Sprache</h3>
                {Object.entries(analytics?.byLocale || {}).length === 0 ? (
                  <p style={{ color: '#444', fontSize: '0.875rem' }}>Noch keine Daten</p>
                ) : (
                  Object.entries(analytics?.byLocale || {}).map(([locale, count]) => (
                    <div key={locale} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                      <span style={{ fontSize: '0.875rem' }}>{FLAGS[locale] || '🌍'} {locale.toUpperCase()}</span>
                      <span style={{ fontSize: '0.875rem', color: '#888' }}>{count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={{ background: '#0d1117', border: '1px solid #1a2332', borderRadius: '12px', padding: '1.25rem' }}>
              <p style={{ color: '#60a5fa', fontSize: '0.8rem', marginBottom: '0.5rem' }}>ℹ Datenquelle</p>
              <p style={{ color: '#888', fontSize: '0.8rem' }}>
                {stats?.total ? 'Live Daten aus Datenbank' : 'In-Memory Modus (DATABASE_URL nicht gesetzt). Daten werden bei Neustart zurückgesetzt.'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
EOF
ok "Analytics Dashboard fertig"

# ============================================================
# 5. ORDERS SEITE AUF API UMSTELLEN (echte Pipeline)
# ============================================================
info "Admin Orders nutzt jetzt API..."

cat > app/admin/orders/page.tsx << 'EOF'
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Order } from '@/lib/types';

const STATUS_FLOW: Order['status'][] = ['paid', 'production', 'shipped', 'delivered'];
const STATUS_COLORS: Record<string, string> = {
  paid: '#4ade80', production: '#facc15', shipped: '#60a5fa', delivered: '#a78bfa', cancelled: '#f87171', pending: '#888',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter ? `/api/orders?status=${filter}` : '/api/orders';
      const data = await fetch(url).then(r => r.json());
      setOrders(data.orders || []);
    } catch { setOrders([]); }
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

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

  const addTest = async () => {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerEmail: 'test@platypus.de',
        amountTotal: 34.98,
        items: [{ name: 'Essential Weiß', size: 'M', quantity: 1, price: 29.99 }],
        locale: 'de', shippingCountry: 'DE', status: 'paid',
      }),
    });
    load();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</Link>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={addTest} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '0.4rem 1rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.8rem' }}>+ Test</button>
          <Link href="/admin/analytics" style={{ background: '#1a1a1a', border: '1px solid #333', color: '#888', padding: '0.4rem 1rem', borderRadius: '999px', textDecoration: 'none', fontSize: '0.8rem' }}>Analytics</Link>
          <Link href="/admin" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none', alignSelf: 'center' }}>← Admin</Link>
        </div>
      </header>

      <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Orders</h1>
          <span style={{ color: '#555', fontSize: '0.875rem' }}>{orders.length} gesamt</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {['', 'paid', 'production', 'shipped', 'delivered'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              background: filter === s ? '#fff' : '#111',
              color: filter === s ? '#000' : '#888',
              border: '1px solid #222', padding: '0.4rem 1rem',
              borderRadius: '999px', cursor: 'pointer', fontSize: '0.8rem',
            }}>
              {s === '' ? 'Alle' : s}
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
            {orders.map((order) => (
              <div key={order.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.id}</p>
                    <p style={{ color: '#888', fontSize: '0.8rem' }}>{order.customerEmail} · {order.shippingCountry}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 800, fontSize: '1.25rem' }}>€{Number(order.amountTotal).toFixed(2)}</p>
                    <span style={{ background: '#1a1a1a', color: STATUS_COLORS[order.status], padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem' }}>
                      {order.status}
                    </span>
                  </div>
                </div>
                {order.items?.length > 0 && (
                  <div style={{ borderTop: '1px solid #222', paddingTop: '0.75rem', marginBottom: '0.75rem' }}>
                    {order.items.map((item, i) => (
                      <p key={i} style={{ color: '#aaa', fontSize: '0.8rem' }}>{item.quantity}× {item.name} ({item.size})</p>
                    ))}
                  </div>
                )}
                {STATUS_FLOW.indexOf(order.status) < STATUS_FLOW.length - 1 && STATUS_FLOW.includes(order.status) && (
                  <button onClick={() => advance(order)} style={{
                    background: '#1a1a1a', border: '1px solid #333', color: '#fff',
                    padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem',
                  }}>
                    → {STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
EOF
ok "Admin Orders auf API umgestellt"

# ============================================================
# 6. NEON PACKAGE INSTALLIEREN
# ============================================================
info "Neon Serverless Package..."
npm install @neondatabase/serverless > /dev/null 2>&1 && ok "Neon installiert" || warn "npm install fehlgeschlagen (Netzwerk?)"

# ============================================================
# 7. BUILD & DEPLOY
# ============================================================
info "Build..."

if npm run build > /tmp/phase3-build.log 2>&1; then
  ok "BUILD ERFOLGREICH"
else
  echo "Build Fehler:"
  tail -30 /tmp/phase3-build.log
  exit 1
fi

info "Deploy..."
git add .
git commit -m "phase3: db layer (postgres+fallback), analytics dashboard, order pipeline" || true
npx vercel --prod

echo ""
echo "================================================"
echo "  PLATYPUS — EXPANSION PHASE 3 DEPLOYED"
echo "================================================"
echo ""
echo "Neue Features:"
echo "  ✓ Datenbank Layer (Postgres + Fallback)"
echo "  ✓ Admin Analytics Dashboard"
echo "  ✓ Order Pipeline (paid→production→shipped→delivered)"
echo "  ✓ Umsatz, Traffic, Land & Sprache Tracking"
echo ""
echo "Für echte Persistenz (Daten überleben Neustart):"
echo "  1. https://vercel.com/dashboard → Storage → Create Database"
echo "  2. Postgres (Neon) wählen → mit Projekt verbinden"
echo "  3. DATABASE_URL wird automatisch gesetzt"
echo "  4. Neu deployen: npx vercel --prod"
echo ""
echo "Dashboards:"
echo "  https://platypus-shirt-shop.vercel.app/admin"
echo "  https://platypus-shirt-shop.vercel.app/admin/analytics"
echo "  https://platypus-shirt-shop.vercel.app/admin/orders"

