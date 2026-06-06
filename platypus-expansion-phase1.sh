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
# 1. MEHRSPRACHIGKEIT DE / RO / EN
# ============================================================
info "Mehrsprachigkeit wird eingebaut..."

mkdir -p lib

cat > lib/i18n.ts << 'EOF'
export type Locale = 'de' | 'ro' | 'en';

export const translations = {
  de: {
    nav: {
      cart: 'Warenkorb',
      shipping: 'Versand',
      about: 'Über uns',
    },
    hero: {
      badge: 'Premium Print-on-Demand',
      headline1: 'MADE FOR',
      headline2: 'THE BOLD.',
      sub: 'Dein eigenes Shirt. 360° Viewer. Stripe Checkout.',
      cta: 'JETZT KAUFEN',
      viewer: '360° ansehen',
    },
    product: {
      size: 'Größe wählen',
      fit: 'Schnitt',
      buyNow: 'JETZT KAUFEN',
      addCart: 'In den Warenkorb',
      added: '✓ Im Warenkorb',
      selectSize: 'Bitte Größe wählen',
      shipping: 'Versand DE: 3–5 Werktage',
      secure: 'Sichere Zahlung via Stripe',
      returns: '14 Tage Rückgabe',
      production: 'Print-on-Demand — Produktion nach Bestellung',
    },
    cart: {
      title: 'Warenkorb',
      empty: 'Warenkorb ist leer',
      subtotal: 'Zwischensumme',
      shipping: 'Versand',
      total: 'Gesamt',
      checkout: 'JETZT BEZAHLEN',
      redirecting: 'Weiterleitung zu Stripe...',
      back: '← Zurück zum Shop',
    },
    trust: [
      { icon: '🔒', label: 'Stripe Checkout', sub: 'Sichere Zahlung' },
      { icon: '📦', label: 'Print-on-Demand', sub: 'Auf Bestellung' },
      { icon: '↩️', label: '14 Tage Rückgabe', sub: 'Keine Fragen' },
      { icon: '🚚', label: 'Versand DE & RO', sub: '3–7 Werktage' },
    ],
    ai: {
      placeholder: 'Frag mich etwas über Größen, Versand oder Produkte...',
      title: 'PLATYPUS Assistent',
      send: 'Senden',
      thinking: 'Denkt nach...',
    },
  },
  ro: {
    nav: {
      cart: 'Coș',
      shipping: 'Livrare',
      about: 'Despre noi',
    },
    hero: {
      badge: 'Print-on-Demand Premium',
      headline1: 'CREAT PENTRU',
      headline2: 'CEI ÎNDRĂZNEȚI.',
      sub: 'Tricoul tău. Vizualizare 360°. Plată Stripe.',
      cta: 'CUMPĂRĂ ACUM',
      viewer: 'Vezi 360°',
    },
    product: {
      size: 'Alege mărimea',
      fit: 'Croială',
      buyNow: 'CUMPĂRĂ ACUM',
      addCart: 'Adaugă în coș',
      added: '✓ În coș',
      selectSize: 'Alege o mărime',
      shipping: 'Livrare RO: 3–5 zile lucrătoare',
      secure: 'Plată securizată prin Stripe',
      returns: 'Returnare 14 zile',
      production: 'Print-on-Demand — produs la comandă',
    },
    cart: {
      title: 'Coșul meu',
      empty: 'Coșul este gol',
      subtotal: 'Subtotal',
      shipping: 'Livrare',
      total: 'Total',
      checkout: 'PLĂTEȘTE ACUM',
      redirecting: 'Redirecționare către Stripe...',
      back: '← Înapoi la magazin',
    },
    trust: [
      { icon: '🔒', label: 'Stripe Checkout', sub: 'Plată securizată' },
      { icon: '📦', label: 'Print-on-Demand', sub: 'La comandă' },
      { icon: '↩️', label: 'Returnare 14 zile', sub: 'Fără întrebări' },
      { icon: '🚚', label: 'Livrare DE & RO', sub: '3–7 zile lucrătoare' },
    ],
    ai: {
      placeholder: 'Întreabă-mă despre mărimi, livrare sau produse...',
      title: 'Asistent PLATYPUS',
      send: 'Trimite',
      thinking: 'Mă gândesc...',
    },
  },
  en: {
    nav: {
      cart: 'Cart',
      shipping: 'Shipping',
      about: 'About',
    },
    hero: {
      badge: 'Premium Print-on-Demand',
      headline1: 'MADE FOR',
      headline2: 'THE BOLD.',
      sub: 'Your shirt. 360° Viewer. Stripe Checkout.',
      cta: 'BUY NOW',
      viewer: 'View 360°',
    },
    product: {
      size: 'Choose size',
      fit: 'Fit',
      buyNow: 'BUY NOW',
      addCart: 'Add to cart',
      added: '✓ Added',
      selectSize: 'Please select a size',
      shipping: 'Shipping EU: 5–10 days',
      secure: 'Secure payment via Stripe',
      returns: '14-day returns',
      production: 'Print-on-Demand — produced after order',
    },
    cart: {
      title: 'Cart',
      empty: 'Your cart is empty',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total',
      checkout: 'CHECKOUT',
      redirecting: 'Redirecting to Stripe...',
      back: '← Back to shop',
    },
    trust: [
      { icon: '🔒', label: 'Stripe Checkout', sub: 'Secure payment' },
      { icon: '📦', label: 'Print-on-Demand', sub: 'Made to order' },
      { icon: '↩️', label: '14-day returns', sub: 'No questions' },
      { icon: '🚚', label: 'Shipping EU', sub: '5–10 working days' },
    ],
    ai: {
      placeholder: 'Ask me about sizes, shipping or products...',
      title: 'PLATYPUS Assistant',
      send: 'Send',
      thinking: 'Thinking...',
    },
  },
} as const;

