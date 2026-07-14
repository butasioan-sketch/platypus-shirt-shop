import type { Metadata } from 'next';
import SiteHeader from '@/app/components/SiteHeader';

export const metadata: Metadata = {
  title: 'AGB | PLATYPUS',
  description: 'Allgemeine Geschäftsbedingungen von PLATYPUS — Maßgefertigte Premium-Shirts, Einzelanfertigung auf Bestellung.',
};

const S = {
  h2: { fontSize: '1.05rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.4rem', color: '#fff' } as const,
  p: { color: '#aaa', lineHeight: 1.75, fontSize: '0.875rem' } as const,
};

export default function AGBPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.07), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <SiteHeader />
      <main id="main-content" style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.22em', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>PLATYPUS</p>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Allgemeine Geschäftsbedingungen</h1>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '2.5rem' }}>Stand: Juli 2026</p>

        <h2 style={S.h2}>1. Geltungsbereich</h2>
        <p style={S.p}>Diese AGB gelten für alle Bestellungen über den Online-Shop PLATYPUS (platypus-shirt-shop.vercel.app) durch Verbraucher. Anbieter ist der im Impressum genannte Betreiber.</p>

        <h2 style={S.h2}>2. Vertragsschluss</h2>
        <p style={S.p}>Die Darstellung der Produkte im Shop stellt kein rechtlich bindendes Angebot dar, sondern eine Aufforderung zur Bestellung. Mit Abschluss des Bezahlvorgangs (Stripe Checkout) gibt der Kunde ein verbindliches Angebot ab. Der Vertrag kommt mit der Bestellbestätigung per E-Mail zustande.</p>

        <h2 style={S.h2}>3. Produkte & Produktion</h2>
        <p style={S.p}>Alle Pieces werden nach Kundenspezifikation maßgefertigt: Das hochgeladene Motiv wird per Sublimationsdruck in die Faser eingebracht. Eine Lagerproduktion findet nicht statt.</p>

        <h2 style={S.h2}>4. Preise & Zahlung</h2>
        <p style={S.p}>Alle Preise verstehen sich als Endpreise in Euro. Als Kleinunternehmer gemäß § 19 UStG wird keine Umsatzsteuer berechnet und ausgewiesen. Die Zahlung erfolgt über Stripe (Kreditkarte, PayPal, Klarna u. a.).</p>

        <h2 style={S.h2}>5. Lieferung</h2>
        <p style={S.p}>Lieferung erfolgt nach Deutschland und Rumänien mit dem im Checkout gewählten Versanddienstleister (DHL, Hermes oder DPD). Produktionszeit: 2–3 Werktage. Gesamtlieferzeit: 5–10 Werktage ab Zahlungseingang.</p>

        <h2 style={S.h2}>6. Ausschluss des Widerrufsrechts</h2>
        <p style={S.p}>Das Widerrufsrecht besteht gemäß § 312g Abs. 2 Nr. 1 BGB <strong style={{ color: '#fff' }}>nicht</strong> bei Verträgen zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind.</p>
        <p style={{ ...S.p, marginTop: '0.5rem' }}>Da jedes Shirt nach dem vom Kunden hochgeladenen Motiv individuell bedruckt wird, ist das Widerrufsrecht für alle Bestellungen in diesem Shop ausgeschlossen.</p>

        <h2 style={S.h2}>7. Gewährleistung</h2>
        <p style={S.p}>Es gilt das gesetzliche Mängelhaftungsrecht. Bei fehlerhaftem Druck, beschädigter Ware oder Falschlieferung ersetzen wir das Produkt kostenfrei oder erstatten den Kaufpreis. Kontakt per E-Mail (siehe Impressum) mit Foto des Mangels — Reaktionszeit: 48 Stunden.</p>

        <h2 style={S.h2}>8. Eigentumsvorbehalt</h2>
        <p style={S.p}>Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.</p>

        <h2 style={S.h2}>9. Urheberrecht an Kundenmotiven</h2>
        <p style={S.p}>Der Kunde versichert, dass er über die erforderlichen Rechte am hochgeladenen Motiv verfügt und durch den Druck keine Rechte Dritter verletzt werden. Der Kunde stellt den Anbieter von Ansprüchen Dritter frei, die auf einer Verletzung dieser Pflicht beruhen.</p>

        <h2 style={S.h2}>10. Schlussbestimmungen</h2>
        <p style={S.p}>Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gesetzliche Verbraucherschutzvorschriften des Staates, in dem der Kunde seinen gewöhnlichen Aufenthalt hat, bleiben unberührt.</p>
      </main>
    </div>
  );
}
