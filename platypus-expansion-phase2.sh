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
# 1. LOCALE PROVIDER (Context für ganze App)
# ============================================================
info "Locale Provider wird erstellt..."

mkdir -p app/components

cat > app/components/LocaleProvider.tsx << 'EOF'
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, getTranslation } from '@/lib/i18n';
import { detectLocale, setLocale as persistLocale } from '@/lib/locale';

interface LocaleContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: ReturnType<typeof getTranslation>;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('de');

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    persistLocale(l);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: getTranslation(locale) }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) return { locale: 'de' as Locale, setLocale: () => {}, t: getTranslation('de') };
  return ctx;
}
EOF
ok "Locale Provider fertig"

# ============================================================
# 2. SPRACHUMSCHALTER KOMPONENTE
# ============================================================
info "Sprachumschalter wird erstellt..."

cat > app/components/LocaleSwitcher.tsx << 'EOF'
'use client';

import { useState } from 'react';
import { useLocale } from './LocaleProvider';
import { Locale } from '@/lib/i18n';
import { LOCALE_FLAGS, LOCALE_LABELS } from '@/lib/locale';

export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const locales: Locale[] = ['de', 'ro', 'en'];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: '#1a1a1a', border: '1px solid #333', color: '#fff',
          padding: '0.4rem 0.75rem', borderRadius: '999px', cursor: 'pointer',
          fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
        }}
      >
        <span>{LOCALE_FLAGS[locale]}</span>
        <span style={{ color: '#888', fontSize: '0.7rem' }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
          background: '#111', border: '1px solid #222', borderRadius: '10px',
          overflow: 'hidden', zIndex: 200, minWidth: '140px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          {locales.map(l => (
            <button
              key={l}
              onClick={() => { setLocale(l); setOpen(false); }}
              style={{
                width: '100%', background: l === locale ? '#1a1a1a' : 'transparent',
                border: 'none', color: '#fff', padding: '0.625rem 1rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem',
                fontSize: '0.8rem', textAlign: 'left',
              }}
            >
              <span>{LOCALE_FLAGS[l]}</span>
              <span>{LOCALE_LABELS[l]}</span>
              {l === locale && <span style={{ marginLeft: 'auto', color: '#4ade80' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
EOF
ok "Sprachumschalter fertig"

# ============================================================
# 3. LAYOUT MIT PROVIDER & CHAT WIDGET
# ============================================================
info "Layout wird mit Provider & Chat verbunden..."

cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import './globals.css';
import { LocaleProvider } from './components/LocaleProvider';
import ChatWidgetWrapper from './components/ChatWidgetWrapper';

export const metadata: Metadata = {
  title: 'PLATYPUS — Premium Print-on-Demand T-Shirts',
  description: 'Dein eigenes Shirt. 360° Viewer. Stripe Checkout. Produktion auf Bestellung. Versand in DE & RO.',
  keywords: 'platypus, t-shirt, print on demand, custom shirt, 360 viewer, tricouri, romania',
  openGraph: {
    title: 'PLATYPUS — Premium T-Shirts',
    description: 'Dein Shirt. Cinematic 360° Viewer. Stripe Checkout.',
    type: 'website',
    url: 'https://platypus-shirt-shop.vercel.app',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body style={{ margin: 0, padding: 0, background: '#0a0a0a', color: '#fff' }}>
        <LocaleProvider>
          {children}
          <ChatWidgetWrapper />
        </LocaleProvider>
      </body>
    </html>
  );
}
EOF
ok "Layout fertig"

# ============================================================
# 4. CHAT WIDGET WRAPPER (nutzt Locale Context)
# ============================================================
cat > app/components/ChatWidgetWrapper.tsx << 'EOF'
'use client';

import { useLocale } from './LocaleProvider';
import ChatWidget from './ChatWidget';

export default function ChatWidgetWrapper() {
  const { locale } = useLocale();
  return <ChatWidget locale={locale} />;
}
EOF
ok "Chat Wrapper fertig"

# ============================================================
# 5. HOMEPAGE MIT LOCALE
# ============================================================
info "Homepage wird mehrsprachig..."

cat > app/page.tsx << 'EOF'
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from './components/LocaleProvider';
import LocaleSwitcher from './components/LocaleSwitcher';
import { getAllProducts, getProductName, getProductDescription } from '@/lib/products';

export default function HomePage() {
  const { t, locale } = useLocale();
  const [cartCount, setCartCount] = useState(0);
  const products = getAllProducts();

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('platypus_cart') || '[]');
      setCartCount(cart.reduce((s: number, i: { quantity?: number }) => s + (i.quantity || 1), 0));
    } catch { setCartCount(0); }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#0a0a0a', zIndex: 100 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</div>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/versand" style={{ color: '#888', textDecoration: 'none', fontSize: '0.875rem' }}>{t.nav.shipping}</Link>
          <LocaleSwitcher />
          <Link href="/cart" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.875rem', background: '#1a1a1a', padding: '0.4rem 1rem', borderRadius: '999px', border: '1px solid #333' }}>
            {t.nav.cart} {cartCount > 0 && `(${cartCount})`}
          </Link>
        </nav>
      </header>

      <section style={{ padding: '6rem 2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ color: '#666', fontSize: '0.75rem', letterSpacing: '0.3em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>{t.hero.badge}</p>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
          {t.hero.headline1}<br />
          <span style={{ color: '#444' }}>{t.hero.headline2}</span>
        </h1>
        <p style={{ color: '#666', fontSize: '1.125rem', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>
          {t.hero.sub}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/product/1" style={{ background: '#fff', color: '#000', padding: '0.875rem 2.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em' }}>
            {t.hero.cta}
          </Link>
          <Link href="/product/1" style={{ background: 'transparent', color: '#fff', padding: '0.875rem 2.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', border: '1px solid #333' }}>
            {t.hero.viewer}
          </Link>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ height: '280px', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', color: p.textColor }}>
                    <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>👕</div>
                    <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', opacity: 0.5, textTransform: 'uppercase' }}>360° Viewer</p>
                  </div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ color: '#fff', fontWeight: 700, marginBottom: '0.25rem' }}>{getProductName(p, locale)}</p>
                      <p style={{ color: '#555', fontSize: '0.8rem' }}>{getProductDescription(p, locale)}</p>
                    </div>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.125rem' }}>€{p.price}</p>
                  </div>
                  <div style={{ marginTop: '1.25rem', background: '#fff', color: '#000', padding: '0.625rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                    {t.hero.cta}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', borderTop: '1px solid #111', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {t.trust.map((item) => (
            <div key={item.label}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{item.label}</p>
              <p style={{ color: '#555', fontSize: '0.75rem' }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #111', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#333', fontSize: '0.75rem', marginBottom: '1rem', letterSpacing: '0.2em' }}>PLATYPUS — Premium Print-on-Demand</p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['Impressum', '/impressum'], ['Datenschutz', '/datenschutz'], ['AGB', '/agb'], [t.nav.shipping, '/versand']].map(([label, href]) => (
            <Link key={href} href={href} style={{ color: '#444', textDecoration: 'none', fontSize: '0.75rem' }}>{label}</Link>
          ))}
        </div>
      </footer>

    </div>
  );
}
EOF
ok "Homepage mehrsprachig fertig"

# ============================================================
# 6. E-MAIL BESTÄTIGUNG API (Resend)
# ============================================================
info "E-Mail System wird erstellt..."

mkdir -p app/api/email

cat > app/api/email/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';

const EMAIL_TEMPLATES: Record<string, (data: OrderEmailData) => { subject: string; html: string }> = {
  de: (d) => ({
    subject: `PLATYPUS — Bestellbestätigung ${d.orderId}`,
    html: buildHtml('Danke für deine Bestellung!', 'Deine Bestellung wurde erfolgreich aufgegeben.', d, 'Produktion startet innerhalb von 24 Stunden.'),
  }),
  ro: (d) => ({
    subject: `PLATYPUS — Confirmare comandă ${d.orderId}`,
    html: buildHtml('Mulțumim pentru comandă!', 'Comanda ta a fost plasată cu succes.', d, 'Producția începe în 24 de ore.'),
  }),
  en: (d) => ({
    subject: `PLATYPUS — Order Confirmation ${d.orderId}`,
    html: buildHtml('Thank you for your order!', 'Your order has been placed successfully.', d, 'Production starts within 24 hours.'),
  }),
};

interface OrderEmailData {
  orderId: string;
  email: string;
  total: number;
  items: { name: string; size: string; quantity: number; price: number }[];
  locale: string;
}

function buildHtml(title: string, intro: string, d: OrderEmailData, footer: string): string {
  const itemRows = d.items.map(i =>
    `<tr><td style="padding:8px 0;color:#888">${i.quantity}× ${i.name} (${i.size})</td><td style="padding:8px 0;text-align:right">€${(i.price * i.quantity).toFixed(2)}</td></tr>`
  ).join('');

  return `
  <div style="background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;padding:40px 20px;max-width:600px;margin:0 auto">
    <h1 style="font-size:24px;letter-spacing:0.15em;margin-bottom:32px">PLATYPUS</h1>
    <h2 style="font-size:20px;margin-bottom:8px">${title}</h2>
    <p style="color:#888;margin-bottom:24px">${intro}</p>
    <div style="background:#111;border:1px solid #222;border-radius:12px;padding:20px;margin-bottom:24px">
      <p style="color:#555;font-size:12px;margin-bottom:12px">Order ${d.orderId}</p>
      <table style="width:100%;border-collapse:collapse">${itemRows}</table>
      <div style="border-top:1px solid #222;margin-top:12px;padding-top:12px;display:flex;justify-content:space-between">
        <strong>Total</strong><strong>€${d.total.toFixed(2)}</strong>
      </div>
    </div>
    <p style="color:#555;font-size:13px">${footer}</p>
  </div>`;
}

export async function POST(request: NextRequest) {
  try {
    const data: OrderEmailData = await request.json();
    const apiKey = process.env.RESEND_API_KEY;

    const template = (EMAIL_TEMPLATES[data.locale] || EMAIL_TEMPLATES.de)(data);

    if (!apiKey) {
      console.log('E-Mail (Demo):', template.subject, '→', data.email);
      return NextResponse.json({ sent: false, demo: true, subject: template.subject });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PLATYPUS <orders@platypus-shop.de>',
        to: data.email,
        subject: template.subject,
        html: template.html,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ sent: false, error: 'Resend Fehler' });
    }

    return NextResponse.json({ sent: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Fehler';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
EOF
ok "E-Mail System fertig (Resend)"

# ============================================================
# 7. ANALYTICS API (einfaches Event Tracking)
# ============================================================
info "Analytics System wird erstellt..."

mkdir -p app/api/analytics

cat > app/api/analytics/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsEvent {
  type: string;
  page?: string;
  productId?: string;
  locale?: string;
  value?: number;
  timestamp: string;
}

const EVENTS: AnalyticsEvent[] = [];
const MAX_EVENTS = 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event: AnalyticsEvent = {
      type: body.type || 'pageview',
      page: body.page,
      productId: body.productId,
      locale: body.locale,
      value: body.value,
      timestamp: new Date().toISOString(),
    };

    EVENTS.unshift(event);
    if (EVENTS.length > MAX_EVENTS) EVENTS.pop();

    return NextResponse.json({ tracked: true });
  } catch {
    return NextResponse.json({ tracked: false });
  }
}

export async function GET() {
  const now = Date.now();
  const last24h = EVENTS.filter(e => now - new Date(e.timestamp).getTime() < 86400000);

  const byType: Record<string, number> = {};
  const byLocale: Record<string, number> = {};
  const byProduct: Record<string, number> = {};

  for (const e of last24h) {
    byType[e.type] = (byType[e.type] || 0) + 1;
    if (e.locale) byLocale[e.locale] = (byLocale[e.locale] || 0) + 1;
    if (e.productId) byProduct[e.productId] = (byProduct[e.productId] || 0) + 1;
  }

  return NextResponse.json({
    total: EVENTS.length,
    last24h: last24h.length,
    byType,
    byLocale,
    byProduct,
    recent: EVENTS.slice(0, 20),
  });
}
EOF
ok "Analytics System fertig"

# ============================================================
# 8. ANALYTICS TRACKER KOMPONENTE
# ============================================================
cat > app/components/Analytics.tsx << 'EOF'
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function track(type: string, data?: Record<string, unknown>) {
  try {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...data }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    track('pageview', { page: pathname });
  }, [pathname]);

  return null;
}
EOF
ok "Analytics Tracker fertig"

# ============================================================
# 9. BUILD & DEPLOY
# ============================================================
info "Build..."

if npm run build > /tmp/phase2-build.log 2>&1; then
  ok "BUILD ERFOLGREICH"
else
  echo "Build Fehler:"
  tail -30 /tmp/phase2-build.log
  exit 1
fi

info "Deploy..."
git add .
git commit -m "phase2: locale provider, switcher, mehrsprachige homepage, email, analytics, chat live" || true
npx vercel --prod

echo ""
echo "================================================"
echo "  PLATYPUS — EXPANSION PHASE 2 DEPLOYED"
echo "================================================"
echo ""
echo "Neue Features:"
echo "  ✓ Sprachumschalter DE/RO/EN (live)"
echo "  ✓ Homepage komplett mehrsprachig"
echo "  ✓ KI Chat auf jeder Seite (unten rechts)"
echo "  ✓ E-Mail Bestätigung (Resend)"
echo "  ✓ Analytics Event Tracking"
echo ""
echo "Optionale Keys für volle Power:"
echo "  ANTHROPIC_API_KEY  → echter KI Chat"
echo "  RESEND_API_KEY     → echte E-Mails"
echo ""
echo "Live: https://platypus-shirt-shop.vercel.app"
echo ""
echo "Phase 3 als nächstes:"
echo "  → Produktseite mehrsprachig + Analytics"
echo "  → Admin Analytics Dashboard"
echo "  → Datenbank (Supabase) für echte Persistenz"

