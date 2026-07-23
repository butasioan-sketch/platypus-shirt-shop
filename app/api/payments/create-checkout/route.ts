import { NextResponse } from "next/server";
import { getPaymentMethod } from "../../../../data/payments";
import { getProviderMode } from "../../../../lib/paymentProviders";
import { calcUnitPriceForProduct, calcMerchandiseTotal, isBundleEligible, PRICE_BUNDLE_ESSENTIAL, EXTRA_IMAGE_PRICE, INCLUDED_IMAGES, type MerchandiseItem } from "../../../../lib/pricing";
import { checkRateLimit, clientIp } from "../../../../lib/rate-limit";
import { SHIPPING_OPTIONS, DEFAULT_SHIPPING_ID, type Country } from "../../../../lib/shipping";

type CheckoutItem = {
  productId?: string; // '1' Tee | '2' Shorts — default '1' fuer alte Aufrufer
  name: string;
  size?: string;
  color?: string;
  price?: number; // Client-Wert — wird serverseitig IGNORIERT
  quantity: number;
  designId?: string;
};

type PricedItem = CheckoutItem & { productId: string; unitPrice: number; pages: number; qty: number };

// Bundle-Preis auf zwei Stripe-Line-Haelften aufteilen, die exakt auf PRICE_BUNDLE_ESSENTIAL summieren.
function splitBundleHalves(): { tee: number; shorts: number } {
  const teeHalf = Math.floor((PRICE_BUNDLE_ESSENTIAL * 100) / 2) / 100;
  const shortsHalf = +(PRICE_BUNDLE_ESSENTIAL - teeHalf).toFixed(2);
  return { tee: teeHalf, shorts: shortsHalf };
}

function itemLabel(p: PricedItem, suffix = ""): string {
  return `${p.name}${p.color ? ` · ${p.color}` : ""}${p.size ? ` · Größe ${p.size}` : ""}${suffix}`;
}

/**
 * Baut Stripe-Line-Items. Bei Bundle: je 1x Tee + 1x Shorts bilden ein Paar, dessen
 * Preis auf zwei Line-Haelften aufgeteilt wird, die zusammen exakt PRICE_BUNDLE_ESSENTIAL
 * ergeben (+ Extra-Bild-Aufpreis pro Teil oben drauf). Ueberzaehlige Einheiten (qty ueber
 * den verfuegbaren Paaren hinaus) laufen zum normalen Flat-Preis. Summe der Lines ==
 * calcMerchandiseTotal(...) exakt, da dieselbe Paar-Logik verwendet wird.
 */
function buildLineItems(priced: PricedItem[], applyBundle: boolean) {
  const halves = splitBundleHalves();
  let teeBudget = applyBundle
    ? Math.min(
        priced.filter((p) => p.productId === "1").reduce((s, p) => s + p.qty, 0),
        priced.filter((p) => p.productId === "2").reduce((s, p) => s + p.qty, 0),
      )
    : 0;
  let shortsBudget = teeBudget;

  const lines: Array<{
    quantity: number;
    price_data: { currency: string; unit_amount: number; product_data: { name: string; description: string } };
  }> = [];

  for (const p of priced) {
    const extraPerUnit = Math.max(0, p.pages - INCLUDED_IMAGES) * EXTRA_IMAGE_PRICE;

    if (p.productId !== "1" && p.productId !== "2") {
      lines.push({
        quantity: p.qty,
        price_data: { currency: "eur", unit_amount: Math.round(p.unitPrice * 100), product_data: { name: itemLabel(p), description: `${p.pages} Seite(n) bedruckt` } },
      });
      continue;
    }

    const isTee = p.productId === "1";
    const budget = isTee ? teeBudget : shortsBudget;
    const pairedQty = Math.min(p.qty, budget);
    const leftoverQty = p.qty - pairedQty;
    if (isTee) teeBudget -= pairedQty; else shortsBudget -= pairedQty;

    if (pairedQty > 0) {
      const half = isTee ? halves.tee : halves.shorts;
      lines.push({
        quantity: pairedQty,
        price_data: {
          currency: "eur",
          unit_amount: Math.round((half + extraPerUnit) * 100),
          product_data: { name: itemLabel(p, " (Essential Set)"), description: `${p.pages} Seite(n) bedruckt · Set-Anteil` },
        },
      });
    }
    if (leftoverQty > 0) {
      lines.push({
        quantity: leftoverQty,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(p.unitPrice * 100),
          product_data: { name: itemLabel(p), description: `${p.pages} Seite(n) bedruckt` },
        },
      });
    }
  }
  return lines;
}

