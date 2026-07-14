'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function track(type: string, data?: Record<string, unknown>) {
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
    const locale = localStorage.getItem('platypus_locale') || 'de';
    track('pageview', { page: pathname, locale });
  }, [pathname]);

  return null;
}
