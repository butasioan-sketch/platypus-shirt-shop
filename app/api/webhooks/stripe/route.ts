import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { execSync } from 'child_process';

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

    const email = session.customer_email || 'unknown@email.com';
    const amount = session.amount_total || 0;
    const currency = session.currency || 'eur';

    console.log('Payment successful! Creating order...');

    try {
      // Ruft das Bash-Script auf, um die Order anzulegen
      execSync(
        `./scripts/create-order-from-payment.sh "${email}" ${amount} "${currency.toUpperCase()}" "${session.id}"`,
        { stdio: 'inherit' }
      );
    } catch (error) {
      console.error('Failed to create order from webhook:', error);
    }
  }

  return NextResponse.json({ received: true });
}
