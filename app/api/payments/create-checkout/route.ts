import { NextResponse } from "next/server";
import { getPaymentMethod } from "../../../../data/payments";
import { getProviderMode } from "../../../../lib/paymentProviders";
import { calcUnitPrice } from "../../../../lib/pricing";
import { SHIPPING_OPTIONS, DEFAULT_SHIPPING_ID, type Country } from "../../../../lib/shipping";

type CheckoutItem = {
  name: string;
  size?: string;
  color?: string;
  price?: number; // Client-Wert — wird serverseitig IGNORIERT
  quantity: number;
  designId?: string;
};

type PricedItem = CheckoutItem & { unitPrice: number; pages: number; qty: number };

async function getSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  const { neon } = await import("@neondatabase/serverless");
  return neon(url);
}

function looksLikeStripeSecret(value: string | undefined) {
  return Boolean(value && (value.startsWith("sk_test_") || value.startsWith("sk_live_")));
}

function demoCheckout(body: any, method: any, status: string, amount: number) {
  return NextResponse.json({
    ok: true,
    provider: method.provider,
    methodId: method.id,
    methodLabel: method.label,
    mode: getProviderMode(method.provider),
    status,
    amount,
    currency: "EUR",
    reference: body.reference || "",
    redirectUrl: "/?payment=success&mode=demo",
    createdAt: new Date().toISOString(),
  });
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

    // === SERVERSEITIGE PREISBERECHNUNG — Client-Beträge werden ignoriert ===
    const country: Country = body.country === "RO" ? "RO" : "DE";
    const wantedId = String(body.shippingId || "").toLowerCase();
    const wantedCarrier = String(body.shippingMethod || "").toLowerCase();
    const shipOpt =
      SHIPPING_OPTIONS.find((o) => o.id === wantedId) ||
      SHIPPING_OPTIONS.find((o) => o.carrier.toLowerCase() === wantedCarrier) ||
      SHIPPING_OPTIONS.find((o) => o.id === DEFAULT_SHIPPING_ID)!;
    const shippingCost = shipOpt.price[country];

    const sql = await getSql();
    const priced: PricedItem[] = [];
    for (const item of items) {
      let front: string | null = null;
      let back: string | null = null;
      if (item.designId && sql) {
        const rows = (await sql.query(
          `SELECT front_image, back_image FROM designs WHERE id=$1`,
          [item.designId]
        )) as Record<string, unknown>[];
        if (rows.length) {
          front = (rows[0].front_image as string) || null;
          back = (rows[0].back_image as string) || null;
        }
      }
      const pages = (front ? 1 : 0) + (back ? 1 : 0);
      const qty = Math.max(1, Math.min(99, Math.round(Number(item.quantity || 1))));
      priced.push({ ...item, pages, qty, unitPrice: calcUnitPrice(front, back) });
    }

    const serverTotal =
      priced.reduce((sum, p) => sum + p.unitPrice * p.qty, 0) + shippingCost;

    if (method.provider !== "stripe") {
      return demoCheckout(body, method, "non_stripe_demo_checkout_created", serverTotal);
    }
    if (!looksLikeStripeSecret(process.env.STRIPE_SECRET_KEY)) {
      return demoCheckout(body, method, "stripe_secret_key_invalid_or_missing_demo", serverTotal);
    }

    const StripeModule = await import("stripe");
    const Stripe = StripeModule.default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://platypus-shirt-shop.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "paypal", "klarna", "sepa_debit", "link"],
      line_items: priced.map((p) => ({
        quantity: p.qty,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(p.unitPrice * 100),
          product_data: {
            name: `${p.name}${p.color ? ` · ${p.color}` : ""}${p.size ? ` · Größe ${p.size}` : ""}`,
            description: `${p.pages} Seite(n) bedruckt`,
          },
        },
      })),
      shipping_options: [{
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: Math.round(shippingCost * 100), currency: "eur" },
          display_name: `Versand · ${shipOpt.carrier}`,
        },
      }],
      success_url: `${siteUrl}/?payment=success`,
      cancel_url: `${siteUrl}/?payment=cancel`,
      metadata: {
        reference: body.reference || "",
        paymentMethod,
        items: JSON.stringify(priced.map((p) => ({
          name: p.name, size: p.size, color: p.color,
          quantity: p.qty, price: p.unitPrice, pages: p.pages, designId: p.designId,
        }))).slice(0, 480),
        designId: priced.find((p) => p.designId)?.designId || "",
        designIds: priced.map((p) => p.designId).filter(Boolean).join(",").slice(0, 200),
        shippingCountry: country,
        shippingMethod: shipOpt.carrier,
        locale: body.locale || "de",
      },
    });

    return NextResponse.json({
      ok: true,
      provider: "stripe",
      methodId: method.id,
      methodLabel: method.label,
      status: "stripe_checkout_created",
      amount: serverTotal,
      currency: "EUR",
      reference: body.reference || "",
      redirectUrl: session.url,
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: "Payment checkout failed", message: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
