import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPaymentMethod } from "../../../../data/payments";
import { getProviderMode } from "../../../../lib/paymentProviders";

export async function POST(request: Request) {
  const body = await request.json();
  const method = getPaymentMethod(body.paymentMethod);

  if (!method) {
    return NextResponse.json({ error: "Payment method not supported" }, { status: 400 });
  }

  const mode = getProviderMode(method.provider);

  if (method.provider === "stripe" && process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "klarna", "sofort"],
      line_items: body.items.map((item: any) => ({
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: `${item.name} · Größe ${item.size}`,
          },
        },
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: Math.round(body.shipping * 100),
              currency: "eur",
            },
            display_name: body.shipping === 0 ? "Kostenloser Versand" : "Standardversand",
          },
        },
      ],
      success_url: `${siteUrl}/?payment=success`,
      cancel_url: `${siteUrl}/?payment=cancel`,
      metadata: {
        reference: body.reference,
        paymentMethod: body.paymentMethod,
      },
    });

    return NextResponse.json({
      id: session.id,
      provider: "stripe",
      methodId: method.id,
      methodLabel: method.label,
      type: method.type,
      mode: "live_ready",
      status: "stripe_checkout_created",
      amount: body.total,
      currency: "EUR",
      reference: body.reference,
      redirectUrl: session.url,
      createdAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    id: crypto.randomUUID(),
    provider: method.provider,
    methodId: method.id,
    methodLabel: method.label,
    type: method.type,
    mode,
    status: mode === "ready" ? "provider_ready_demo_redirect" : "demo_created",
    amount: body.total,
    currency: "EUR",
    reference: body.reference,
    redirectUrl: "/",
    createdAt: new Date().toISOString(),
  });
}
