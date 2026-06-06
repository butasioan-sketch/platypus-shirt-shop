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
# 1. STRIPE SECRET KEY in .env.local prüfen & reparieren
# ============================================================
info "Prüfe Stripe Key..."

if grep -q "^STRIPE_SECRET_KEY=" .env.local 2>/dev/null; then
  KEY=$(grep "^STRIPE_SECRET_KEY=" .env.local | cut -d= -f2)
  if [[ "$KEY" == sk_test_* ]] || [[ "$KEY" == sk_live_* ]]; then
    ok "STRIPE_SECRET_KEY vorhanden: ${KEY:0:14}..."
  else
    warn "STRIPE_SECRET_KEY ist ungültig: $KEY"
    warn "Bitte echten Key eintragen in .env.local"
  fi
else
  warn "STRIPE_SECRET_KEY fehlt in .env.local"
  warn "Trage deinen Stripe Test Key ein:"
  warn "  echo 'STRIPE_SECRET_KEY=sk_test_XXXXX' >> .env.local"
fi

# ============================================================
# 2. KOMPLETTE HOMEPAGE mit Platypus Branding
# ============================================================
info "Homepage wird erneuert..."

cat > app/page.tsx << 'EOF'
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const PRODUCTS = [
  {
    id: '1',
    name: 'Essential Weiß',
    price: 29.99,
    description: 'Premium Baumwolle, 360° Viewer',
    color: '#f5f5f5',
    textColor: '#000',
  },
  {
    id: '2',
    name: 'Essential Schwarz',
    price: 29.99,
    description: 'Premium Baumwolle, 360° Viewer',
    color: '#111',
    textColor: '#fff',
  },
];

export default function HomePage() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('platypus_cart') || '[]');
      setCartCount(cart.reduce((s: number, i: { quantity?: number }) => s + (i.quantity || 1), 0));
    } catch { setCartCount(0); }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* HEADER */}
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#0a0a0a', zIndex: 100 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</div>
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/versand" style={{ color: '#888', textDecoration: 'none', fontSize: '0.875rem' }}>Versand</Link>
          <Link href="/impressum" style={{ color: '#888', textDecoration: 'none', fontSize: '0.875rem' }}>Impressum</Link>
          <Link href="/cart" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.875rem', background: '#1a1a1a', padding: '0.4rem 1rem', borderRadius: '999px', border: '1px solid #333' }}>
            Warenkorb {cartCount > 0 && `(${cartCount})`}
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ color: '#666', fontSize: '0.75rem', letterSpacing: '0.3em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Premium Print-on-Demand</p>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
          MADE FOR<br />
          <span style={{ color: '#444' }}>THE BOLD.</span>
        </h1>
        <p style={{ color: '#666', fontSize: '1.125rem', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>
          Eigene T-Shirts. 360° Viewer. Stripe Checkout. Produktion auf Bestellung.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/product/1" style={{ background: '#fff', color: '#000', padding: '0.875rem 2.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em' }}>
            JETZT KAUFEN
          </Link>
          <Link href="/product/1" style={{ background: 'transparent', color: '#fff', padding: '0.875rem 2.5rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', border: '1px solid #333' }}>
            360° Viewer
          </Link>
        </div>
      </section>

      {/* PRODUKTE */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '0.75rem', letterSpacing: '0.3em', color: '#555', marginBottom: '2rem', textTransform: 'uppercase' }}>Kollektion</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {PRODUCTS.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#333')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a1a1a')}>
                <div style={{ height: '280px', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', color: p.textColor }}>
                    <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>👕</div>
                    <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', opacity: 0.5, textTransform: 'uppercase' }}>360° Viewer</p>
                  </div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ color: '#fff', fontWeight: 700, marginBottom: '0.25rem' }}>{p.name}</p>
                      <p style={{ color: '#555', fontSize: '0.8rem' }}>{p.description}</p>
                    </div>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.125rem' }}>€{p.price}</p>
                  </div>
                  <div style={{ marginTop: '1.25rem', background: '#fff', color: '#000', padding: '0.625rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                    JETZT KAUFEN
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid #111', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {[
            { icon: '🔒', label: 'Stripe Checkout', sub: 'Sichere Zahlung' },
            { icon: '📦', label: 'Print-on-Demand', sub: 'Auf Bestellung' },
            { icon: '↩️', label: '14 Tage Rückgabe', sub: 'Keine Fragen' },
            { icon: '🚚', label: 'Versand DE', sub: '3–5 Werktage' },
          ].map((t) => (
            <div key={t.label}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t.icon}</div>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{t.label}</p>
              <p style={{ color: '#555', fontSize: '0.75rem' }}>{t.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #111', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#333', fontSize: '0.75rem', marginBottom: '1rem', letterSpacing: '0.2em' }}>PLATYPUS — Premium Print-on-Demand</p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['Impressum', '/impressum'], ['Datenschutz', '/datenschutz'], ['AGB', '/agb'], ['Versand', '/versand']].map(([label, href]) => (
            <Link key={href} href={href} style={{ color: '#444', textDecoration: 'none', fontSize: '0.75rem' }}>{label}</Link>
          ))}
        </div>
      </footer>

    </div>
  );
}
EOF
ok "Homepage fertig"

