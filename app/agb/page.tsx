import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/app/components/Logo';

export const metadata: Metadata = {
  title: 'AGB | PLATYPUS',
  description: 'Allgemeine Geschäftsbedingungen von PLATYPUS — Maßgefertigte Premium-Shirts, Einzelanfertigung auf Bestellung.',
};

const S = { h2: { fontSize: '1.1rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.5rem' } as const, p: { color: '#aaa', marginTop: '0.5rem' } as const };

export default function AGBPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.07), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo size={44} />
        <Link href="/" style={{ color: '#888', fontSize: '0.8rem', textDecoration: 'none' }}>← Zurück</Link>
      </header>
      <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 2rem 4rem', lineHeight: 1.7 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Allgemeine Geschäftsbedingungen</h1>

        <h2 style={S.h2}>1. Geltungsbereich</h2>
        <p style={S.p}>Diese AGB gelten für alle Bestellungen über den Online-Shop PLATYPUS (platypus-shirt-shop.vercel.app) durch Verbraucher. Anbieter ist der im Impressum genannte Betreiber.</p>

        <h2 style={S.h2}>2. Vertragsschluss</h2>
        <p style={S.p}>Die Darstellung der Produkte im Shop stellt kein rechtlich bindendes Angebot dar, sondern eine Aufforderung zur Bestellung. Mit Abschluss des Bezahlvorgangs (Stripe Checkout) gibt der Kunde ein verbindliches Angebot ab. Der Vertrag kommt mit der Bestellbestätigung per E-Mail zustande.</p>

        <h2 style={S.h2}>3. Produkte &amp; Produktion</h2>
        <p style={S.p}>Alle Pieces werden nach Kundenspezifikation maßgefertigt: Das hochgeladene Motiv wird per Sublimationsdruck in die Faser eingebracht. Eine Lagerproduktion findet nicht statt.</p>

        <h2 style={S.h2}>4. Preise &amp; Zahlung</h2>
        <p style={S.p}>Alle Preise verstehen sich als Endpreise in Euro inkl. gesetzlicher Umsatzsteuer, zzgl. Versandkosten (werden im Checkout ausgewiesen). Die Zahlung erfolgt über Stripe.</p>

        <h2 style={S.h2}>5. Lieferung</h2>
        <p style={S.p}>Lieferung erfolgt nach Deutschland und Rumänien mit dem im Checkout gewählten Versanddienstleister (DHL, Hermes oder DPD). Die Lieferzeit beträgt in der Regel 5–10 Werktage ab Zahlungseingang, da jedes Shirt erst nach Bestellung produziert wird.</p>

        <h2 style={S.h2}>6. Ausschluss des Widerrufsrechts</h2>
        <p style={S.p}>Das Widerrufsrecht besteht gemäß § 312g Abs. 2 Nr. 1 BGB <strong style={{ color: '#fff' }}>nicht</strong> bei Verträgen zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind.</p>
        <p style={S.p}>Da jedes Shirt nach dem vom Kunden hochgeladenen Motiv individuell bedruckt wird, ist das Widerrufsrecht für alle Bestellungen in diesem Shop ausgeschlossen. Der Kunde wird hierauf vor Abschluss der Bestellung hingewiesen.</p>

        <h2 style={S.h2}>7. Gewährleistung</h2>
        <p style={S.p}>Es gilt das gesetzliche Mängelhaftungsrecht. Bei fehlerhaftem Druck, beschädigter Ware oder Falschlieferung ersetzen wir das Produkt selbstverständlich kostenfrei oder erstatten den Kaufpreis. Bitte kontaktiere uns dazu per E-Mail (siehe Impressum) mit Foto des Mangels.</p>

        <h2 style={S.h2}>8. Eigentumsvorbehalt</h2>
        <p style={S.p}>Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.</p>

        <h2 style={S.h2}>9. Urheberrecht an Kundenmotiven</h2>
        <p style={S.p}>Der Kunde versichert, dass er über die erforderlichen Rechte am hochgeladenen Motiv verfügt und durch den Druck keine Rechte Dritter verletzt werden. Der Kunde stellt den Anbieter von Ansprüchen Dritter frei, die auf einer Verletzung dieser Pflicht beruhen.</p>

        <h2 style={S.h2}>10. Schlussbestimmungen</h2>
        <p style={S.p}>Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gesetzliche Verbraucherschutzvorschriften des Staates, in dem der Kunde seinen gewöhnlichen Aufenthalt hat, bleiben unberührt. Sollten einzelne Bestimmungen unwirksam sein, bleibt der Vertrag im Übrigen wirksam.</p>

        <p style={{ marginTop: '3rem', color: '#555', fontSize: '0.8rem' }}>Stand: Juli 2026</p>
      </div>
    </div>
  );
}
