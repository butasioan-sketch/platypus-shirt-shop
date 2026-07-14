'use client';

import { useState } from 'react';

const COPY: Record<string, { placeholder: string; btn: string; success: string; exists: string; error: string; label: string; sub: string }> = {
  de: {
    label: 'NEWSLETTER',
    sub: 'Neue Drops, exklusive Angebote & PLATYPUS-Neuigkeiten.',
    placeholder: 'deine@email.de',
    btn: 'Anmelden',
    success: 'Fast fertig — check deine E-Mails und bestätige die Anmeldung.',
    exists: 'Diese E-Mail ist bereits angemeldet.',
    error: 'Fehler. Bitte erneut versuchen.',
  },
  ro: {
    label: 'NEWSLETTER',
    sub: 'Lansări noi, oferte exclusive și noutăți PLATYPUS.',
    placeholder: 'email@tau.ro',
    btn: 'Abonează-te',
    success: 'Aproape gata — verifică email-ul și confirmă înscrierea.',
    exists: 'Acest email este deja înscris.',
    error: 'Eroare. Te rugăm să încerci din nou.',
  },
  en: {
    label: 'NEWSLETTER',
    sub: 'New drops, exclusive deals & PLATYPUS news.',
    placeholder: 'your@email.com',
    btn: 'Subscribe',
    success: 'Almost done — check your inbox and confirm your signup.',
    exists: 'This email is already subscribed.',
    error: 'Error. Please try again.',
  },
};

export default function NewsletterForm({ locale = 'de' }: { locale: string }) {
  const t = COPY[locale] || COPY.de;
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'exists' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || state === 'loading') return;
    setState('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
      const data = await res.json();
      if (!res.ok) { setState('error'); return; }
      setState(data.status === 'exists' ? 'exists' : 'success');
    } catch {
      setState('error');
    }
  };

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <p style={{ color: '#e2001a', fontSize: '0.68rem', letterSpacing: '0.22em', fontWeight: 700, marginBottom: '0.35rem' }}>{t.label}</p>
      <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.85rem', lineHeight: 1.5 }}>{t.sub}</p>

      {(state === 'success' || state === 'exists') ? (
        <p style={{ color: state === 'success' ? '#4ade80' : '#888', fontSize: '0.82rem', lineHeight: 1.6 }}>
          {state === 'success' ? t.success : t.exists}
        </p>
      ) : (
        <form onSubmit={submit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t.placeholder}
            required
            style={{
              flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '0.6rem 0.9rem', color: '#fff', fontSize: '0.82rem', outline: 'none',
              minWidth: 0,
            }}
          />
          <button
            type="submit"
            disabled={state === 'loading'}
            className="plt-btn-primary"
            style={{ padding: '0.6rem 1rem', fontSize: '0.8rem', flexShrink: 0 }}
          >
            {state === 'loading' ? '…' : t.btn}
          </button>
        </form>
      )}
      {state === 'error' && <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.5rem' }}>{t.error}</p>}
    </div>
  );
}
