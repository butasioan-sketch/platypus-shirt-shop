"use client";

import { useEffect, useState } from "react";

type Metrics = {
  orders: number;
  revenue: number;
  tracking: number;
};

export default function OrderAnalyticsPanel() {
  const [metrics, setMetrics] = useState<Metrics>({
    orders: 0,
    revenue: 0,
    tracking: 0,
  });

  useEffect(() => {
    const orders = JSON.parse(
      localStorage.getItem("platypus-manual-orders") || "[]"
    );

    const revenue = orders.reduce((sum: number, order: any) => {
      const clean = String(order.total || "0")
        .replace("€", "")
        .replace(",", ".")
        .trim();

      return sum + Number(clean || 0);
    }, 0);

    const tracking = localStorage.getItem("platypus-last-tracking");

    setMetrics({
      orders: orders.length,
      revenue,
      tracking: tracking ? 1 : 0,
    });
  }, []);

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Analytics
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Order Übersicht
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-neutral-100 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
            Orders
          </p>

          <p className="mt-2 text-5xl font-black">
            {metrics.orders}
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-5 text-emerald-950">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
            Umsatz
          </p>

          <p className="mt-2 text-5xl font-black">
            € {metrics.revenue.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-5 text-blue-950">
          <p className="text-xs font-black uppercase tracking-widest text-blue-700">
            Tracking
          </p>

          <p className="mt-2 text-5xl font-black">
            {metrics.tracking}
          </p>
        </div>
      </div>
    </div>
  );
}
