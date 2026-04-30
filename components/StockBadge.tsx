"use client";

import { useInventory } from "../store/inventory";

export default function StockBadge({
  productId,
  size,
}: {
  productId: number;
  size: string;
}) {
  const stock = useInventory((state) => state.stock);
  const item = stock.find((s) => s.productId === productId && s.size === size);

  if (!item) return null;

  const low = item.stock <= item.minStock;
  const empty = item.stock <= 0;

  return (
    <div
      className={`mt-3 rounded-2xl border p-3 text-sm font-black ${
        empty
          ? "bg-red-50 border-red-200 text-red-800"
          : low
          ? "bg-amber-50 border-amber-200 text-amber-800"
          : "bg-emerald-50 border-emerald-200 text-emerald-800"
      }`}
    >
      {empty
        ? "Nicht verfügbar"
        : low
        ? `Nur noch ${item.stock} Stück auf Lager`
        : `${item.stock} Stück auf Lager`}
    </div>
  );
}
