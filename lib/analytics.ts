"use client";

function hasConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('platypus_cookie_consent') === 'accepted';
}

function postAnalytics(type: string, data?: Record<string, unknown>) {
  if (!hasConsent()) return;
  try {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...data }),
      keepalive: true,
    }).catch(() => {});
  } catch { /* ignore */ }
}

export function trackEvent(eventName: string, data?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  if (!hasConsent()) return;

  postAnalytics(eventName.toLowerCase(), data);
  console.log('[PLATYPUS EVENT]', eventName, data || {});

  const w = window as any;
  if (w.fbq) w.fbq('trackCustom', eventName, data || {});
  if (w.ttq) w.ttq.track(eventName, data || {});
  if (w.gtag) w.gtag('event', eventName, data || {});
}

export function trackViewProduct(product: { id: string; name: string; price: number }) {
  trackEvent('ViewProduct', {
    product_id: product.id,
    product_name: product.name,
    price: product.price,
    currency: 'EUR',
  });
}

export function trackUploadDesign(product: { id: string; side: 'front' | 'back' }) {
  trackEvent('UploadDesign', { product_id: product.id, side: product.side });
}

export function trackAddToCart(product: any) {
  trackEvent('AddToCart', {
    product_id: product.id,
    product_name: product.name,
    price: product.price,
    color: product.color,
    size: product.size,
    quantity: product.quantity,
    currency: 'EUR',
  });
}

export function trackCheckoutStarted(data: { items: number; total: number; currency?: string }) {
  trackEvent('CheckoutStarted', { ...data, currency: data.currency ?? 'EUR' });
}

export function trackPurchase(order: { value: number; reference?: string; currency?: string }) {
  trackEvent('Purchase', {
    value: order.value,
    reference: order.reference,
    currency: order.currency ?? 'EUR',
  });
}
