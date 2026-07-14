import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!key?.startsWith('sk_')) {
    return NextResponse.json({ received: true, warning: 'no stripe key' });
  }

  const stripe = new Stripe(key);
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  if (!webhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET fehlt');
    return NextResponse.json({ received: true, warning: 'no webhook secret' });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown';
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://platypus-shirt-shop.vercel.app';
      const parsedItems = (() => { try { return JSON.parse(session.metadata?.items || "[]"); } catch { return []; } })();
      const orderRes = await fetch(`${siteUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-internal-key': process.env.INTERNAL_API_KEY || '' },
        body: JSON.stringify({
          stripeSessionId: session.id,
          customerEmail: session.customer_email,
          amountTotal: (session.amount_total || 0) / 100,
          currency: session.currency?.toUpperCase() || 'EUR',
          locale: session.metadata?.locale || 'de',
          shippingCountry: session.metadata?.shippingCountry || 'DE',
          shippingMethod: session.metadata?.shippingMethod || null,
          items: parsedItems,
          designId: session.metadata?.designId || null,
          status: 'paid',
        }),
      });
      console.log('Order erstellt für Session:', session.id);

      // Bestätigungs-E-Mail senden (fehlertolerant - darf Bestellung nie kaputtmachen)
      try {
        const orderData = await orderRes.json().catch(() => ({}));
        const orderId = orderData?.order?.id || orderData?.id || session.id;
        const customerEmail = session.customer_email;
        if (customerEmail) {
          await fetch(`${siteUrl}/api/email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId,
              email: customerEmail,
              total: (session.amount_total || 0) / 100,
              items: parsedItems,
              locale: session.metadata?.locale || 'de',
              designId: session.metadata?.designId || null,
              designIds: session.metadata?.designIds || '',
            }),
          });
          console.log('Bestätigungs-E-Mail ausgelöst für:', customerEmail);
        }
      } catch (mailErr) {
        console.error('E-Mail-Versand fehlgeschlagen (Bestellung bleibt gültig):', mailErr);
      }
    } catch (err) {
      console.error('Order Erstellung fehlgeschlagen:', err);
    }
  }

  return NextResponse.json({ received: true });
}