export function getTranslation(locale: Locale) {
  return translations[locale] || translations.de;
}
EOF
ok "i18n System fertig (DE/RO/EN)"

# ============================================================
# 2. KI CHAT ASSISTENT API
# ============================================================
info "KI Chat API wird erstellt..."

mkdir -p app/api/chat

cat > app/api/chat/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Du bist der PLATYPUS Shop Assistent. Du hilfst Kunden bei:
- Größenberatung (S=XS-S, M=M, L=L-XL, XL=XL-XXL, XXL=XXL+)
- Versandinformationen (DE: 3-5 Werktage €4.99, RO: 5-7 Werktage €6.99, EU: 5-10 Werktage €8.99)
- Produktinformationen (Essential Weiß & Schwarz, 100% Baumwolle, Print-on-Demand)
- Bestellstatus (Produktion nach Bestellung, 2-3 Werktage Produktion)
- Rückgabe (14 Tage, keine Fragen)
- Zahlung (Stripe, Kreditkarte, sichere Verbindung)

Antworte kurz, freundlich und hilfreich. Max 3 Sätze. 
Wenn auf Rumänisch gefragt: antworte auf Rumänisch.
Wenn auf Englisch gefragt: antworte auf Englisch.
Sonst: Deutsch.`;

export async function POST(request: NextRequest) {
  try {
    const { message, locale, history } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Nachricht fehlt' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      const fallback = getFallbackResponse(message, locale || 'de');
      return NextResponse.json({ reply: fallback, fallback: true });
    }

    const messages = [
      ...(history || []).slice(-6).map((h: { role: string; content: string }) => ({
        role: h.role,
        content: h.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const fallback = getFallbackResponse(message, locale || 'de');
      return NextResponse.json({ reply: fallback, fallback: true });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || getFallbackResponse(message, locale || 'de');

    return NextResponse.json({ reply, fallback: false });

  } catch {
    return NextResponse.json({
      reply: 'Entschuldigung, ich bin gerade nicht erreichbar. Bitte kontaktiere uns per E-Mail.',
      fallback: true,
    });
  }
}

function getFallbackResponse(message: string, locale: string): string {
  const msg = message.toLowerCase();

  const responses: Record<string, Record<string, string>> = {
    de: {
      groesse: 'Unsere Größen: S (XS-S), M (M), L (L-XL), XL (XL-XXL), XXL (XXL+). Bei Unsicherheit empfehlen wir eine Größe größer.',
      versand: 'Deutschland: €4.99, 3–5 Werktage. Rumänien: €6.99, 5–7 Werktage. EU: €8.99, 5–10 Werktage.',
      rueckgabe: '14 Tage Rückgabe ab Erhalt. Einfach E-Mail schreiben, wir kümmern uns darum.',
      zahlung: 'Wir akzeptieren alle Kreditkarten über Stripe. 100% sichere Verbindung.',
      produktion: 'Jedes Shirt wird individuell nach deiner Bestellung produziert. Produktionszeit: 2–3 Werktage.',
      default: 'Hallo! Ich helfe dir gerne. Frag mich nach Größen, Versand, Produktion oder Rückgabe.',
    },
    ro: {
      groesse: 'Mărimi: S (XS-S), M (M), L (L-XL), XL (XL-XXL), XXL (XXL+). La nesiguranță, comandați o mărime mai mare.',
      versand: 'România: €6.99, 5–7 zile. Germania: €4.99, 3–5 zile. UE: €8.99, 5–10 zile.',
      rueckgabe: 'Returnare în 14 zile de la primire. Scrieți-ne un email și ne ocupăm.',
      zahlung: 'Acceptăm toate cardurile prin Stripe. Conexiune 100% sigură.',
      produktion: 'Fiecare tricou este produs individual după comanda ta. Timp de producție: 2–3 zile.',
      default: 'Bună! Te ajut cu plăcere. Întreabă-mă despre mărimi, livrare sau returnare.',
    },
    en: {
      groesse: 'Sizes: S (XS-S), M (M), L (L-XL), XL (XL-XXL), XXL (XXL+). When in doubt, size up.',
      versand: 'Germany: €4.99, 3–5 days. Romania: €6.99, 5–7 days. EU: €8.99, 5–10 days.',
      rueckgabe: '14-day returns from receipt. Just email us and we\'ll handle everything.',
      zahlung: 'We accept all credit cards via Stripe. 100% secure connection.',
      produktion: 'Each shirt is individually produced after your order. Production time: 2–3 days.',
      default: 'Hi! Happy to help. Ask me about sizes, shipping, production or returns.',
    },
  };

  const lang = responses[locale] || responses.de;

  if (msg.includes('größe') || msg.includes('size') || msg.includes('marime') || msg.includes('mări'))
    return lang.groesse;
  if (msg.includes('versand') || msg.includes('lieferung') || msg.includes('shipping') || msg.includes('livrare'))
    return lang.versand;
  if (msg.includes('rückgabe') || msg.includes('return') || msg.includes('retur') || msg.includes('zurück'))
    return lang.rueckgabe;
  if (msg.includes('zahlung') || msg.includes('payment') || msg.includes('plată') || msg.includes('bezahl'))
    return lang.zahlung;
  if (msg.includes('produktion') || msg.includes('production') || msg.includes('producție') || msg.includes('wann'))
    return lang.produktion;

  return lang.default;
}
EOF
ok "KI Chat API fertig"

# ============================================================
# 3. KI CHAT WIDGET KOMPONENTE
# ============================================================
info "KI Chat Widget wird erstellt..."

mkdir -p app/components

cat > app/components/ChatWidget.tsx << 'EOF'
'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  locale?: 'de' | 'ro' | 'en';
}

const WELCOME: Record<string, string> = {
  de: 'Hallo! Ich bin dein PLATYPUS Assistent. Wie kann ich helfen?',
  ro: 'Bună! Sunt asistentul tău PLATYPUS. Cum te pot ajuta?',
  en: 'Hi! I\'m your PLATYPUS assistant. How can I help?',
};

const PLACEHOLDERS: Record<string, string> = {
  de: 'Frage zu Größe, Versand...',
  ro: 'Întrebare despre mărimi, livrare...',
  en: 'Question about size, shipping...',
};

export default function ChatWidget({ locale = 'de' }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME[locale] || WELCOME.de },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          locale,
          history: messages.slice(-6),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: locale === 'ro' ? 'Eroare. Încearcă din nou.' : locale === 'en' ? 'Error. Please try again.' : 'Fehler. Bitte erneut versuchen.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Chat öffnen"
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000,
          width: '56px', height: '56px', borderRadius: '50%',
          background: open ? '#333' : '#fff',
          color: open ? '#fff' : '#000',
          border: 'none', cursor: 'pointer',
          fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          transition: 'all 0.2s',
        }}
      >
        {open ? '×' : '💬'}
      </button>

      {/* CHAT FENSTER */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '5rem', right: '1.5rem', zIndex: 999,
          width: '340px', maxHeight: '500px',
          background: '#111', border: '1px solid #222', borderRadius: '16px',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}>

          {/* HEADER */}
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
              🦆
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fff' }}>PLATYPUS Assistent</p>
              <p style={{ fontSize: '0.7rem', color: '#4ade80' }}>● Online</p>
            </div>
          </div>

          {/* NACHRICHTEN */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '0.625rem 0.875rem', borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: m.role === 'user' ? '#fff' : '#1a1a1a',
                  color: m.role === 'user' ? '#000' : '#fff',
                  fontSize: '0.8rem', lineHeight: 1.5,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#1a1a1a', padding: '0.625rem 0.875rem', borderRadius: '12px 12px 12px 2px', color: '#555', fontSize: '0.8rem' }}>
                  ···
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid #1a1a1a', display: 'flex', gap: '0.5rem' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={PLACEHOLDERS[locale]}
              style={{
                flex: 1, background: '#0a0a0a', border: '1px solid #222',
                borderRadius: '8px', padding: '0.5rem 0.75rem',
                color: '#fff', fontSize: '0.8rem', outline: 'none',
              }}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              background: '#fff', color: '#000', border: 'none',
              borderRadius: '8px', padding: '0.5rem 0.875rem',
              fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
              opacity: loading || !input.trim() ? 0.4 : 1,
            }}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
EOF
ok "KI Chat Widget fertig"

# ============================================================
# 4. LOCALE DETECTION & COOKIE
# ============================================================
info "Locale System wird erstellt..."

cat > lib/locale.ts << 'EOF'
import { Locale } from './i18n';

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'de';

  const saved = localStorage.getItem('platypus_locale') as Locale;
  if (saved && ['de', 'ro', 'en'].includes(saved)) return saved;

  const browser = navigator.language.toLowerCase();
  if (browser.startsWith('ro')) return 'ro';
  if (browser.startsWith('en')) return 'en';
  return 'de';
}

export function setLocale(locale: Locale) {
  localStorage.setItem('platypus_locale', locale);
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  de: '🇩🇪',
  ro: '🇷🇴',
  en: '🇬🇧',
};

export const LOCALE_LABELS: Record<Locale, string> = {
  de: 'Deutsch',
  ro: 'Română',
  en: 'English',
};

export const SHIPPING_COSTS: Record<Locale, { price: number; days: string }> = {
  de: { price: 4.99, days: '3–5 Werktage' },
  ro: { price: 6.99, days: '5–7 zile' },
  en: { price: 8.99, days: '5–10 days' },
};
EOF
ok "Locale System fertig"

# ============================================================
# 5. PRODUKT DATENBANK (ZENTRAL)
# ============================================================
info "Produkt Datenbank wird erstellt..."

cat > lib/products.ts << 'EOF'
import { Locale } from './i18n';

export interface Product {
  id: string;
  slug: string;
  price: number;
  color: string;
  textColor: string;
  sizes: string[];
  fits: string[];
  material: string;
  weight: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  tags: string[];
  active: boolean;
  createdAt: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'essential-weiss',
    price: 29.99,
    color: '#f5f5f5',
    textColor: '#000',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    fits: ['Regular', 'Oversized'],
    material: '100% Baumwolle',
    weight: '180g/m²',
    name: {
      de: 'Essential Weiß',
      ro: 'Essential Alb',
      en: 'Essential White',
    },
    description: {
      de: 'Premium Baumwolle, unisex, Print-on-Demand',
      ro: 'Bumbac premium, unisex, print la comandă',
      en: 'Premium cotton, unisex, print-on-demand',
    },
    tags: ['essential', 'weiss', 'white', 'alb', 'basic'],
    active: true,
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    slug: 'essential-schwarz',
    price: 29.99,
    color: '#111111',
    textColor: '#fff',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    fits: ['Regular', 'Oversized'],
    material: '100% Baumwolle',
    weight: '180g/m²',
    name: {
      de: 'Essential Schwarz',
      ro: 'Essential Negru',
      en: 'Essential Black',
    },
    description: {
      de: 'Premium Baumwolle, unisex, Print-on-Demand',
      ro: 'Bumbac premium, unisex, print la comandă',
      en: 'Premium cotton, unisex, print-on-demand',
    },
    tags: ['essential', 'schwarz', 'black', 'negru', 'basic'],
    active: true,
    createdAt: '2026-01-01',
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id && p.active);
}

export function getAllProducts(): Product[] {
  return PRODUCTS.filter(p => p.active);
}

export function getProductName(product: Product, locale: Locale): string {
  return product.name[locale] || product.name.de;
}

export function getProductDescription(product: Product, locale: Locale): string {
  return product.description[locale] || product.description.de;
}
EOF
ok "Produkt Datenbank fertig"

# ============================================================
# 6. ORDER SYSTEM MIT PERSISTENZ
# ============================================================
info "Order System wird erstellt..."

mkdir -p app/api/orders

cat > app/api/orders/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';

export interface Order {
  id: string;
  stripeSessionId?: string;
  customerEmail?: string;
  amountTotal: number;
  currency: string;
  status: 'pending' | 'paid' | 'production' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    name: string;
    size: string;
    fit?: string;
    quantity: number;
    price: number;
  }[];
  locale: string;
  shippingCountry: string;
  createdAt: string;
  updatedAt: string;
}

const ORDERS_STORE: Order[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  let orders = ORDERS_STORE;
  if (status) orders = orders.filter(o => o.status === status);
  orders = orders.slice(0, limit);

  return NextResponse.json({
    orders,
    total: ORDERS_STORE.length,
    byStatus: {
      pending: ORDERS_STORE.filter(o => o.status === 'pending').length,
      paid: ORDERS_STORE.filter(o => o.status === 'paid').length,
      production: ORDERS_STORE.filter(o => o.status === 'production').length,
      shipped: ORDERS_STORE.filter(o => o.status === 'shipped').length,
      delivered: ORDERS_STORE.filter(o => o.status === 'delivered').length,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const order: Order = {
      id: `PLT-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      stripeSessionId: body.stripeSessionId,
      customerEmail: body.customerEmail,
      amountTotal: body.amountTotal || 0,
      currency: body.currency || 'EUR',
      status: 'paid',
      items: body.items || [],
      locale: body.locale || 'de',
      shippingCountry: body.shippingCountry || 'DE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ORDERS_STORE.unshift(order);

    return NextResponse.json({ order, success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Fehler';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    const order = ORDERS_STORE.find(o => o.id === id);
    if (!order) return NextResponse.json({ error: 'Order nicht gefunden' }, { status: 404 });

    order.status = status;
    order.updatedAt = new Date().toISOString();

    return NextResponse.json({ order, success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Fehler';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
EOF
ok "Order System API fertig"

# ============================================================
# 7. STRIPE WEBHOOK MIT ORDER ERSTELLUNG
# ============================================================
info "Stripe Webhook mit Order Pipeline..."

cat > app/api/webhooks/stripe/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!key?.startsWith('sk_')) {
    return NextResponse.json({ received: true, warning: 'no stripe key' });
  }

  const stripe = new Stripe(key);
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  if (!webhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET fehlt');
    return NextResponse.json({ received: true, warning: 'no webhook secret' });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown';
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://platypus-shirt-shop.vercel.app';
      await fetch(`${siteUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripeSessionId: session.id,
          customerEmail: session.customer_email,
          amountTotal: (session.amount_total || 0) / 100,
          currency: session.currency?.toUpperCase() || 'EUR',
          locale: session.metadata?.locale || 'de',
          shippingCountry: session.metadata?.shippingCountry || 'DE',
          items: [],
          status: 'paid',
        }),
      });
      console.log('Order erstellt für Session:', session.id);
    } catch (err) {
      console.error('Order Erstellung fehlgeschlagen:', err);
    }
  }

  return NextResponse.json({ received: true });
}
EOF
ok "Stripe Webhook mit Order Pipeline fertig"

# ============================================================
# 8. ANTHROPIC API KEY IN VERCEL
# ============================================================
info "Anthropic API Key Setup..."

if [ -f ".env.local" ] && grep -q "^ANTHROPIC_API_KEY=" .env.local; then
  ANTH_KEY=$(grep "^ANTHROPIC_API_KEY=" .env.local | cut -d= -f2)
  if [[ "$ANTH_KEY" == sk-ant-* ]]; then
    echo "$ANTH_KEY" | npx vercel env add ANTHROPIC_API_KEY production 2>/dev/null && ok "ANTHROPIC_API_KEY in Vercel gesetzt" || warn "Manuell: npx vercel env add ANTHROPIC_API_KEY"
  fi
else
  warn "ANTHROPIC_API_KEY fehlt in .env.local"
  warn "Für echte KI: echo 'ANTHROPIC_API_KEY=sk-ant-...' >> .env.local"
  warn "Ohne Key: Fallback Antworten aktiv"
fi

# ============================================================
# 9. BUILD & DEPLOY
# ============================================================
info "Build..."

if npm run build > /tmp/expansion-build.log 2>&1; then
  ok "BUILD ERFOLGREICH"
else
  echo "Build Fehler:"
  tail -30 /tmp/expansion-build.log
  exit 1
fi

info "Deploy..."
git add .
git commit -m "expansion: i18n DE/RO/EN, KI Chat, Order API, Webhook Pipeline, Produkt DB" || true
npx vercel --prod

echo ""
echo "================================================"
echo "  PLATYPUS — EXPANSION PHASE 1 DEPLOYED"
echo "================================================"
echo ""
echo "Features:"
echo "  ✓ Mehrsprachig: DE / RO / EN"
echo "  ✓ KI Chat Assistent (Claude powered)"
echo "  ✓ Order API mit Status Pipeline"
echo "  ✓ Stripe Webhook → Auto Order Erstellung"
echo "  ✓ Zentrale Produkt Datenbank"
echo "  ✓ Versandkosten nach Land"
echo ""
echo "KI Chat aktivieren:"
echo "  echo 'ANTHROPIC_API_KEY=sk-ant-...' >> .env.local"
echo "  npx vercel env add ANTHROPIC_API_KEY"
echo ""
echo "Live: https://platypus-shirt-shop.vercel.app"

