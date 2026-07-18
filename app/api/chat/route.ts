import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Du bist der Platypus Concierge — Premium-Berater für PLATYPUS On Me.

PRODUKTE:
- AirFit Pro (LIVE, einziges Produkt im Shop): AirFit Performance Fabric — Performance-Polyester-Strick, 140 g/m², sublimationsgeeignet. Aktuell nur Weiß. Unisex S/M/L/XL/XXL, im Zweifel eine Größe größer.
- Shorts, Herren-Boxer, Damen-Boxer: NUR künftig geplant, NOCH NICHT im Shop, KEINE Specs/Preise vorhanden. Ehrlich antworten: „kommt bald, aktuell noch nicht bestellbar" — niemals Preise oder Maße dafür erfinden.

MATERIAL: AirFit Performance Fabric — leicht, schnelltrocknend, Motiv wird in die Faser sublimiert (kein Aufkleber, kein Abblättern, kein Verblassen). Technisch: Performance-Polyester-Strick, 140 g/m².

ATELIER (Design-Prozess): Kunde lädt eigenes Motiv hoch (vorne und/oder hinten getrennt, Format 210 × 297 mm / DIN A4). Motiv ist frei auf der gesamten Vorder-/Rückseite verschiebbar und skalierbar — WYSIWYG, was im Editor zu sehen ist, wird genauso gedruckt. Zusätzlich 360°-Ansicht des Shirts, nur manuell drehbar (Ziehen), keine Automatik.

PREIS: Fixpreis €39,99 pro Shirt, unabhängig ob nur eine Seite oder beide Seiten (vorne & hinten) bedruckt werden.

VERSAND: Deutschland ab €4,49 (Hermes) / €4,79 (DPD) / €4,99 (DHL), 3–5 Werktage. Rumänien ab €12,99, 5–7 Werktage. Zusätzlich Fertigungszeit: 2–3 Werktage nach Bestellung, da jedes Piece individuell bedruckt wird.

PFLEGE: Waschen bei 30 °C, auf links gewendet, damit der Druck möglichst lange hält.

MASSANFERTIGUNG: Jedes Piece wird erst nach Bestellung mit dem Kundenmotiv bedruckt — das ist Maßanfertigung/individuelle Fertigung, kein Lagerware-Print-on-Demand-Wording verwenden. Deshalb kein Widerrufsrecht gem. § 312g Abs. 2 Nr. 1 BGB. Bei Druckfehlern oder Mängeln ersetzen wir das Piece kostenlos (Foto per E-Mail genügt).

ZAHLUNG: Stripe — Kreditkarte, PayPal, Klarna, sichere Verbindung.

