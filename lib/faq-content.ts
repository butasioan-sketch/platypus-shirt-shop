import type { Locale } from './i18n';

export interface FaqItem { q: string; a: string; }

const FAQ_DE: FaqItem[] = [
  { q: 'Wie gestalte ich mein Piece?', a: 'Im Atelier lädst du dein Motiv hoch — vorne und hinten im Format 210 × 297 mm. Du positionierst und skalierst es live. Was du siehst, wird gedruckt.' },
  { q: 'Welche Bildqualität braucht mein Motiv?', a: 'Empfohlen: 2480 × 3508 Pixel (300 dpi). Minimum: 1000 Pixel auf der kürzeren Seite. PNG mit transparentem Hintergrund für scharfe Kanten.' },
  { q: 'Wie lange dauert die Lieferung?', a: 'Deutschland: 2–4 Werktage Versand, ab €4,49 (Hermes, DPD oder DHL). Rumänien: 4–7 Werktage, ab €12,99. Maßanfertigung: zusätzlich 2–3 Werktage.' },
  { q: 'Kann ich meine Bestellung verfolgen?', a: 'Ja. Mit deiner Bestellnummer (PLT-…) unter Sendungsverfolgung siehst du den Status: Bezahlt, In Fertigung, Versendet, Zugestellt.' },
  { q: 'Welche Größen gibt es?', a: 'Unisex in S, M, L, XL und XXL. Im Zweifel eine Nummer größer wählen.' },
  { q: 'Aus welchem Material?', a: 'AirFit Performance Fabric — ein heller Performance-Polyester-Strick (T-Shirt 165 g/m², Shorts 135 g/m²), optimiert für Sublimation. Aktuell in Weiß — weitere Farben folgen.' },
  { q: 'Wie wird gedruckt?', a: 'Vollflächiger Sublimationsdruck in die Faser — vorne und hinten, 210 × 297 mm. Waschbeständig bei 30 °C, auf links.' },
  { q: 'Umtausch oder Rückgabe?', a: 'Individuelle Fertigung — kein Widerrufsrecht (§ 312g BGB). Bei Druckfehlern oder Mängeln ersetzen wir dein Piece kostenfrei.' },
  { q: 'Zahlungsmethoden?', a: 'Sichere Kasse über Stripe — Karte, PayPal, Klarna und weitere Methoden.' },
  { q: 'Kundenservice?', a: 'Platypus Concierge unten rechts — oder Kontakt über das Impressum.' },
];

const FAQ_RO: FaqItem[] = [
  { q: 'Cum îmi creez piece-ul?', a: 'În Atelier încarci motivul — față și spate, 210 × 297 mm. Poziționezi și scalezi live. Ce vezi, se imprimă.' },
  { q: 'Ce calitate de imagine?', a: 'Recomandat: 2480 × 3508 px (300 dpi). Minimum: 1000 px pe latura scurtă. PNG cu fundal transparent.' },
  { q: 'Cât durează livrarea?', a: 'Germania: 2–4 zile, de la €4,49. România: 4–7 zile, de la €12,99. Confecție: +2–3 zile.' },
  { q: 'Pot urmări comanda?', a: 'Da. Cu numărul PLT-… la Urmărire vezi statusul comenzii.' },
  { q: 'Ce mărimi există?', a: 'Unisex: S, M, L, XL, XXL. La dubii, alege o mărime mai mare.' },
  { q: 'Din ce material?', a: 'AirFit Performance Fabric — poliester performance (tricou 165 g/m², pantaloni scurți 135 g/m²), optimizat pentru sublimare. Momentan alb.' },
  { q: 'Cum se imprimă?', a: 'Sublimare integrală în fibră — față și spate, 210 × 297 mm.' },
  { q: 'Retur sau schimb?', a: 'Produs personalizat — fără drept de retragere. Înlocuire gratuită la defecte.' },
  { q: 'Metode de plată?', a: 'Plată securizată prin Stripe — card, PayPal, Klarna.' },
  { q: 'Suport?', a: 'Platypus Concierge — sau contact din Impressum.' },
];

const FAQ_EN: FaqItem[] = [
  { q: 'How do I design my piece?', a: 'In the Studio, upload front & back at 210 × 297 mm. Position and scale live. What you see is what prints.' },
  { q: 'What image quality?', a: 'Recommended: 2480 × 3508 px (300 dpi). Minimum: 1000 px on the short side. PNG with transparent background.' },
  { q: 'How long is delivery?', a: 'Germany: 2–4 days shipping from €4.49. Romania: 4–7 days from €12.99. Made to order: +2–3 production days.' },
  { q: 'Can I track my order?', a: 'Yes. Use your PLT-… order number on the tracking page.' },
  { q: 'What sizes?', a: 'Unisex S, M, L, XL, XXL. When in doubt, size up.' },
  { q: 'What material?', a: 'AirFit Performance Fabric — a light performance polyester knit (T-shirt 165 gsm, shorts 135 gsm), sublimation-ready. Currently white only.' },
  { q: 'How is it printed?', a: 'Full-area sublimation into the fiber — front and back, 210 × 297 mm.' },
  { q: 'Returns or exchanges?', a: 'Custom-made — no right of withdrawal. Free replacement for print defects.' },
  { q: 'Payment methods?', a: 'Secure checkout via Stripe — card, PayPal, Klarna and more.' },
  { q: 'Customer service?', a: 'Platypus Concierge bottom-right — or contact via Impressum.' },
];

const META: Record<Locale, { label: string; title: string; sub: string; cta: string; more: string; moreSub: string }> = {
  de: { label: 'Hilfe', title: 'Häufige Fragen', sub: 'Alles zu Atelier, Versand und Qualität. Keine Antwort? Frag den Concierge.', cta: 'Zum Atelier', more: 'Noch Fragen?', moreSub: 'Der Concierge hilft sofort.' },
  ro: { label: 'Ajutor', title: 'Întrebări frecvente', sub: 'Tot despre Atelier, livrare și calitate.', cta: 'Deschide Atelierul', more: 'Mai ai întrebări?', moreSub: 'Concierge-ul te ajută imediat.' },
  en: { label: 'Help', title: 'FAQ', sub: 'Everything about the Studio, shipping and quality.', cta: 'Enter the Studio', more: 'More questions?', moreSub: 'The Concierge is here to help.' },
};

export function getFaqContent(locale: Locale) {
  const items = { de: FAQ_DE, ro: FAQ_RO, en: FAQ_EN }[locale] || FAQ_DE;
  return { items, meta: META[locale] || META.de };
}