async function getSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  const { neon } = await import("@neondatabase/serverless");
  return neon(url);
}

function looksLikeStripeSecret(value: string | undefined) {
  return Boolean(value && (value.startsWith("sk_test_") || value.startsWith("sk_live_")));
}

function demoCheckout(body: { reference?: string }, method: NonNullable<ReturnType<typeof getPaymentMethod>>, status: string, amount: number) {
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
    const rl = checkRateLimit(`checkout:${clientIp(request)}`, 8, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, error: "Too many checkout attempts. Please wait." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
      );
    }

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

    const missingDesign = items.some((item) => !item.designId);
    if (missingDesign) {
      return NextResponse.json(
        { ok: false, error: "Jeder Artikel benötigt ein Design (designId)." },
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
      const productId = item.productId || "1";
      let front: string | null = null;
      let back: string | null = null;
      let pages = 0;
      if (item.designId && sql) {
        const rows = (await sql.query(
          `SELECT front_image, back_image, meta FROM designs WHERE id=$1`,
          [item.designId]
        )) as Record<string, unknown>[];
        if (rows.length) {
          front = (rows[0].front_image as string) || null;
          back = (rows[0].back_image as string) || null;
          const meta = rows[0].meta as Record<string, unknown> | null;
          // Multi-Layer-Atelier: Preis basiert auf der tatsaechlichen Ebenen-Anzahl je
          // Seite (meta.front/backLayerCount, serverseitig aus der DB gelesen — nie vom
          // Client vertraut). Legacy-Designs ohne diese Felder: alte 0/1-pro-Seite-Regel.
          const frontCount = typeof meta?.frontLayerCount === 'number' ? meta.frontLayerCount : (front ? 1 : 0);
          const backCount = typeof meta?.backLayerCount === 'number' ? meta.backLayerCount : (back ? 1 : 0);
          pages = Math.max(0, Math.min(12, Math.round(frontCount))) + Math.max(0, Math.min(12, Math.round(backCount)));
        }
      }
      const qty = Math.max(1, Math.min(99, Math.round(Number(item.quantity || 1))));
      priced.push({ ...item, productId, pages, qty, unitPrice: calcUnitPriceForProduct(productId, pages) });
    }

    // Bundle: automatisch sobald >=1 Tee (id '1') und >=1 Shorts (id '2') vorhanden sind.
    const merchItems: MerchandiseItem[] = priced.map((p) => ({ productId: p.productId, pages: p.pages, qty: p.qty }));
    const applyBundle = body.applyBundle !== false && isBundleEligible(merchItems);
    const merchandiseTotal = calcMerchandiseTotal(merchItems, applyBundle);
    const serverTotal = Math.round((merchandiseTotal + shippingCost) * 100) / 100;

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

    // Serialisiert Items mit abgekürzten Keys (~87 Zeichen/Item statt ~130).
    // Stripe-Limit: 500 Zeichen pro Metadata-Value. .slice() würde JSON brechen.
    const itemsAbbrev = priced.map((p) => ({
      n: p.name.slice(0, 20), s: p.size ?? '', c: p.color ?? '',
      q: p.qty, pr: p.unitPrice, pg: p.pages, d: p.designId ?? '', pid: p.productId,
    }));
    let itemsMeta = JSON.stringify(itemsAbbrev);
    if (itemsMeta.length > 490) {
      for (let count = itemsAbbrev.length - 1; count >= 1; count--) {
        const partial = JSON.stringify(itemsAbbrev.slice(0, count));
        if (partial.length <= 490) { itemsMeta = partial; break; }
        if (count === 1) itemsMeta = '[]';
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      allow_promotion_codes: true,
      payment_method_types: ["card", "paypal", "klarna", "sepa_debit", "link"],
      line_items: buildLineItems(priced, applyBundle),
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
        items: itemsMeta,
        designId: priced.find((p) => p.designId)?.designId || "",
        designIds: priced.map((p) => p.designId).filter(Boolean).join(",").slice(0, 490),
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: "Payment checkout failed", message },
      { status: 500 }
    );
  }
}
