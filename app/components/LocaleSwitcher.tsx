'use client';

import { useState } from 'react';
import { useLocale } from './LocaleProvider';
import { Locale } from '@/lib/i18n';
import { LOCALE_FLAGS, LOCALE_LABELS } from '@/lib/locale';

export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const locales: Locale[] = ['de', 'ro', 'en'];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: '#1a1a1a', border: '1px solid #333', color: '#fff',
          padding: '0.4rem 0.75rem', borderRadius: '999px', cursor: 'pointer',
          fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
        }}
      >
        <span>{LOCALE_FLAGS[locale]}</span>
        <span style={{ color: '#888', fontSize: '0.7rem' }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
          background: '#111', border: '1px solid #222', borderRadius: '10px',
          overflow: 'hidden', zIndex: 200, minWidth: '140px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          {locales.map(l => (
            <button
              key={l}
              onClick={() => { setLocale(l); setOpen(false); }}
              style={{
                width: '100%', background: l === locale ? '#1a1a1a' : 'transparent',
                border: 'none', color: '#fff', padding: '0.625rem 1rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem',
                fontSize: '0.8rem', textAlign: 'left',
              }}
            >
              <span>{LOCALE_FLAGS[l]}</span>
              <span>{LOCALE_LABELS[l]}</span>
              {l === locale && <span style={{ marginLeft: 'auto', color: '#4ade80' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
