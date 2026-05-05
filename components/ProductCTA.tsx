"use client";

import DirectCheckoutButton from "./DirectCheckoutButton";

export default function ProductCTA({ price }: { price: number }) {
  return (
    <div className="mt-6 rounded-2xl bg-black text-white p-6 shadow-xl">
      <p className="text-sm text-white/70 font-bold">
        Direkt aus eigener Produktion
      </p>

      <p className="mt-2 text-3xl font-black">
        {price.toFixed(2)} €
      </p>

      <DirectCheckoutButton />

      <p className="mt-3 text-xs text-white/70">
        ✔ Versand in 1–3 Tagen · ✔ 100% Baumwolle · ✔ Eigene Produktion
      </p>
    </div>
  );
}
