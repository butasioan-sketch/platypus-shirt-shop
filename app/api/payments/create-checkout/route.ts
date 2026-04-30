import { NextResponse } from "next/server";
import { getPaymentMethod } from "../../../../data/payments";
import { getProviderMode } from "../../../../lib/paymentProviders";

export async function POST(request: Request) {
  const body = await request.json();
  const method = getPaymentMethod(body.paymentMethod);

  if (!method) {
    return NextResponse.json(
      { error: "Payment method not supported" },
      { status: 400 }
    );
  }

  const mode = getProviderMode(method.provider);

  const paymentSession = {
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
  };

  return NextResponse.json(paymentSession);
}
