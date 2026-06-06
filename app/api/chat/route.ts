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
