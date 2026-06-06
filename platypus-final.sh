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
# 1. VERCEL ENV VARIABLEN SETZEN
# ============================================================
info "Vercel Env Variablen werden gesetzt..."

if grep -q "^STRIPE_SECRET_KEY=sk_" .env.local 2>/dev/null; then
  STRIPE_KEY=$(grep "^STRIPE_SECRET_KEY=" .env.local | cut -d= -f2)
  echo "$STRIPE_KEY" | npx vercel env add STRIPE_SECRET_KEY production 2>/dev/null && ok "STRIPE_SECRET_KEY in Vercel" || warn "Manuell setzen: npx vercel env add STRIPE_SECRET_KEY"
fi

if grep -q "^ADMIN_PASSWORD=" .env.local 2>/dev/null; then
  ADMIN_PW=$(grep "^ADMIN_PASSWORD=" .env.local | cut -d= -f2)
  echo "$ADMIN_PW" | npx vercel env add ADMIN_PASSWORD production 2>/dev/null && ok "ADMIN_PASSWORD in Vercel" || warn "Manuell setzen: npx vercel env add ADMIN_PASSWORD"
fi

SITE_URL="https://platypus-shirt-shop.vercel.app"
echo "$SITE_URL" | npx vercel env add NEXT_PUBLIC_SITE_URL production 2>/dev/null && ok "NEXT_PUBLIC_SITE_URL in Vercel" || true

# ============================================================
# 2. NEXT.JS CONFIG OPTIMIEREN
# ============================================================
info "next.config.ts wird optimiert..."

cat > next.config.ts << 'EOF'
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'platypus-shirt-shop.vercel.app' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/shop', destination: '/', permanent: true },
      { source: '/products', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
EOF
ok "next.config.ts fertig"

# ============================================================
# 3. SITEMAP
# ============================================================
info "Sitemap wird erstellt..."

mkdir -p app

cat > app/sitemap.ts << 'EOF'
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://platypus-shirt-shop.vercel.app';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/product/1`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/product/2`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/cart`, lastModified: new Date(), changeFrequency: 'always', priority: 0.8 },
    { url: `${base}/versand`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/impressum`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/datenschutz`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/agb`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
EOF
ok "Sitemap fertig"

# ============================================================
# 4. ROBOTS.TXT
# ============================================================
cat > app/robots.ts << 'EOF'
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/', '/api/'] },
    ],
    sitemap: 'https://platypus-shirt-shop.vercel.app/sitemap.xml',
  };
}
EOF
ok "robots.ts fertig"

# ============================================================
# 5. FAVICON & MANIFEST
# ============================================================
info "Manifest erstellen..."

mkdir -p public

cat > public/manifest.json << 'EOF'
{
  "name": "PLATYPUS Shop",
  "short_name": "PLATYPUS",
  "description": "Premium Print-on-Demand T-Shirts",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#0a0a0a",
  "icons": [
    { "src": "/favicon.ico", "sizes": "any", "type": "image/x-icon" }
  ]
}
EOF
ok "Manifest fertig"

# ============================================================
# 6. ADMIN TESTS SEITE
# ============================================================
info "Admin Tests Seite..."

mkdir -p app/admin/tests

cat > app/admin/tests/page.tsx << 'EOF'
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
EOF
ok "Admin Tests Seite fertig"

# ============================================================
# 7. ADMIN INVENTORY SEITE
# ============================================================
info "Admin Inventory Seite..."

mkdir -p app/admin/inventory

cat > app/admin/inventory/page.tsx << 'EOF'
'use client';

import Link from 'next/link';

const PRODUCTS = [
  { id: '1', name: 'Essential Weiß', price: 29.99, sizes: ['S', 'M', 'L', 'XL', 'XXL'], status: 'aktiv', color: '#f5f5f5' },
  { id: '2', name: 'Essential Schwarz', price: 29.99, sizes: ['S', 'M', 'L', 'XL', 'XXL'], status: 'aktiv', color: '#111111' },
];

export default function InventoryPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</Link>
        <Link href="/admin" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none' }}>← Admin</Link>
      </header>

      <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Inventory</h1>
          <span style={{ color: '#555', fontSize: '0.875rem' }}>{PRODUCTS.length} Produkte</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {PRODUCTS.map((p) => (
            <div key={p.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: p.color, borderRadius: '8px', flexShrink: 0, border: '1px solid #333' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <p style={{ fontWeight: 700 }}>{p.name}</p>
                  <p style={{ fontWeight: 700 }}>€{p.price}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {p.sizes.map(s => (
                    <span key={s} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#888' }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ background: '#052e16', color: '#4ade80', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem' }}>{p.status}</span>
                  <Link href={`/product/${p.id}`} style={{ color: '#555', fontSize: '0.75rem', textDecoration: 'none' }}>Produktseite →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem' }}>
          <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Print-on-Demand System</p>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>Produkte werden nach Bestellung individuell produziert. Kein Lagerbestand notwendig.</p>
        </div>
      </div>
    </div>
  );
}
EOF
ok "Inventory Seite fertig"

# ============================================================
# 8. 404 SEITE
# ============================================================
cat > app/not-found.tsx << 'EOF'
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '6rem', fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>404</p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Seite nicht gefunden</h1>
        <p style={{ color: '#555', marginBottom: '2rem', fontSize: '0.875rem' }}>Diese Seite existiert nicht.</p>
        <Link href="/" style={{ background: '#fff', color: '#000', padding: '0.75rem 2rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
          Zurück zum Shop
        </Link>
      </div>
    </div>
  );
}
EOF
ok "404 Seite fertig"

# ============================================================
# 9. BUILD & DEPLOY
# ============================================================
info "Build..."

if npm run build > /tmp/final-build.log 2>&1; then
  ok "BUILD ERFOLGREICH"
else
  echo "Fehler:"
  tail -30 /tmp/final-build.log
  exit 1
fi

info "Deploy..."
git add .
git commit -m "final: sitemap, robots, manifest, tests, inventory, 404, next config" || true
npx vercel --prod

# ============================================================
# FINALER DIAGNOSE CHECK
# ============================================================
info "Finaler Check..."
sleep 10

BASE="https://platypus-shirt-shop.vercel.app"
echo ""
echo "================================================"
echo "  PLATYPUS — LAUNCH READY CHECK"
echo "================================================"

ROUTES=("/" "/product/1" "/product/2" "/cart" "/admin" "/admin/orders" "/admin/tests" "/admin/inventory" "/impressum" "/agb" "/datenschutz" "/versand" "/sitemap.xml" "/robots.txt")

ALL_OK=true
for route in "${ROUTES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$BASE$route" 2>/dev/null || echo "000")
  if [[ "$STATUS" == "200" || "$STATUS" == "401" ]]; then
    echo -e "${GREEN}[OK]${NC}   $route → $STATUS"
  else
    echo -e "${YELLOW}[!!]${NC}   $route → $STATUS"
    ALL_OK=false
  fi
done

echo ""
if [ "$ALL_OK" = true ]; then
  echo -e "${GREEN}ALLE ROUTEN OK — SHOP IST READY${NC}"
else
  echo -e "${YELLOW}Einige Routen haben Probleme — nächstes Deploy abwarten${NC}"
fi

echo ""
echo "Live:          $BASE"
echo "Admin:         $BASE/admin"
echo "Tests:         $BASE/admin/tests"
echo "Sitemap:       $BASE/sitemap.xml"
echo ""
echo "Letzter Schritt:"
echo "  → $BASE/admin/tests aufrufen"
echo "  → 'Alle testen' klicken"
echo "  → Alle grün = Launch ready"

