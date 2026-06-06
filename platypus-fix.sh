#!/bin/bash
set -euo pipefail

GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'
ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
info() { echo -e "${CYAN}[->]${NC} $1"; }

# ============================================================
# FIX 1: Stripe API Version korrigieren (Build bricht ab)
# ============================================================
info "Fix 1: Stripe API Version..."

cat > app/api/webhooks/stripe/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-04-22.dahlia',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  if (!webhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET nicht gesetzt');
    return NextResponse.json({ received: true, warning: 'no webhook secret' });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature failed:', message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Zahlung erfolgreich:', session.id, session.customer_email);
  }

  return NextResponse.json({ received: true });
}
EOF
ok "Stripe Webhook Route gefixt"

# ============================================================
# FIX 2: middleware.ts erstellen (Admin Auth)
# ============================================================
info "Fix 2: middleware.ts erstellen..."

cat > middleware.ts << 'EOF'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.next();
    }

    const authHeader = request.headers.get('authorization');

    if (authHeader?.startsWith('Basic ')) {
      const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
      const [, password] = credentials.split(':');
      if (password === adminPassword) {
        return NextResponse.next();
      }
    }

    return new NextResponse('Admin Login erforderlich', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="PLATYPUS Admin"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
EOF
ok "middleware.ts erstellt"

# ============================================================
# FIX 3: Admin Orders Seite erstellen (404)
# ============================================================
info "Fix 3: Admin Orders Seite..."

mkdir -p app/admin/orders

cat > app/admin/orders/page.tsx << 'EOF'
'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: string;
  stripeSessionId?: string;
  customerEmail?: string;
  amount?: number;
  status: string;
  items?: { name: string; size: string; quantity: number; price: number }[];
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('platypus_orders');
      if (stored) setOrders(JSON.parse(stored));
    } catch {
      setOrders([]);
    }
  }, []);

  const clearOrders = () => {
    localStorage.removeItem('platypus_orders');
    setOrders([]);
  };

  const addTestOrder = () => {
    const testOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerEmail: 'test@example.com',
      amount: 34.98,
      status: 'paid',
      items: [{ name: 'Essential Shirt Weiß', size: 'M', quantity: 1, price: 29.99 }],
      createdAt: new Date().toISOString(),
    };
    const updated = [testOrder, ...orders];
    localStorage.setItem('platypus_orders', JSON.stringify(updated));
    setOrders(updated);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>PLATYPUS Orders</h1>
            <p style={{ color: '#888' }}>{orders.length} Bestellung{orders.length !== 1 ? 'en' : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={addTestOrder} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
              + Test Order
            </button>
            <button onClick={clearOrders} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#888', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
              Alle löschen
            </button>
            <a href="/admin" style={{ background: '#1a1a1a', border: '1px solid #333', color: '#888', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none' }}>
              ← Admin
            </a>
          </div>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#555', border: '1px solid #222', borderRadius: '12px' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Keine Bestellungen</p>
            <p>Nach echten Käufen erscheinen Orders hier automatisch.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => (
              <div key={order.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '1rem' }}>{order.id}</p>
                    <p style={{ color: '#888', fontSize: '0.875rem' }}>{order.customerEmail || 'unbekannt'}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, fontSize: '1.25rem' }}>€{order.amount?.toFixed(2) || '—'}</p>
                    <span style={{
                      background: order.status === 'paid' ? '#052e16' : '#1a1a00',
                      color: order.status === 'paid' ? '#4ade80' : '#facc15',
                      padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem'
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>
                {order.items && (
                  <div style={{ borderTop: '1px solid #222', paddingTop: '0.75rem' }}>
                    {order.items.map((item, i) => (
                      <p key={i} style={{ color: '#aaa', fontSize: '0.875rem' }}>
                        {item.quantity}× {item.name} (Größe {item.size}) — €{item.price}
                      </p>
                    ))}
                  </div>
                )}
                <p style={{ color: '#555', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  {new Date(order.createdAt).toLocaleString('de-DE')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
EOF
ok "Admin Orders Seite erstellt"

# ============================================================
# FIX 4: fehlende Module erstellen
# ============================================================
info "Fix 4: Module erstellen..."
mkdir -p modules

cat > modules/admin.sh << 'EOF'
#!/bin/bash
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"
log() { echo "[ADMIN] $1"; }
check_status() {
  [ -f "$PROJECT_DIR/middleware.ts" ] && echo "OK middleware.ts" || echo "FEHLT middleware.ts"
  grep -q "ADMIN_PASSWORD" "$PROJECT_DIR/.env.local" 2>/dev/null && echo "OK ADMIN_PASSWORD" || echo "FEHLT ADMIN_PASSWORD"
}
setup_password() {
  read -sp "Admin Passwort: " pw; echo ""
  echo "ADMIN_PASSWORD=$pw" >> "$PROJECT_DIR/.env.local"
  echo "OK Passwort gespeichert"
}
EOF

cat > modules/stripe.sh << 'EOF'
#!/bin/bash
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"
test_connection() {
  RESP=$(curl -s -X POST "$SHOP_URL/api/payments/create-checkout" \
    -H "Content-Type: application/json" \
    -d '{"paymentMethod":"card","reference":"test","shipping":4.99,"total":34.98,"items":[{"name":"Test","size":"M","price":29.99,"quantity":1}]}')
  echo "$RESP" | grep -q "stripe_checkout_created" && echo "OK Stripe aktiv" || echo "FAIL Stripe Problem"
}
webhook_setup() {
  echo "Webhook URL: $SHOP_URL/api/webhooks/stripe"
  echo "Event: checkout.session.completed"
}
EOF

cat > modules/deploy.sh << 'EOF'
#!/bin/bash
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"
run_deploy() {
  cd "$PROJECT_DIR"
  git add .
  git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" || true
  git push || true
  npx vercel --prod
}
EOF

cat > modules/audit.sh << 'EOF'
#!/bin/bash
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"
run_audit() {
  npm run build > /dev/null 2>&1 && echo "OK Build" || echo "FAIL Build"
  [ -f "$PROJECT_DIR/middleware.ts" ] && echo "OK middleware" || echo "FEHLT middleware"
  curl -s -o /dev/null -w "Live: %{http_code}" "$SHOP_URL"
  echo ""
}
EOF

cat > modules/health.sh << 'EOF'
#!/bin/bash
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"
run_healthcheck() {
  for route in "/" "/product/1" "/cart" "/admin" "/admin/orders"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$SHOP_URL$route")
    echo "$STATUS $route"
  done
}
EOF

cat > modules/env.sh << 'EOF'
#!/bin/bash
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"
check_environment() {
  for VAR in STRIPE_SECRET_KEY NEXT_PUBLIC_SITE_URL ADMIN_PASSWORD STRIPE_WEBHOOK_SECRET; do
    grep -q "^${VAR}=" "$PROJECT_DIR/.env.local" 2>/dev/null && echo "OK $VAR" || echo "FEHLT $VAR"
  done
}
EOF

cat > modules/orders.sh << 'EOF'
#!/bin/bash
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"
report() {
  echo "Orders Admin: $SHOP_URL/admin/orders"
  echo "Persistenz: LocalStorage (Supabase geplant)"
}
EOF

chmod +x modules/*.sh
ok "Alle Module erstellt"

# ============================================================
# FIX 5: Env Variablen setzen
# ============================================================
info "Fix 5: Env Variablen setzen..."

if ! grep -q "^NEXT_PUBLIC_SITE_URL=" .env.local 2>/dev/null; then
  echo "NEXT_PUBLIC_SITE_URL=https://platypus-shirt-shop.vercel.app" >> .env.local
  ok "NEXT_PUBLIC_SITE_URL gesetzt"
fi

if ! grep -q "^ADMIN_PASSWORD=" .env.local 2>/dev/null; then
  echo "ADMIN_PASSWORD=platypus2024" >> .env.local
  ok "ADMIN_PASSWORD gesetzt (platypus2024)"
fi

# ============================================================
# BUILD TEST
# ============================================================
info "Build wird getestet..."
if npm run build > /tmp/fix-build.log 2>&1; then
  ok "BUILD ERFOLGREICH"
else
  echo "Build Fehler:"
  tail -20 /tmp/fix-build.log
  exit 1
fi

# ============================================================
# DEPLOY
# ============================================================
info "Deploy wird gestartet..."
git add .
git commit -m "fix: stripe api version, middleware, admin orders, modules" || true
npx vercel --prod

echo ""
echo "================================================"
echo "  ALLE FIXES ANGEWENDET"
echo "================================================"
echo ""
echo "Was gefixt wurde:"
echo "  OK  Stripe API Version (2026-04-22.dahlia)"
echo "  OK  middleware.ts (Admin Auth)"
echo "  OK  /admin/orders Seite (war 404)"
echo "  OK  Alle Module erstellt"
echo "  OK  Env Variablen gesetzt"
echo ""
echo "Admin Passwort: platypus2024"
echo "Live:           https://platypus-shirt-shop.vercel.app"

