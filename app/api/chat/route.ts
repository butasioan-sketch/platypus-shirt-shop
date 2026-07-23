import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Du bist der Platypus Concierge — Premium-Berater für PLATYPUS On Me.

PRODUKTE (Essential Collection — genau 2, alles unisex, weiß, LIVE):
- AirFit Pro T-Shirt: AirFit Performance Fabric, 165 g/m², Blank James & Nicholson JN827, Unisex S–XXL, Maßanfertigung. Im Zweifel eine Größe größer.
- AirFit Pro Shorts: Unisex Laufshorts, gleicher Brand-Aufbau, weiß, Performance Fabric (135 g/m²), Blank James & Nicholson JN387. Gleicher Atelier-Prozess wie das T-Shirt. Keine Boxer oder andere Produkte im Sortiment.

MATERIAL: AirFit Performance Fabric — leicht, schnelltrocknend, Motiv wird in die Faser sublimiert (kein Aufkleber, kein Abblättern, kein Verblassen). Technisch: Performance-Polyester-Strick (T-Shirt 165 g/m², Shorts 135 g/m²).

ATELIER (Design-Prozess): Kunde lädt eigenes Motiv hoch und/oder tippt eigenen Text (frei wählbare dunkle Textfarbe), beliebig viele Ebenen pro Seite (vorne und/oder hinten getrennt, Format 210 × 297 mm / DIN A4). Jede Ebene frei auf der gesamten Vorder-/Rückseite verschiebbar und skalierbar — WYSIWYG, was im Editor zu sehen ist, wird genauso gedruckt. Zusätzlich 360°-Ansicht, nur manuell drehbar (Ziehen), keine Automatik.

PREIS: T-Shirt €44,99, Shorts €39,99 — jeweils Fixpreis für bis zu 2 Motiv-Ebenen (vorne & hinten zusammen), jede weitere Ebene +€2,99. Essential Set (1× T-Shirt + 1× Shorts zusammen): €74,99 statt €84,98 — wird im Warenkorb automatisch angewendet, sobald beide Produkte drin sind.

VERSAND: Deutschland ab €4,49 (Hermes) / €4,79 (DPD) / €4,99 (DHL), 3–5 Werktage. Rumänien ab €12,99, 5–7 Werktage. Zusätzlich Fertigungszeit: 2–3 Werktage nach Bestellung, da jedes Piece individuell bedruckt wird. Gesamtlieferzeit AGB: 5–10 Werktage ab Zahlungseingang.

PFLEGE: Waschen bei 30 °C, auf links gewendet, damit der Druck möglichst lange hält.

MASSANFERTIGUNG: Jedes Piece wird erst nach Bestellung mit dem Kundenmotiv bedruckt — das ist Maßanfertigung/individuelle Fertigung, kein Lagerware-Print-on-Demand-Wording verwenden.

ZAHLUNG: Stripe — Kreditkarte, PayPal, Klarna, Lastschrift, sichere Verbindung. Vertrag kommt mit der Bestellbestätigung per E-Mail zustande. Als Kleinunternehmer (§ 19 UStG) wird keine Umsatzsteuer ausgewiesen — alle Preise sind Endpreise.

AGB-KERNPUNKTE (verbindlich, nie widersprechen — volle AGB immer unter /agb verlinken):
- Kein Widerrufsrecht (§ 312g Abs. 2 Nr. 1 BGB), da jedes Piece individuell nach Kundenmotiv gefertigt wird — das gilt für ALLE Bestellungen ausnahmslos.
- Gewährleistung/Reklamation: bei Druckfehler, Beschädigung oder Falschlieferung ersetzen wir kostenlos oder erstatten den Kaufpreis. Kunde meldet sich per E-Mail (Adresse im Impressum) mit Foto des Mangels, Reaktionszeit 48 Stunden.
- Eigentumsvorbehalt: Ware bleibt bis vollständiger Bezahlung unser Eigentum.
- Urheberrecht: Kunde versichert, die Rechte am hochgeladenen Motiv zu besitzen, und haftet bei Rechtsverletzungen Dritter.
- Es gilt deutsches Recht.

ROLLE: Du antwortest wie der Shop-Betreiber persönlich — nicht wie ein generischer Bot. Beantworte JEDE Frage rund um Produkte, Material, Qualität, Versand, Bestellstatus, Zahlung, Reklamationen und das Konzept (Maßanfertigung/Atelier/Individualisierung), unabhängig davon, wie sie formuliert ist — auch Umgangssprache, Tippfehler, indirekte Fragen. Nutze dafür die obigen Fakten; erfinde nichts darüber hinaus.

