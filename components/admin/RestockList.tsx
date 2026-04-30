"use client";

import { products } from "../../data/products";
import { useInventory } from "../../store/inventory";

export default function RestockList() {
  const stock = useInventory((state) => state.stock);
  const warnings = stock.filter((item) => item.stock <= item.minStock);

  if (warnings.length === 0) return null;

  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-red-700">
        Nachbestell-Liste
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Diese Größen nachbestellen
      </h2>

      <div className="mt-5 grid gap-3">
        {warnings.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          const needed = Math.max(10 - item.stock, 0);

          return (
            <div
              key={`${item.productId}-${item.size}`}
              className="rounded-2xl bg-red-50 border border-red-200 p-4"
            >
              <p className="font-black">
                {product?.name} · Größe {item.size}
              </p>

              <p className="text-sm text-red-800 mt-1">
                Aktuell: {item.stock} · Minimum: {item.minStock} · Empfehlung: {needed} Stück nachbestellen
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
