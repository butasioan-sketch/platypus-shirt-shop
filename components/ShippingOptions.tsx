"use client";

import { shippingMethods, freeShippingFrom } from "../data/shipping";

export default function ShippingOptions({
  subtotal,
  selected,
  onSelect,
}: {
  subtotal: number;
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-5 rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
      <p className="text-sm font-black mb-3">Versand auswählen</p>

      <div className="grid gap-2">
        {shippingMethods.map((method) => {
          const active = selected === method.id;
          const price = subtotal >= freeShippingFrom ? 0 : method.price;

          return (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`rounded-xl border p-3 text-left ${
                active ? "border-black bg-white ring-4 ring-black/10" : "border-neutral-200 bg-white"
              }`}
            >
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-black">{method.name}</p>
                  <p className="text-xs text-neutral-500">{method.time} · {method.bestFor}</p>
                </div>

                <p className="font-black">
                  {price === 0 ? "Kostenlos" : `${price.toFixed(2)} €`}
                </p>
              </div>

              <a
                href={method.url}
                target="_blank"
                className="mt-2 inline-block text-xs font-black underline"
                onClick={(e) => e.stopPropagation()}
              >
                Anbieter öffnen
              </a>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-neutral-500">
        Kostenloser Versand ab {freeShippingFrom} €. Tarife bitte vor Live-Verkauf beim Anbieter prüfen.
      </p>
    </div>
  );
}
