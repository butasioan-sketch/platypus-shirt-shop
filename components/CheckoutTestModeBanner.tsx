"use client";

import { useSearchParams } from "next/navigation";

export default function CheckoutTestModeBanner() {
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");
  const mode = searchParams.get("mode");

  if (payment !== "success" || mode !== "demo") {
    return null;
  }

  return (
    <div className="mt-6 rounded-[2rem] border border-blue-200 bg-blue-50 p-6 text-blue-950 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-blue-700">
        Demo Checkout
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Testzahlung wurde simuliert.
      </h2>

      <p className="mt-3 text-sm font-bold leading-6 text-blue-900">
        Diese Ansicht erscheint nur im Demo-Modus. Für echte Zahlungen wird jetzt Stripe Checkout verwendet.
      </p>
    </div>
  );
}
