"use client";

import { useEffect, useState } from "react";

type StorageItem = {
  key: string;
  exists: boolean;
};

export default function OrderLocalStorageDoctor() {
  const [items, setItems] = useState<StorageItem[]>([]);

  useEffect(() => {
    const keys = [
      "platypus-manual-orders",
      "platypus-last-tracking",
      "platypus-customer-note",
      "platypus-payment-verification",
      "platypus-order-risk-check",
      "platypus-refund-note",
      "platypus-order-internal-status",
      "platypus-last-order-completion",
    ];

    setItems(
      keys.map((key) => ({
        key,
        exists: Boolean(localStorage.getItem(key)),
      }))
    );
  }, []);

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Storage Doctor
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Lokale Order-Daten prüfen
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.key}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm font-black"
          >
            {item.exists ? "✅" : "☐"} {item.key}
          </div>
        ))}
      </div>
    </div>
  );
}
