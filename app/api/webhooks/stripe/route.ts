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
      await fetch(`${siteUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripeSessionId: session.id,
          customerEmail: session.customer_email,
          amountTotal: (session.amount_total || 0) / 100,
          currency: session.currency?.toUpperCase() || 'EUR',
          locale: session.metadata?.locale || 'de',
          shippingCountry: session.metadata?.shippingCountry || 'DE',
          items: (() => { try { return JSON.parse(session.metadata?.items || "[]"); } catch { return []; } })(),
          status: 'paid',
        }),
      });
      console.log('Order erstellt für Session:', session.id);
    } catch (err) {
      console.error('Order Erstellung fehlgeschlagen:', err);
    }
  }

  return NextResponse.json({ received: true });
}