# ============================================================
# 3. PRODUKTSEITE AUFRÄUMEN (kompakt, kaufbar)
# ============================================================
info "Produktseite wird vereinfacht..."

mkdir -p app/product/\[id\]

cat > "app/product/[id]/page.tsx" << 'EOF'
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const Viewer = dynamic(() => import('@/app/components/Viewer/Viewer'), { ssr: false });

const PRODUCTS: Record<string, { name: string; price: number; color: string; sizes: string[] }> = {
  '1': { name: 'Essential Weiß', price: 29.99, color: '#f5f5f5', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  '2': { name: 'Essential Schwarz', price: 29.99, color: '#111111', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
};

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const product = PRODUCTS[id] || PRODUCTS['1'];

  const [size, setSize] = useState('');
  const [fit, setFit] = useState('Regular');
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const addToCart = () => {
    if (!size) { setError('Bitte Größe wählen'); return; }
    setError('');
    try {
      const cart = JSON.parse(localStorage.getItem('platypus_cart') || '[]');
      const existing = cart.findIndex((i: { id: string; size: string }) => i.id === id && i.size === size);
      if (existing >= 0) {
        cart[existing].quantity = (cart[existing].quantity || 1) + 1;
      } else {
        cart.push({ id, name: product.name, price: product.price, size, fit, quantity: 1 });
      }
      localStorage.setItem('platypus_cart', JSON.stringify(cart));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch { setError('Fehler beim Hinzufügen'); }
  };

  const buyNow = async () => {
    if (!size) { setError('Bitte Größe wählen'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'card',
          reference: `PROD-${id}-${size}`,
          shipping: 4.99,
          total: product.price + 4.99,
          items: [{ name: product.name, size, price: product.price, quantity: 1 }],
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError('Checkout Fehler. Bitte erneut versuchen.');
      }
    } catch {
      setError('Verbindungsfehler.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* HEADER */}
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</Link>
        <Link href="/cart" style={{ color: '#888', textDecoration: 'none', fontSize: '0.875rem' }}>Warenkorb</Link>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>

        {/* VIEWER */}
        <div style={{ background: product.color, borderRadius: '16px', overflow: 'hidden', height: '500px', position: 'sticky', top: '5rem' }}>
          <Viewer />
        </div>

        {/* KAUFBEREICH */}
        <div>
          <p style={{ color: '#555', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Premium T-Shirt</p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{product.name}</h1>
          <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>€{product.price}</p>

          {/* GRÖSSE */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Größe wählen</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} style={{
                  padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                  background: size === s ? '#fff' : '#111',
                  color: size === s ? '#000' : '#888',
                  border: size === s ? '1px solid #fff' : '1px solid #222',
                  transition: 'all 0.15s',
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* FIT */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Schnitt</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['Regular', 'Oversized'].map((f) => (
                <button key={f} onClick={() => setFit(f)} style={{
                  padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem',
                  background: fit === f ? '#fff' : '#111',
                  color: fit === f ? '#000' : '#888',
                  border: fit === f ? '1px solid #fff' : '1px solid #222',
                }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}

          {/* BUTTONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            <button onClick={buyNow} disabled={loading} style={{
              background: '#fff', color: '#000', padding: '1rem', borderRadius: '12px',
              fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none', letterSpacing: '0.05em', opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Weiterleitung...' : 'JETZT KAUFEN — €' + (product.price + 4.99).toFixed(2)}
            </button>
            <button onClick={addToCart} style={{
              background: '#111', color: added ? '#4ade80' : '#fff', padding: '1rem', borderRadius: '12px',
              fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
              border: '1px solid #333', letterSpacing: '0.05em',
            }}>
              {added ? '✓ Im Warenkorb' : '+ In den Warenkorb'}
            </button>
          </div>

          {/* INFO */}
          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1.5rem' }}>
            {[
              ['🔒', 'Sichere Zahlung via Stripe'],
              ['📦', 'Print-on-Demand — Produktion nach Bestellung'],
              ['🚚', 'Versand DE: 3–5 Werktage (+€4.99)'],
              ['↩️', '14 Tage Rückgabe'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem' }}>{icon}</span>
                <span style={{ color: '#666', fontSize: '0.8rem' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE STICKY CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1rem', background: '#0a0a0a', borderTop: '1px solid #1a1a1a', display: 'none' }}>
        <button onClick={buyNow} style={{ width: '100%', background: '#fff', color: '#000', padding: '1rem', borderRadius: '12px', fontWeight: 800, border: 'none', fontSize: '1rem' }}>
          KAUFEN — €{(product.price + 4.99).toFixed(2)}
        </button>
      </div>

    </div>
  );
}
EOF
ok "Produktseite fertig"

# ============================================================
# 4. WARENKORB SEITE
# ============================================================
info "Warenkorb wird erstellt..."

mkdir -p app/cart

cat > app/cart/page.tsx << 'EOF'
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  fit?: string;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('platypus_cart') || '[]');
      setItems(cart);
    } catch { setItems([]); }
  }, []);

  const remove = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    localStorage.setItem('platypus_cart', JSON.stringify(updated));
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = items.length > 0 ? 4.99 : 0;
  const total = subtotal + shipping;

  const checkout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'card',
          reference: `CART-${Date.now()}`,
          shipping,
          total,
          items: items.map(i => ({ name: i.name, size: i.size, price: i.price, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        localStorage.removeItem('platypus_cart');
        window.location.href = data.redirectUrl;
      } else {
        setError('Checkout Fehler. Bitte erneut versuchen.');
      }
    } catch {
      setError('Verbindungsfehler.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em' }}>PLATYPUS</Link>
        <span style={{ color: '#555', fontSize: '0.875rem' }}>Warenkorb</span>
      </header>

      <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Warenkorb</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#555' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Warenkorb ist leer</p>
            <Link href="/" style={{ color: '#fff', fontSize: '0.875rem' }}>← Zurück zum Shop</Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {items.map((item, i) => (
                <div key={i} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{item.name}</p>
                    <p style={{ color: '#666', fontSize: '0.8rem' }}>Größe: {item.size} | {item.fit || 'Regular'} | Menge: {item.quantity}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <p style={{ fontWeight: 700 }}>€{(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1.25rem' }}>×</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#888' }}>
                <span>Zwischensumme</span><span>€{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#888' }}>
                <span>Versand</span><span>€{shipping.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem' }}>
                <span>Gesamt</span><span>€{total.toFixed(2)}</span>
              </div>
            </div>

            {error && <p style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}

            <button onClick={checkout} disabled={loading} style={{
              width: '100%', background: '#fff', color: '#000', padding: '1.1rem',
              borderRadius: '12px', fontWeight: 800, fontSize: '1rem',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, letterSpacing: '0.05em',
            }}>
              {loading ? 'Weiterleitung zu Stripe...' : `JETZT BEZAHLEN — €${total.toFixed(2)}`}
            </button>

            <p style={{ textAlign: 'center', color: '#555', fontSize: '0.75rem', marginTop: '1rem' }}>
              🔒 Sichere Zahlung via Stripe
            </p>
          </>
        )}
      </div>
    </div>
  );
}
EOF
ok "Warenkorb fertig"

# ============================================================
# 5. BUILD & DEPLOY
# ============================================================
info "Build wird gestartet..."

if npm run build > /tmp/complete-build.log 2>&1; then
  ok "BUILD ERFOLGREICH"
else
  echo "Build Fehler:"
  tail -25 /tmp/complete-build.log
  exit 1
fi

info "Git commit & Deploy..."
git add .
git commit -m "feat: neue Homepage, Produktseite, Warenkorb, Admin Orders, alle Module" || true
npx vercel --prod

echo ""
echo "================================================"
echo "  PLATYPUS — KOMPLETT DEPLOYED"
echo "================================================"
echo ""
echo "Live:          https://platypus-shirt-shop.vercel.app"
echo "Admin:         https://platypus-shirt-shop.vercel.app/admin"
echo "Orders:        https://platypus-shirt-shop.vercel.app/admin/orders"
echo "Admin PW:      platypus2024"
echo ""
echo "Nächste Schritte:"
echo "  1. Echten Stripe Key in .env.local eintragen"
echo "  2. npx vercel env add STRIPE_SECRET_KEY"
echo "  3. npx vercel env add ADMIN_PASSWORD"
echo "  4. Testkauf durchführen"

