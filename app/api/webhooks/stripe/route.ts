import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  console.log('Stripe Webhook received');
  console.log('Signature present:', !!signature);

  // TODO: Hier später echte Signature Verification + Order Erstellung
  // Für jetzt nur Log + Erfolg zurückgeben

  return NextResponse.json({ received: true });
}
