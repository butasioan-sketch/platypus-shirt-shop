'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('platypus_cookie_consent')) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('platypus_cookie_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('platypus_cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '1rem', left: '1rem', right: '1rem',
      maxWidth: '640px', margin: '0 auto',
      background: '#141414', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '16px', padding: '1.25rem 1.5rem',
      zIndex: 9999, display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    }}>
      <p style={{ color: '#aaa', fontSize: '0.82rem', flex: 1, margin: 0, lineHeight: 1.5, minWidth: 200 }}>
        Wir nutzen Cookies für Betrieb & Analyse. Nach Einwilligung auch Tracking-Pixel.{' '}
        <Link href="/datenschutz" style={{ color: '#e2001a', textDecoration: 'none' }}>Datenschutz</Link>
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <button
          onClick={decline}
          style={{
            padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
            color: '#888', fontSize: '0.82rem', fontWeight: 600,
          }}
        >
          Ablehnen
        </button>
        <button
          onClick={accept}
          style={{
            padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
            background: '#e2001a', border: 'none',
            color: '#fff', fontSize: '0.82rem', fontWeight: 700,
          }}
        >
          Alle akzeptieren
        </button>
      </div>
    </div>
  );
}
