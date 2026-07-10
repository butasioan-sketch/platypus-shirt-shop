'use client';

export default function Impressum() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Impressum</h1>

        <div style={{ background: '#121212', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p><strong>Angaben gemäß § 5 TMG</strong></p>
          <p style={{ marginTop: '1rem' }}>
            <strong>Inhaber:</strong> [DEIN NAME]<br />
            <strong>Straße & Hausnr.:</strong> [DEINE STRASSE]<br />
            <strong>PLZ & Ort:</strong> [DEINE PLZ, STADT]<br />
            <strong>Land:</strong> Deutschland
          </p>

          <p style={{ marginTop: '1rem' }}>
            <strong>Kontakt:</strong><br />
            E-Mail: [DEINE EMAIL]<br />
            Telefon: [DEINE TELEFONNUMMER]
          </p>

          <p style={{ marginTop: '1rem' }}>
            <strong>Umsatzsteuer-ID:</strong><br />
            Gemäß § 27a Umsatzsteuergesetz (UStG) – [DEINE UST-ID, falls vorhanden]
          </p>

          <p style={{ marginTop: '1rem' }}>
            <strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong><br />
            [DEIN NAME], [DEINE ANSCHRIFT]
          </p>

          <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.8rem' }}>
            <strong>Hinweis zur Online-Streitbeilegung:</strong><br />
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" style={{ color: '#e2001a' }}>https://ec.europa.eu/consumers/odr/</a>.<br />
            Wir sind nicht bereit oder verpflichtet, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>
      </div>
    </div>
  );
}
