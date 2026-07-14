"use client";

function postAnalytics(type: string, data?: Record<string, unknown>) {
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
  if (typeof window === "undefined") return;

  postAnalytics(eventName.toLowerCase(), data);
  console.log("[PLATYPUS EVENT]", eventName, data || {});

  const w = window as any;

  if (w.fbq) w.fbq("trackCustom", eventName, data || {});
  if (w.ttq) w.ttq.track(eventName, data || {});
  if (w.gtag) w.gtag("event", eventName, data || {});
}

export function trackAddToCart(product: any) {
  trackEvent("AddToCart", {
    product_id: product.id,
    product_name: product.name,
    price: product.price,
    color: product.color,
    size: product.size,
    quantity: product.quantity,
  });
}

export function trackCheckoutStarted(data: any) {
  trackEvent("CheckoutStarted", data);
}

export function trackPurchase(order: any) {
  trackEvent("Purchase", {
    order_id: order.id,
    reference: order.reference,
    value: order.total,
    currency: "EUR",
    payment_method: order.paymentMethod,
  });
}
