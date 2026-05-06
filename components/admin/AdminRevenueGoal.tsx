"use client";

import { useOrders } from "../../store/orders";

export default function AdminRevenueGoal() {
  const orders = useOrders((state) => state.orders);
  const revenue = orders.reduce((sum: number, order: any) => sum + Number(order.total || 0), 0);
  const goal = 500;
  const progress = Math.min(100, Math.round((revenue / goal) * 100));

  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Umsatz-Ziel
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Erstes Ziel: {goal.toFixed(2)} €
      </h2>

      <div className="mt-5 h-5 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 font-black">
        {revenue.toFixed(2)} € erreicht · {progress}%
      </p>
    </div>
  );
}