REKLAMATIONEN: Bei Beschwerden über Druckfehler/Beschädigung/Falschlieferung/Verzögerung: erst empathisch reagieren, dann auf die Gewährleistungsregel verweisen (Foto per E-Mail, 48h Reaktion, kostenloser Ersatz/Erstattung), nach Bestellnummer fragen falls nicht genannt. Nie die Schuld beim Kunden suchen, nie das Problem kleinreden.

REGELN:
- Max 3–5 Sätze, Ton elegant/knapp/premium (Benefit-Sprache, kein Chemie-Label zuerst), aber persönlich und lösungsorientiert bei Problemen
- Kein „Print-on-Demand" — immer „Maßanfertigung"/„individuelle Fertigung"
- Nie Preise/Specs/Farben/Produkte außerhalb der Essential Collection erfinden (keine Boxer, keine weiteren Farben/Produkte, keine erfundenen Rabatte)
- Nie einzelne Gesetzesparagraphen über die oben genannten hinaus erfinden — bei Detailfragen zu AGB auf /agb verweisen
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
      const errorBody = await response.text().catch(() => '');
      console.error('[chat] Anthropic API error', response.status, errorBody);
      const fallback = getFallbackResponse(message, locale || 'de');
      return NextResponse.json({ reply: fallback, fallback: true });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || getFallbackResponse(message, locale || 'de');

    return NextResponse.json({ reply, fallback: false });

  } catch (err) {
    console.error('[chat] unexpected error', err instanceof Error ? err.message : err);
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
      bundleInfo: 'Essential Collection: AirFit Pro T-Shirt €44,99 und AirFit Pro Shorts €39,99. Beide zusammen als Essential Set: €74,99 statt €84,98, automatisch im Warenkorb.',
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
      bundleInfo: 'Essential Collection: tricoul AirFit Pro €44,99 și pantalonii scurți AirFit Pro €39,99. Împreună ca Essential Set: €74,99 în loc de €84,98, aplicat automat în coș.',
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
      bundleInfo: 'Essential Collection: AirFit Pro T-shirt €44.99 and AirFit Pro Shorts €39.99. Both together as the Essential Set: €74.99 instead of €84.98, applied automatically in your cart.',
      default: 'Hi! Happy to help. Ask me about sizes, material, the Studio, shipping or quality claims.',
    },
  };

  const lang = responses[locale] || responses.de;

  if (msg.includes('größe') || msg.includes('size') || msg.includes('marime') || msg.includes('mări'))
    return lang.groesse;
  if (msg.includes('versand') || msg.includes('lieferung') || msg.includes('shipping') || msg.includes('livrare'))
    return lang.versand;
  if (msg.includes('rückgabe') || msg.includes('return') || msg.includes('retur') || msg.includes('zurück')
    || msg.includes('reklamation') || msg.includes('beschwerde') || msg.includes('defekt') || msg.includes('kaputt')
    || msg.includes('mangel') || msg.includes('mangelhaft') || msg.includes('falsch geliefert') || msg.includes('komplaint')
    || msg.includes('complaint') || msg.includes('damaged') || msg.includes('defect'))
    return lang.rueckgabe;
  if (msg.includes('zahlung') || msg.includes('payment') || msg.includes('plată') || msg.includes('bezahl'))
    return lang.zahlung;
  if (msg.includes('material') || msg.includes('stoff') || msg.includes('fabric') || msg.includes('polyester') || msg.includes('poliester'))
    return lang.material;
  if (msg.includes('atelier') || msg.includes('studio') || msg.includes('hochladen') || msg.includes('upload') || msg.includes('360') || msg.includes('incarc'))
    return lang.atelier;
  if (msg.includes('pflege') || msg.includes('waschen') || msg.includes('care') || msg.includes('wash') || msg.includes('spăl') || msg.includes('spal'))
    return lang.pflege;
  if (msg.includes('shorts') || msg.includes('hose') || msg.includes('pantaloni') || msg.includes('bundle') || msg.includes('set') || msg.includes('essential'))
    return lang.bundleInfo;
  if (msg.includes('produktion') || msg.includes('production') || msg.includes('producție') || msg.includes('wann') || msg.includes('maßanfertigung') || msg.includes('print-on-demand'))
    return lang.produktion;

  return lang.default;
}
