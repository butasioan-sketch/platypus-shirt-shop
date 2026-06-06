#!/bin/bash
set -euo pipefail

GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'
ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
info() { echo -e "${CYAN}[->]${NC} $1"; }

# ============================================================
# 1. LAYOUT & GLOBAL STYLES
# ============================================================
info "Layout wird aktualisiert..."

cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PLATYPUS — Premium Print-on-Demand T-Shirts',
  description: 'Eigene T-Shirts. 360° Viewer. Stripe Checkout. Produktion auf Bestellung.',
  keywords: 'platypus, t-shirt, print on demand, custom shirt, 360 viewer',
  openGraph: {
    title: 'PLATYPUS — Premium T-Shirts',
    description: 'Dein eigenes Shirt. Cinematic 360° Viewer. Stripe Checkout.',
    type: 'website',
    url: 'https://platypus-shirt-shop.vercel.app',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body style={{ margin: 0, padding: 0, background: '#0a0a0a', color: '#fff' }}>
        {children}
      </body>
    </html>
  );
}
EOF
ok "Layout fertig"

# ============================================================
# 2. GLOBALS CSS
# ============================================================
info "Globals CSS..."

cat > app/globals.css << 'EOF'
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  background: #0a0a0a;
  color: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button {
  font-family: inherit;
  transition: opacity 0.15s, transform 0.1s;
}

button:hover:not(:disabled) {
  opacity: 0.9;
}

button:active:not(:disabled) {
  transform: scale(0.98);
}

a {
  transition: opacity 0.15s;
}

a:hover {
  opacity: 0.8;
}

input, select, textarea {
  font-family: inherit;
}

