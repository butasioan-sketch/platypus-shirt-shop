import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Du bist der Platypus Concierge — Premium-Berater für PLATYPUS On Me.
Du hilfst bei:
- Größen (Unisex S, M, L, XL, XXL — im Zweifel größer wählen)
- Versand (DE: Hermes ab €4,49 / DPD €4,79 / DHL €4,99, 3–5 Werktage; RO: ab €12,99, 5–7 Werktage)
- Produkt (AirFit Pro, Performance-Polyester 140 g/m², aktuell Weiß, Maßanfertigung auf Bestellung)
- Atelier (Motiv hochladen vorne & hinten, 210 × 297 mm, Sublimation in die Faser)
- Fertigung (2–3 Werktage nach Bestellung)
- Reklamation (individuelle Fertigung: kein Widerruf § 312g BGB, Ersatz bei Druckfehlern/Mängeln)
- Zahlung (Stripe: Karte, PayPal, Klarna)

Ton: elegant, knapp, premium. Max 3 Sätze. Kein „Print-on-Demand“ — sage „Maßanfertigung“.
Rumänisch gefragt → Rumänisch. Englisch → Englisch. Sonst Deutsch.`;

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
      versand: 'Deutschland: ab €4.49 (Hermes), €4.79 (DPD) oder €4.99 (DHL), 3–5 Werktage. Rumänien: ab €12.99, 5–7 Werktage.',
      rueckgabe: 'Da jedes Shirt individuell bedruckt wird, ist ein Widerruf gesetzlich ausgeschlossen (§ 312g BGB). Bei Druckfehlern oder Beschädigung ersetzen wir dein Shirt kostenlos — schreib uns einfach eine E-Mail mit Foto.',
      zahlung: 'Wir akzeptieren alle Kreditkarten über Stripe. 100% sichere Verbindung.',
      produktion: 'Jedes Piece wird maßgefertigt nach deiner Bestellung. Fertigung: 2–3 Werktage.',
      default: 'Willkommen beim Platypus Concierge. Frag mich zu Größe, Versand, Atelier oder Qualität.',
    },
    ro: {
      groesse: 'Mărimi: S (XS-S), M (M), L (L-XL), XL (XL-XXL), XXL (XXL+). La nesiguranță, comandați o mărime mai mare.',
      versand: 'România: de la €12.99, 5–7 zile. Germania: de la €4.49, 3–5 zile.',
      rueckgabe: 'Deoarece fiecare tricou este imprimat individual, retragerea este exclusă legal. La defecte de imprimare sau deteriorare, înlocuim tricoul gratuit — trimiteți-ne un email cu o poză.',
      zahlung: 'Acceptăm toate cardurile prin Stripe. Conexiune 100% sigură.',
      produktion: 'Fiecare tricou este produs individual după comanda ta. Timp de producție: 2–3 zile.',
      default: 'Bună! Te ajut cu plăcere. Întreabă-mă despre mărimi, livrare sau reclamații.',
    },
    en: {
      groesse: 'Sizes: S (XS-S), M (M), L (L-XL), XL (XL-XXL), XXL (XXL+). When in doubt, size up.',
      versand: 'Germany: from €4.49, 3–5 business days. Romania: from €12.99, 5–7 business days.',
      rueckgabe: 'Since every shirt is individually printed, returns are legally excluded. For print defects or damage we replace your shirt free of charge — just email us a photo.',
      zahlung: 'We accept all credit cards via Stripe. 100% secure connection.',
      produktion: 'Each shirt is individually produced after your order. Production time: 2–3 days.',
      default: 'Hi! Happy to help. Ask me about sizes, shipping, production or quality claims.',
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
