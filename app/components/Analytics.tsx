'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function track(type: string, data?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && localStorage.getItem('platypus_cookie_consent') !== 'accepted') return;
  try {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...data }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const firePageview = () => {
      if (localStorage.getItem('platypus_cookie_consent') !== 'accepted') return;
      const locale = localStorage.getItem('platypus_locale') || 'de';
      track('pageview', { page: pathname, locale });
    };

    firePageview();
    window.addEventListener('cookieconsent', firePageview);
    return () => window.removeEventListener('cookieconsent', firePageview);
  }, [pathname]);

  return null;
}