::selection {
  background: #fff;
  color: #000;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #0a0a0a;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

@media (max-width: 768px) {
  .desktop-only { display: none !important; }
  .mobile-sticky-cta { display: block !important; }
}

@media (min-width: 769px) {
  .mobile-only { display: none !important; }
}
EOF
ok "Globals CSS fertig"

# ============================================================
# 3. ADMIN DASHBOARD
# ============================================================
info "Admin Dashboard wird verbessert..."

mkdir -p app/admin

cat > app/admin/page.tsx << 'EOF'
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [orderCount, setOrderCount] = useState(0);
  const [stripeStatus, setStripeStatus] = useState<'loading' | 'ok' | 'demo'>('loading');

  useEffect(() => {
    try {
      const orders = JSON.parse(localStorage.getItem('platypus_orders') || '[]');
      setOrderCount(orders.length);
    } catch { setOrderCount(0); }

    fetch('/api/payments/create-checkout')
      .then(r => r.json())
      .then(d => setStripeStatus(d.stripeKeyConfigured ? 'ok' : 'demo'))
      .catch(() => setStripeStatus('demo'));
  }, []);

  const cards = [
    { label: 'Orders', value: orderCount.toString(), href: '/admin/orders', color: '#4ade80', icon: '📦' },
    { label: 'Stripe', value: stripeStatus === 'loading' ? '...' : stripeStatus === 'ok' ? 'Aktiv' : 'Demo', href: '/admin/tests', color: stripeStatus === 'ok' ? '#4ade80' : '#facc15', icon: '💳' },
    { label: 'Inventory', value: '2 Produkte', href: '/admin/inventory', color: '#60a5fa', icon: '👕' },
    { label: 'Viewer Notes', value: 'Notizen', href: '/admin/viewer-notes', color: '#a78bfa', icon: '📝' },
  ];

  const links = [
    { label: 'Live Shop', href: 'https://platypus-shirt-shop.vercel.app', ext: true },
    { label: 'Produkt 1', href: '/product/1', ext: false },
    { label: 'Produkt 2', href: '/product/2', ext: false },
    { label: 'Warenkorb', href: '/cart', ext: false },
    { label: 'Stripe Dashboard', href: 'https://dashboard.stripe.com', ext: true },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</span>
          <span style={{ color: '#444', marginLeft: '1rem', fontSize: '0.875rem' }}>Admin</span>
        </div>
        <Link href="/" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none' }}>← Shop</Link>
      </header>

      <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: '#555', fontSize: '0.875rem', marginBottom: '2.5rem' }}>
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {cards.map((card) => (
            <Link key={card.label} href={card.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#333')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a1a1a')}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{card.icon}</div>
                <p style={{ color: '#555', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{card.label}</p>
                <p style={{ color: card.color, fontSize: '1.5rem', fontWeight: 800 }}>{card.value}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* QUICK LINKS */}
        <h2 style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>Quick Links</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
          {links.map((l) => (
            <a key={l.label} href={l.href} target={l.ext ? '_blank' : undefined} rel={l.ext ? 'noopener noreferrer' : undefined}
              style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', color: '#fff', fontSize: '0.875rem' }}>
              <span>{l.label}</span>
              <span style={{ color: '#333' }}>{l.ext ? '↗' : '→'}</span>
            </a>
          ))}
        </div>

        {/* CHECKLISTE */}
        <h2 style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>Launch Checkliste</h2>
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem' }}>
          {[
            { done: true,  label: 'Shop live auf Vercel' },
            { done: true,  label: 'Stripe Checkout integriert' },
            { done: true,  label: 'Produktseiten mit 360° Viewer' },
            { done: true,  label: 'Admin Dashboard' },
            { done: true,  label: 'Warenkorb mit LocalStorage' },
            { done: stripeStatus === 'ok', label: 'Echter Stripe Key gesetzt' },
            { done: false, label: 'Stripe Webhook aktiv' },
            { done: false, label: 'Admin Passwort gesetzt' },
            { done: false, label: 'Echte Produktbilder' },
            { done: false, label: 'Erster echter Testkauf' },
            { done: false, label: 'Datenbank (Supabase)' },
            { done: false, label: 'E-Mail Bestätigung' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid #1a1a1a' }}>
              <span style={{ color: item.done ? '#4ade80' : '#333', fontSize: '1rem', minWidth: '20px' }}>
                {item.done ? '✓' : '○'}
              </span>
              <span style={{ color: item.done ? '#fff' : '#555', fontSize: '0.875rem' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
EOF
ok "Admin Dashboard fertig"

# ============================================================
# 4. IMPRESSUM / DATENSCHUTZ / AGB / VERSAND
# ============================================================
info "Rechtliche Seiten werden vervollständigt..."

mkdir -p app/impressum app/datenschutz app/agb app/versand

for page in impressum datenschutz agb versand; do
  TITLE=""
  CONTENT=""
  case $page in
    impressum)
      TITLE="Impressum"
      CONTENT="<p>Angaben gemäß § 5 TMG</p>
        <p style='margin-top:1rem'>PLATYPUS Shop<br/>Musterstraße 1<br/>12345 Musterstadt<br/>Deutschland</p>
        <p style='margin-top:1rem'>Kontakt:<br/>E-Mail: kontakt@platypus-shop.de</p>
        <p style='margin-top:1rem;color:#555;font-size:0.8rem'>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV: Inhaber PLATYPUS Shop</p>"
      ;;
    datenschutz)
      TITLE="Datenschutz"
      CONTENT="<p>Wir nehmen den Schutz deiner Daten ernst.</p>
        <h2 style='margin-top:2rem;font-size:1.25rem'>Datenerhebung</h2>
        <p style='margin-top:0.75rem;color:#888'>Beim Kauf werden deine Daten ausschließlich zur Bestellabwicklung via Stripe verarbeitet. Wir speichern keine Zahlungsdaten.</p>
        <h2 style='margin-top:2rem;font-size:1.25rem'>Stripe</h2>
        <p style='margin-top:0.75rem;color:#888'>Zahlungen werden über Stripe Inc. abgewickelt. Es gelten die Datenschutzbestimmungen von Stripe: stripe.com/privacy</p>
        <h2 style='margin-top:2rem;font-size:1.25rem'>Cookies</h2>
        <p style='margin-top:0.75rem;color:#888'>Wir verwenden LocalStorage für den Warenkorb. Keine Tracking-Cookies.</p>"
      ;;
    agb)
      TITLE="AGB"
      CONTENT="<h2 style='font-size:1.25rem'>§1 Geltungsbereich</h2>
        <p style='margin-top:0.75rem;color:#888'>Diese AGB gelten für alle Bestellungen über platypus-shirt-shop.vercel.app</p>
        <h2 style='margin-top:2rem;font-size:1.25rem'>§2 Vertragsschluss</h2>
        <p style='margin-top:0.75rem;color:#888'>Der Kauf kommt mit Abschluss des Stripe Checkouts zustande.</p>
        <h2 style='margin-top:2rem;font-size:1.25rem'>§3 Preise</h2>
        <p style='margin-top:0.75rem;color:#888'>Alle Preise inkl. MwSt. zzgl. Versandkosten (€4.99 DE).</p>
        <h2 style='margin-top:2rem;font-size:1.25rem'>§4 Rückgabe</h2>
        <p style='margin-top:0.75rem;color:#888'>14 Tage Widerrufsrecht ab Erhalt der Ware.</p>
        <h2 style='margin-top:2rem;font-size:1.25rem'>§5 Produktion</h2>
        <p style='margin-top:0.75rem;color:#888'>Print-on-Demand — jedes Shirt wird individuell produziert. Lieferzeit 5–10 Werktage.</p>"
      ;;
    versand)
      TITLE="Versand"
      CONTENT="<div style='display:grid;gap:1.5rem'>
        <div style='background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:1.5rem'>
          <h2 style='font-size:1.125rem;margin-bottom:0.5rem'>Deutschland</h2>
          <p style='color:#888;font-size:0.875rem'>€4.99 — 3–5 Werktage nach Produktion</p>
        </div>
        <div style='background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:1.5rem'>
          <h2 style='font-size:1.125rem;margin-bottom:0.5rem'>EU</h2>
          <p style='color:#888;font-size:0.875rem'>€8.99 — 5–10 Werktage</p>
        </div>
        <div style='background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:1.5rem'>
          <h2 style='font-size:1.125rem;margin-bottom:0.5rem'>Produktion</h2>
          <p style='color:#888;font-size:0.875rem'>Print-on-Demand: jedes Shirt wird nach Bestellung gedruckt. Produktionszeit: 2–3 Werktage.</p>
        </div>
        <div style='background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:1.5rem'>
          <h2 style='font-size:1.125rem;margin-bottom:0.5rem'>Rückgabe</h2>
          <p style='color:#888;font-size:0.875rem'>14 Tage ab Erhalt. Rücksendekosten trägt der Käufer.</p>
        </div>
      </div>"
      ;;
  esac

  cat > "app/${page}/page.tsx" << PAGEOF
import Link from 'next/link';

export default function ${TITLE}Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</Link>
        <Link href="/" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none' }}>← Zurück</Link>
      </header>
      <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>${TITLE}</h1>
        <div dangerouslySetInnerHTML={{ __html: \`${CONTENT}\` }} />
      </div>
    </div>
  );
}
PAGEOF

  ok "${TITLE} fertig"
done

# ============================================================
# 5. LOADING PAGE
# ============================================================
cat > app/loading.tsx << 'EOF'
export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#333', fontSize: '0.875rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
        Laden...
      </div>
    </div>
  );
}
EOF
ok "Loading Page fertig"

# ============================================================
# 6. BUILD & DEPLOY
# ============================================================
info "Build..."

if npm run build > /tmp/polish-build.log 2>&1; then
  ok "BUILD ERFOLGREICH"
else
  echo "Fehler:"
  tail -25 /tmp/polish-build.log
  exit 1
fi

info "Deploy..."
git add .
git commit -m "polish: layout, admin dashboard, rechtliche seiten, globals css" || true
npx vercel --prod

echo ""
echo "================================================"
echo "  PLATYPUS — FERTIG POLISHED"
echo "================================================"
echo ""
echo "Live:      https://platypus-shirt-shop.vercel.app"
echo "Admin:     https://platypus-shirt-shop.vercel.app/admin"
echo "Orders:    https://platypus-shirt-shop.vercel.app/admin/orders"
echo ""
echo "Test Karte für Stripe:"
echo "  4242 4242 4242 4242 | beliebig | beliebig"
echo ""
echo "Noch offen:"
echo "  → npx vercel env add STRIPE_SECRET_KEY"
echo "  → npx vercel env add ADMIN_PASSWORD"
echo "  → Stripe Webhook eintragen"

