'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '4rem', padding: '3rem 1.5rem 2rem', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Links als Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem' }}>
          {[
            { label: 'Impressum', href: '/impressum' },
            { label: 'AGB', href: '/agb' },
            { label: 'Datenschutz', href: '/datenschutz' },
            { label: 'Versand & Rückgabe', href: '/versand' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Sendungsverfolgung', href: '/tracking' },
          ].map(({ label, href }) => (
            <Link key={href} href={href} style={{
              display: 'inline-block',
              padding: '0.5rem 1.1rem',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#aaa',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 500,
              transition: 'all 0.15s',
              background: 'rgba(255,255,255,0.03)',
            }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p style={{ textAlign: 'center', color: '#444', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
          © {new Date().getFullYear()} PLATYPUS — <span style={{ color: '#333' }}>On Me. Words are not just words.</span>
        </p>

      </div>
    </footer>
  );
}
