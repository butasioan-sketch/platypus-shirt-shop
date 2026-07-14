'use client';

import { useEffect, useState } from 'react';

export default function PaymentSuccessBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') !== 'success') return;

    setVisible(true);
    localStorage.removeItem('platypus_cart');
    window.dispatchEvent(new Event('cart-updated'));
    window.history.replaceState({}, '', '/');

    const timer = setTimeout(() => setVisible(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
      background: '#16a34a', color: '#fff', padding: '0.9rem 1.5rem', borderRadius: '12px',
      fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 12px 32px rgba(22,163,74,0.4)',
      maxWidth: '90vw', textAlign: 'center',
    }}>
      Zahlung erfolgreich! Du erhältst deine Bestellbestätigung per E-Mail.
    </div>
  );
}