REGELN:
- Max 3–5 Sätze, Ton elegant/knapp/premium (Benefit-Sprache, kein Chemie-Label zuerst)
- Kein „Print-on-Demand" — immer „Maßanfertigung"/„individuelle Fertigung"
- Nie Preise oder Specs für Shorts/Boxer erfinden — ehrlich „kommt bald" sagen
- Rumänisch gefragt → Rumänisch. Englisch → Englisch. Sonst Deutsch.`;

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
      produktion: 'Jedes Piece wird maßgefertigt nach deiner Bestellung — kein Lagerware-Print-on-Demand. Fertigung: 2–3 Werktage.',
      material: 'AirFit Performance Fabric — leicht, schnelltrocknend, dein Motiv wird in die Faser sublimiert (kein Aufkleber, kein Abblättern). Aktuell nur in Weiß.',
      atelier: 'Im Atelier lädst du dein Motiv hoch (vorne und/oder hinten, 210 × 297 mm) und positionierst/skalierst es frei — was du siehst, wird genauso gedruckt. Die 360°-Ansicht drehst du nur manuell per Ziehen.',
      pflege: 'Waschen bei 30 °C, auf links gewendet — so hält der Druck am längsten.',
      kommendeProdukte: 'Shorts und Boxershorts sind geplant, aber noch nicht im Shop — sobald es Details gibt, siehst du sie hier zuerst.',
      default: 'Willkommen beim Platypus Concierge. Frag mich zu Größe, Material, Atelier, Versand oder Qualität.',
    },
    ro: {
      groesse: 'Mărimi: S (XS-S), M (M), L (L-XL), XL (XL-XXL), XXL (XXL+). La nesiguranță, comandați o mărime mai mare.',
      versand: 'România: de la €12.99, 5–7 zile. Germania: de la €4.49, 3–5 zile.',
      rueckgabe: 'Deoarece fiecare tricou este imprimat individual, retragerea este exclusă legal. La defecte de imprimare sau deteriorare, înlocuim tricoul gratuit — trimiteți-ne un email cu o poză.',
      zahlung: 'Acceptăm toate cardurile prin Stripe. Conexiune 100% sigură.',
      produktion: 'Fiecare tricou este produs individual după comanda ta — nu e marfă de stoc. Timp de producție: 2–3 zile.',
      material: 'AirFit Performance Fabric — ușor, se usucă rapid, designul tău este sublimat în fibră (fără autocolant, fără decojire). Momentan doar alb.',
      atelier: 'În Atelier încarci motivul (față și/sau spate, 210 × 297 mm) și îl poziționezi/scalezi liber — ce vezi, se imprimă exact așa. Vederea 360° se rotește doar manual, prin tragere.',
      pflege: 'Spălare la 30 °C, pe dos — așa ține imprimeul cel mai mult.',
      kommendeProdukte: 'Pantaloni scurți și boxeri sunt planificați, dar încă nu sunt în magazin — vei fi primul care le vede aici.',
      default: 'Bună! Te ajut cu plăcere. Întreabă-mă despre mărimi, material, Atelier, livrare sau reclamații.',
    },
    en: {
      groesse: 'Sizes: S (XS-S), M (M), L (L-XL), XL (XL-XXL), XXL (XXL+). When in doubt, size up.',
      versand: 'Germany: from €4.49, 3–5 business days. Romania: from €12.99, 5–7 business days.',
      rueckgabe: 'Since every shirt is individually printed, returns are legally excluded. For print defects or damage we replace your shirt free of charge — just email us a photo.',
      zahlung: 'We accept all credit cards via Stripe. 100% secure connection.',
      produktion: 'Each shirt is individually made to order — no stock print-on-demand. Production time: 2–3 days.',
      material: 'AirFit Performance Fabric — light, fast-drying, your design is sublimated into the fiber (no sticker, no peeling). Currently white only.',
      atelier: 'In the Studio you upload your design (front and/or back, 210 × 297 mm) and freely position/scale it — what you see is exactly what prints. The 360° view only rotates manually by dragging.',
      pflege: 'Wash at 30 °C, inside out — that keeps the print looking best for longest.',
      kommendeProdukte: "Shorts and boxers are planned but not in the shop yet — you'll see them here first once details are ready.",
      default: 'Hi! Happy to help. Ask me about sizes, material, the Studio, shipping or quality claims.',
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
  if (msg.includes('material') || msg.includes('stoff') || msg.includes('fabric') || msg.includes('polyester') || msg.includes('poliester'))
    return lang.material;
  if (msg.includes('atelier') || msg.includes('studio') || msg.includes('hochladen') || msg.includes('upload') || msg.includes('360') || msg.includes('incarc'))
    return lang.atelier;
  if (msg.includes('pflege') || msg.includes('waschen') || msg.includes('care') || msg.includes('wash') || msg.includes('spăl') || msg.includes('spal'))
    return lang.pflege;
  if (msg.includes('shorts') || msg.includes('boxer') || msg.includes('hose') || msg.includes('pantaloni'))
    return lang.kommendeProdukte;
  if (msg.includes('produktion') || msg.includes('production') || msg.includes('producție') || msg.includes('wann') || msg.includes('maßanfertigung') || msg.includes('print-on-demand'))
    return lang.produktion;

  return lang.default;
}
