import { NextResponse } from "next/server";
import { getPaymentMethod } from "../../../../data/payments";
import { getProviderMode } from "../../../../lib/paymentProviders";

type CheckoutItem = {
  name: string;
  size?: string;
  price: number;
  quantity: number;
};

function demoCheckout(body: any, method: any, status: string) {
  return NextResponse.json({
    ok: true,
    provider: method.provider,
    methodId: method.id,
    methodLabel: method.label,
    mode: getProviderMode(method.provider),
    status,
    amount: Number(body.total || 0),
    currency: "EUR",
    reference: body.reference || "",
    redirectUrl: "/?payment=success&mode=demo",
    createdAt: new Date().toISOString(),
  });
}

function looksLikeStripeSecret(value: string | undefined) {
  return Boolean(value && (value.startsWith("sk_test_") || value.startsWith("sk_live_")));
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "create-checkout",
    method: "POST",
    status: "ready",
    stripeKeyConfigured: looksLikeStripeSecret(process.env.STRIPE_SECRET_KEY),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paymentMethod = body.paymentMethod || "card";
    const method = getPaymentMethod(paymentMethod);

    if (!method) {
      return NextResponse.json(
        { ok: false, error: "Payment method not supported", paymentMethod },
        { status: 400 }
      );
    }

    const items: CheckoutItem[] = Array.isArray(body.items) ? body.items : [];

    if (items.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No checkout items provided" },
        { status: 400 }
      );
    }

    if (method.provider !== "stripe") {
      return demoCheckout(body, method, "non_stripe_demo_checkout_created");
    }

    if (!looksLikeStripeSecret(process.env.STRIPE_SECRET_KEY)) {
      return demoCheckout(body, method, "stripe_secret_key_invalid_or_missing_demo");
    }

    const StripeModule = await import("stripe");
    const Stripe = StripeModule.default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://platypus-shirt-shop.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        quantity: Number(item.quantity || 1),
        price_data: {
          currency: "eur",
          unit_amount: Math.round(Number(item.price || 0) * 100),
          product_data: {
            name: `${item.name}${item.size ? ` · Größe ${item.size}` : ""}`,
          },
        },
      })),
      success_url: `${siteUrl}/?payment=success`,
      cancel_url: `${siteUrl}/?payment=cancel`,
      metadata: {
        reference: body.reference || "",
        paymentMethod,
      },
    });

    return NextResponse.json({
      ok: true,
      provider: "stripe",
      methodId: method.id,
      methodLabel: method.label,
      status: "stripe_checkout_created",
      amount: Number(body.total || 0),
      currency: "EUR",
      reference: body.reference || "",
      redirectUrl: session.url,
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: "Payment checkout failed",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
