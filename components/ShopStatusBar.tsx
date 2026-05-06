"use client";

import { useOrders } from "../store/orders";
import { useInventory } from "../store/inventory";

export default function ShopStatusBar() {
  const orders = useOrders((state) => state.orders);
  const stock = useInventory((state) => state.stock);

  const lowStock = stock.filter((item) => item.stock <= item.minStock).length;
  const revenue = orders.reduce((sum: number, order: any) => sum + Number(order.total || 0), 0);

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
        <p className="text-xs font-black text-neutral-500 uppercase">Bestellungen</p>
        <p className="mt-1 text-3xl font-black">{orders.length}</p>
      </div>

      <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
        <p className="text-xs font-black text-neutral-500 uppercase">Umsatz Demo</p>
        <p className="mt-1 text-3xl font-black">{revenue.toFixed(2)} €</p>
      </div>

      <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
        <p className="text-xs font-black text-neutral-500 uppercase">Lagerwarnungen</p>
        <p className="mt-1 text-3xl font-black">{lowStock}</p>
      </div>
    </div>
  );
}
