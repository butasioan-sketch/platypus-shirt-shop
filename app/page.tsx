import PaymentSuccessBanner from '@/app/components/PaymentSuccessBanner';
import SiteHeader from '@/app/components/SiteHeader';
import HomeView from '@/app/components/home/HomeView';
import HomeLocaleGate from '@/app/components/home/HomeLocaleGate';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(1200px 600px at 50% -10%, rgba(226,0,26,0.10), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <PaymentSuccessBanner />
      <style>{`
        .produkt-karte:hover { transform: translateY(-6px); border-color: #e2001a !important; box-shadow: 0 16px 40px rgba(226,0,26,0.12); }
        .produkt-karte { transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
        .btn-primary:hover { background: #ff1a33 !important; transform: translateY(-2px); }
        .btn-primary { transition: background 0.2s, transform 0.2s; }
        .trust-grid, .outdoor-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
        @media (min-width: 768px) {
          .trust-grid { grid-template-columns: repeat(4, 1fr); }
          .outdoor-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 640px) {
          .site-header { padding: 0.85rem 1rem !important; }
          .site-header nav { gap: 0.75rem !important; }
          .brand-text { display: none; }
          .hero-badge { letter-spacing: 0.08em !important; font-size: 0.68rem !important; }
          .outdoor-sub { padding: 0 0.5rem; }
        }
      `}</style>

      <SiteHeader />

      <HomeLocaleGate>
        <HomeView locale="de" />
      </HomeLocaleGate>
    </div>
  );
}