#!/bin/bash
set -euo pipefail

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
info() { echo -e "${CYAN}[->]${NC} $1"; }
warn() { echo -e "${YELLOW}[!!]${NC} $1"; }
fail() { echo -e "${RED}[FAIL]${NC} $1"; }

# ============================================================
# 1. STRIPE SECRET KEY aus Vercel holen
# ============================================================
info "Vercel Env Variables werden gepullt..."
npx vercel env pull .env.local --yes 2>/dev/null || true

# Key prüfen
if grep -q "^STRIPE_SECRET_KEY=sk_" .env.local 2>/dev/null; then
  KEY=$(grep "^STRIPE_SECRET_KEY=" .env.local | cut -d= -f2)
  ok "Stripe Key gefunden: ${KEY:0:16}..."
else
  warn "Kein gültiger Stripe Key in .env.local"
  warn "Bitte jetzt eingeben (sk_test_... oder sk_live_...):"
  read -r -p "STRIPE_SECRET_KEY: " STRIPE_KEY
  if [[ "$STRIPE_KEY" == sk_* ]]; then
    sed -i '/^STRIPE_SECRET_KEY=/d' .env.local 2>/dev/null || true
    echo "STRIPE_SECRET_KEY=$STRIPE_KEY" >> .env.local
    ok "Stripe Key gesetzt"
    npx vercel env add STRIPE_SECRET_KEY production <<< "$STRIPE_KEY" 2>/dev/null || warn "Vercel env add manuell nötig"
  else
    fail "Ungültiger Key — Script wird fortgesetzt ohne Stripe"
  fi
fi

# ============================================================
# 2. NEXT_PUBLIC_SITE_URL setzen falls fehlt
# ============================================================
if ! grep -q "^NEXT_PUBLIC_SITE_URL=" .env.local 2>/dev/null; then
  echo "NEXT_PUBLIC_SITE_URL=https://platypus-shirt-shop.vercel.app" >> .env.local
  ok "NEXT_PUBLIC_SITE_URL gesetzt"
fi

# ============================================================
# 3. STRIPE CHECKOUT API — robust & typsicher
# ============================================================
info "Stripe Checkout API wird aktualisiert..."

mkdir -p app/api/payments/create-checkout

