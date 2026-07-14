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
        .hero-product-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }
        @media (min-width: 900px) {
          .hero-product-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
          .hero-product-info { text-align: left; }
        }
        @media (max-width: 899px) {
          .hero-product-info { text-align: center; }
          .hero-product-viewer { max-width: 360px; margin: 0 auto; }
        }
        .btn-primary:hover { background: #ff1a33 !important; transform: translateY(-2px); }
        .btn-primary { transition: background 0.2s, transform 0.2s; }
        .hero-product-card:hover { border-color: rgba(226,0,26,0.35) !important; }
        .hero-product-card { transition: border-color 0.2s ease; }
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