'use client';

import { useEffect, useState } from 'react';
import { trackPurchase } from '@/lib/analytics';

const SHARE_TEXT: Record<string, { title: string; text: string; banner: string; share: string; copied: string }> = {
  de: {
    title: 'Mein neues PLATYPUS Piece',
    text: 'Gerade bestellt — mein Motiv auf Performance-Polyester. On me. In your head.',
    banner: '✓ Zahlung erfolgreich! Bestätigung kommt per E-Mail.',
    share: 'Teilen',
    copied: 'Link kopiert!',
  },
  ro: {
    title: 'Noul meu PLATYPUS',
    text: 'Tocmai am comandat — motivul meu pe poliester premium. On me. In your head.',
    banner: '✓ Plată reușită! Confirmarea vine pe email.',
    share: 'Distribuie',
    copied: 'Link copiat!',
  },
  en: {
    title: 'My new PLATYPUS piece',
    text: 'Just ordered — my design on performance polyester. On me. In your head.',
    banner: '✓ Payment successful! Confirmation coming via email.',
    share: 'Share',
    copied: 'Link copied!',
  },
};

export default function PaymentSuccessBanner() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [locale, setLocale] = useState('de');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') !== 'success') return;

    setVisible(true);
    localStorage.removeItem('platypus_cart');
    window.dispatchEvent(new Event('cart-updated'));
    window.history.replaceState({}, '', '/');

    const storedTotal = parseFloat(sessionStorage.getItem('plt_pending_purchase') ?? '0');
    if (storedTotal > 0) {
      trackPurchase({ value: storedTotal });
      sessionStorage.removeItem('plt_pending_purchase');
    }

    const storedLocale = localStorage.getItem('platypus_locale') || 'de';
    setLocale(storedLocale);

    const timer = setTimeout(() => setVisible(false), 15000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const t = SHARE_TEXT[locale] || SHARE_TEXT.de;
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://platypus-shirt-shop.vercel.app';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: t.title, text: t.text, url: siteUrl });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(siteUrl).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: '1.25rem', left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
      background: '#16a34a', color: '#fff', padding: '1rem 1.5rem', borderRadius: '14px',
      fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 12px 36px rgba(22,163,74,0.4)',
      maxWidth: '90vw', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem',
      animation: 'plt-fadeInUp 0.4s ease',
    }}>
      <span>{t.banner}</span>
      <button
        onClick={handleShare}
        style={{
          background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '8px', color: '#fff', padding: '0.45rem 1rem', fontSize: '0.8rem',
          fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s',
        }}
      >
        {copied ? t.copied : `${t.share} ↗`}
      </button>
    </div>
  );
}
