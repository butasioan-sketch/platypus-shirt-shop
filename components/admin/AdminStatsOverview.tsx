"use client";

import { useOrders } from "../../store/orders";
import { useTests } from "../../store/tests";
import { useInventory } from "../../store/inventory";

export default function AdminStatsOverview() {
  const orders = useOrders((state) => state.orders);
  const tests = useTests((state) => state.tests);
  const stock = useInventory((state) => state.stock);

  const revenue = orders.reduce((sum: number, order: any) => sum + Number(order.total || 0), 0);
  const lowStock = stock.filter((item) => item.stock <= item.minStock).length;
  const openOrders = orders.filter((order: any) => order.status === "offen").length;

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-4">
      <div className="rounded-3xl bg-white border border-neutral-200 p-5 shadow-sm">
        <p className="text-neutral-500 font-bold">Umsatz</p>
        <p className="text-4xl font-black">{revenue.toFixed(2)} €</p>
      </div>

      <div className="rounded-3xl bg-white border border-neutral-200 p-5 shadow-sm">
        <p className="text-neutral-500 font-bold">Bestellungen offen</p>
        <p className="text-4xl font-black">{openOrders}</p>
      </div>

      <div className="rounded-3xl bg-white border border-neutral-200 p-5 shadow-sm">
        <p className="text-neutral-500 font-bold">Waschtests</p>
        <p className="text-4xl font-black">{tests.length}</p>
      </div>

      <div className="rounded-3xl bg-white border border-neutral-200 p-5 shadow-sm">
        <p className="text-neutral-500 font-bold">Lagerwarnungen</p>
        <p className="text-4xl font-black">{lowStock}</p>
      </div>
    </div>
  );
}
