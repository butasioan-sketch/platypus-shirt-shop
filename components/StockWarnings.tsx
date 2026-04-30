"use client";

import Link from "next/link";
import { products } from "../data/products";
import { useInventory } from "../store/inventory";

export default function StockWarnings() {
  const stock = useInventory((state) => state.stock);

  const warnings = stock.filter((item) => item.stock <= item.minStock);

  if (warnings.length === 0) {
    return (
      <div className="mt-8 rounded-[2rem] bg-emerald-50 border border-emerald-200 p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-widest text-emerald-700">
          Lagerstatus
        </p>
        <h2 className="mt-2 text-2xl font-black text-emerald-900">
          Alle Größen haben genug Bestand.
        </h2>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-[2rem] bg-red-50 border border-red-200 p-6 shadow-sm">
      <p className="text-sm font-black uppercase tracking-widest text-red-700">
        Lagerwarnung
      </p>

      <h2 className="mt-2 text-2xl font-black text-red-900">
        {warnings.length} Größen müssen nachbestellt werden.
      </h2>

      <div className="mt-4 grid gap-2">
        {warnings.map((item) => {
          const product = products.find((p) => p.id === item.productId);

          return (
            <div
              key={`${item.productId}-${item.size}`}
              className="rounded-2xl bg-white border border-red-100 p-4 font-black"
            >
              {product?.name} · Größe {item.size} · Bestand {item.stock}
            </div>
          );
        })}
      </div>

      <Link
        href="/admin/inventory"
        className="mt-5 inline-block rounded-2xl bg-black px-5 py-3 font-black text-white"
      >
        Lager öffnen
      </Link>
    </div>
  );
}
