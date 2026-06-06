import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '6rem', fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>404</p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Seite nicht gefunden</h1>
        <p style={{ color: '#555', marginBottom: '2rem', fontSize: '0.875rem' }}>Diese Seite existiert nicht.</p>
        <Link href="/" style={{ background: '#fff', color: '#000', padding: '0.75rem 2rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
          Zurück zum Shop
        </Link>
      </div>
    </div>
  );
}