cat > app/api/payments/create-checkout/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY;
  return NextResponse.json({
    status: 'platypus_payment_api',
    stripeKeyConfigured: !!(key && key.startsWith('sk_')),
    mode: key?.startsWith('sk_live_') ? 'live' : 'test',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, total, shipping, reference, paymentMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Keine Produkte' }, { status: 400 });
    }

    const key = process.env.STRIPE_SECRET_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://platypus-shirt-shop.vercel.app';

    if (!key || !key.startsWith('sk_')) {
      return NextResponse.json({
        ok: false,
        status: 'demo_mode',
        message: 'Kein Stripe Key konfiguriert',
        total,
        reference,
      }, { status: 200 });
    }

    const stripe = new Stripe(key);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: { name: string; price: number; quantity: number; size?: string }) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${item.name}${item.size ? ` (${item.size})` : ''}`,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || 1,
      })
    );

    if (shipping && shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Versand' },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: [paymentMethod === 'paypal' ? 'paypal' : 'card'] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      metadata: { reference: reference || 'platypus-order' },
    });

    return NextResponse.json({
      ok: true,
      provider: 'stripe',
      methodId: paymentMethod,
      methodLabel: 'Visa / Mastercard',
      status: 'stripe_checkout_created',
      amount: total,
      currency: 'EUR',
      reference,
      redirectUrl: session.url,
      createdAt: new Date().toISOString(),
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
    console.error('Checkout error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
EOF
ok "Stripe Checkout API aktualisiert"

# ============================================================
# 4. WEBHOOK ROUTE — kein Supabase, stabil
# ============================================================
info "Stripe Webhook Route wird gefixt..."

mkdir -p app/api/webhooks/stripe

cat > app/api/webhooks/stripe/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!key || !key.startsWith('sk_')) {
    return NextResponse.json({ received: true, warning: 'no stripe key' });
  }

  const stripe = new Stripe(key);
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  if (!webhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET nicht gesetzt');
    return NextResponse.json({ received: true, warning: 'no webhook secret' });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown';
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Zahlung erfolgreich:', {
        id: session.id,
        email: session.customer_email,
        amount: session.amount_total,
      });
      break;
    }
    case 'payment_intent.succeeded':
      console.log('PaymentIntent succeeded');
      break;
    default:
      console.log('Webhook event:', event.type);
  }

  return NextResponse.json({ received: true });
}
EOF
ok "Webhook Route gefixt (kein Supabase)"

# ============================================================
# 5. CHECKOUT SUCCESS & CANCEL SEITEN
# ============================================================
info "Checkout Result Seiten..."

mkdir -p app/checkout/success
mkdir -p app/checkout/cancel

cat > app/checkout/success/page.tsx << 'EOF'
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params?.get('session_id');

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✓</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Zahlung erfolgreich</h1>
        <p style={{ color: '#666', marginBottom: '0.5rem' }}>Danke für deine Bestellung!</p>
        {sessionId && <p style={{ color: '#333', fontSize: '0.75rem', marginBottom: '2rem', fontFamily: 'monospace' }}>{sessionId.slice(0, 30)}...</p>}
        <p style={{ color: '#555', fontSize: '0.875rem', marginBottom: '3rem' }}>
          Du erhältst eine Bestätigungsmail von Stripe.<br />
          Produktion startet innerhalb von 24h.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/" style={{ background: '#fff', color: '#000', padding: '0.75rem 2rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
            Zurück zum Shop
          </Link>
          <Link href="/admin/orders" style={{ background: '#111', color: '#888', padding: '0.75rem 2rem', borderRadius: '999px', textDecoration: 'none', fontSize: '0.875rem', border: '1px solid #222' }}>
            Admin Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Laden...</div>}><SuccessContent /></Suspense>;
}
EOF

cat > app/checkout/cancel/page.tsx << 'EOF'
'use client';

import Link from 'next/link';

export default function CancelPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✕</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Abgebrochen</h1>
        <p style={{ color: '#555', marginBottom: '2rem' }}>Zahlung wurde abgebrochen. Dein Warenkorb ist noch gespeichert.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/cart" style={{ background: '#fff', color: '#000', padding: '0.75rem 2rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
            Zurück zum Warenkorb
          </Link>
          <Link href="/" style={{ background: '#111', color: '#888', padding: '0.75rem 2rem', borderRadius: '999px', textDecoration: 'none', fontSize: '0.875rem', border: '1px solid #222' }}>
            Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
EOF
ok "Checkout Seiten erstellt"

# ============================================================
# 6. BUILD TEST
# ============================================================
info "Build wird getestet..."

if npm run build > /tmp/stripe-final-build.log 2>&1; then
  ok "BUILD ERFOLGREICH"
else
  fail "Build fehlgeschlagen:"
  tail -30 /tmp/stripe-final-build.log
  exit 1
fi

# ============================================================
# 7. DEPLOY
# ============================================================
info "Deploy zu Vercel..."

git add .
git commit -m "fix: stripe api, webhook, checkout pages, kein supabase" || true
npx vercel --prod

echo ""
echo "================================================"
echo "  STRIPE KOMPLETT KONFIGURIERT"
echo "================================================"
echo ""
echo "Live Test:"
echo "  1. https://platypus-shirt-shop.vercel.app/product/1"
echo "  2. Größe wählen → JETZT KAUFEN"
echo "  3. Stripe Checkout sollte öffnen"
echo ""
echo "Stripe Test Karte:"
echo "  Nummer:  4242 4242 4242 4242"
echo "  Datum:   beliebig in Zukunft"
echo "  CVC:     beliebig"
echo ""
echo "Nach Kauf:"
echo "  https://platypus-shirt-shop.vercel.app/checkout/success"
echo "  https://platypus-shirt-shop.vercel.app/admin/orders"

