"use client";

import { useSearchParams } from "next/navigation";

export default function CheckoutStripeSuccessActions() {
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");
  const mode = searchParams.get("mode");

  if (payment !== "success" || mode === "demo") {
    return null;
  }

  return (
    <div className="mt-6 rounded-[2rem] border border-emerald-200 bg-white p-6 text-black shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
        Stripe Zahlung erfolgreich
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Echte Zahlung erkannt.
      </h2>

      <p className="mt-3 text-sm font-bold leading-6 text-neutral-600">
        Prüfe jetzt die Zahlung im Stripe Dashboard und dokumentiere die Bestellung im Admin.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href="/admin"
          className="rounded-2xl bg-black px-5 py-3 text-sm font-black text-white"
        >
          Admin öffnen
        </a>

        <a
          href="/admin/inventory"
          className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-black"
        >
          Lager prüfen
        </a>
      </div>
    </div>
  );
}
