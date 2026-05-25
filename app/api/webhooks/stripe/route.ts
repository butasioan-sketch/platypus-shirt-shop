import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log('=== Payment Successful ===');
    console.log('Session ID:', session.id);
    console.log('Customer Email:', session.customer_email);
    console.log('Amount Total:', session.amount_total);
    console.log('Currency:', session.currency);

    // TODO: Hier später Order in orders.db oder Datenbank speichern
    // Beispiel-Daten die wir haben:
    // - session.customer_email
    // - session.amount_total
    // - session.id (als Referenz)
  }

  return NextResponse.json({ received: true });
}
