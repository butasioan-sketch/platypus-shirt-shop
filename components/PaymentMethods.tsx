"use client";

import { paymentMethods } from "../data/payments";

export default function PaymentMethods({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (method: string) => void;
}) {
  return (
    <div className="mt-5 rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
      <p className="text-sm font-black mb-3">Zahlungsmethode auswählen</p>

      <div className="grid grid-cols-2 gap-2">
        {paymentMethods.filter((m) => m.enabled).map((method) => (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`rounded-xl px-3 py-3 text-center text-sm font-black transition ${method.style} ${
              selected === method.id
                ? "ring-4 ring-black/20 scale-[0.98]"
                : "hover:scale-[0.99]"
            }`}
          >
            {method.label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-white border border-neutral-200 p-3">
        <p className="text-xs font-black">Provider-Struktur</p>
        <p className="text-xs text-neutral-500 mt-1">
          Auswahl wird in der Bestellung gespeichert. Live-Anbindung folgt über Payment API.
        </p>
      </div>
    </div>
  );
}
