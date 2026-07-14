import type { Metadata } from 'next';
import SiteHeader from '@/app/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Datenschutz | PLATYPUS',
  description: 'Datenschutzerklärung von PLATYPUS — Wie wir deine Daten schützen und verarbeiten.',
};

const S = {
  h2: { fontSize: '1.05rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.4rem', color: '#fff' } as const,
  p: { color: '#aaa', lineHeight: 1.75, fontSize: '0.875rem' } as const,
};

export default function DatenschutzPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.07), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <SiteHeader />
      <main id="main-content" style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.22em', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>PLATYPUS</p>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Datenschutzerklärung</h1>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '2.5rem' }}>Stand: Juli 2026 · gemäß DSGVO und TTDSG</p>

        <h2 style={S.h2}>Verantwortlicher</h2>
        <p style={S.p}>
          I. Butas · PLATYPUS · On Me<br />
          E-Mail: <a href="mailto:butasioan@googlemail.com" style={{ color: '#e2001a', textDecoration: 'none' }}>butasioan@googlemail.com</a><br />
          Tel. +49 157 77283535
        </p>

        <h2 style={S.h2}>Bestelldaten</h2>
        <p style={S.p}>Beim Kauf werden Name, E-Mail-Adresse, Lieferadresse und Zahlungsdaten zur Bestellabwicklung verarbeitet (Art. 6 Abs. 1 lit. b DSGVO). Wir speichern keine Zahlungsdaten — diese werden ausschließlich von Stripe verarbeitet.</p>

        <h2 style={S.h2}>Designdaten</h2>
        <p style={S.p}>Dein hochgeladenes Motiv wird verschlüsselt in unserer Datenbank (Neon Serverless Postgres) gespeichert, ausschließlich zur Produktion deines Shirts. Nach Abwicklung der Bestellung werden Designdaten nicht aktiv gelöscht, können aber auf Anfrage entfernt werden.</p>

        <h2 style={S.h2}>Stripe (Zahlungsdienstleister)</h2>
        <p style={S.p}>Zahlungen werden über Stripe Inc. (185 Berry Street, San Francisco, CA 94107, USA) abgewickelt. Stripe verarbeitet Zahlungsdaten gemäß eigener Datenschutzrichtlinie: <a href="https://stripe.com/privacy" style={{ color: '#888' }}>stripe.com/privacy</a></p>

        <h2 style={S.h2}>E-Mail-Versand</h2>
        <p style={S.p}>Bestellbestätigungen werden über Resend (resend.com) versendet. Dabei wird deine E-Mail-Adresse zur Zustellung der Transaktions-E-Mail genutzt. Kein E-Mail-Marketing ohne explizite Einwilligung.</p>

        <h2 style={S.h2}>Cookies & LocalStorage</h2>
        <p style={S.p}>Wir nutzen Browser-LocalStorage für den Warenkorb und deine Spracheinstellung — ohne Tracking-Zweck. Analyse- und Marketing-Cookies (Google Analytics, Meta Pixel, TikTok) werden erst nach deiner ausdrücklichen Einwilligung über den Cookie-Banner aktiviert. Du kannst diese Einwilligung jederzeit zurückziehen (Seite neu laden → Cookie-Banner erscheint erneut).</p>

        <h2 style={S.h2}>Deine Rechte</h2>
        <p style={S.p}>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Anfragen bitte per E-Mail an <a href="mailto:butasioan@googlemail.com" style={{ color: '#e2001a', textDecoration: 'none' }}>butasioan@googlemail.com</a>. Außerdem besteht ein Beschwerderecht bei der zuständigen Datenschutzbehörde.</p>

        <h2 style={S.h2}>Hosting</h2>
        <p style={S.p}>Der Shop wird auf Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789, USA) gehostet. Vercel verarbeitet IP-Adressen und Server-Logs gemäß eigener Datenschutzrichtlinie.</p>
      </main>
    </div>
  );
}
