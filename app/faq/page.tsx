'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/app/components/Logo';
import { useLocale } from '@/app/components/LocaleProvider';
import { getFaqContent } from '@/lib/faq-content';

export default function FaqPage() {
  const { locale } = useLocale();
  const { items, meta } = getFaqContent(locale);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.08), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo size={44} />
        <Link href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.875rem' }}>← Atelier</Link>
      </header>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.22em', marginBottom: '0.6rem', textTransform: 'uppercase', fontWeight: 600 }}>{meta.label}</p>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.6rem', color: '#fff', letterSpacing: '-0.02em' }}>{meta.title}</h1>
        <p style={{ color: '#999', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>{meta.sub}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#fff', padding: '1.15rem 1.35rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}
                >
                  <span>{item.q}</span>
                  <span style={{ color: '#e2001a', fontSize: '1.3rem', flexShrink: 0, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.35rem 1.25rem', color: '#aaa', fontSize: '0.9rem', lineHeight: 1.65 }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>{meta.more}</p>
          <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{meta.moreSub}</p>
          <Link href="/product/1" className="plt-btn-primary" style={{ display: 'inline-block', padding: '0.85rem 2rem', textDecoration: 'none', fontSize: '0.875rem' }}>
            {meta.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}