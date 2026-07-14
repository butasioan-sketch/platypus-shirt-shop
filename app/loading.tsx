export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem',
    }}>
      <div style={{
        width: 44, height: 44,
        border: '3px solid rgba(226,0,26,0.15)',
        borderTopColor: '#e2001a',
        borderRadius: '50%',
        animation: 'platypus-spin 0.75s linear infinite',
      }} />
      <p style={{ color: '#555', fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
        On Me · Shop lädt
      </p>
      <style>{`@keyframes platypus-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}