"use client";

import { useOrders } from "../../store/orders";
import { useTests } from "../../store/tests";
import { useInventory } from "../../store/inventory";

export default function LaunchScore() {
  const orders = useOrders((state) => state.orders);
  const tests = useTests((state) => state.tests);
  const stock = useInventory((state) => state.stock);

  const hasOrders = orders.length > 0 ? 20 : 0;
  const hasTests = tests.length >= 2 ? 25 : tests.length > 0 ? 10 : 0;
  const lowStock = stock.filter((item) => item.stock <= item.minStock).length;
  const stockScore = lowStock === 0 ? 20 : 10;
  const legalScore = 15;
  const shippingScore = 20;

  const score = hasOrders + hasTests + stockScore + legalScore + shippingScore;

  return (
    <div className="mt-8 rounded-[2rem] bg-black p-6 text-white shadow-xl">
      <p className="text-sm font-black uppercase tracking-widest text-white/50">
        Launch Score
      </p>

      <h2 className="mt-2 text-4xl font-black">
        {score}/100
      </h2>

      <div className="mt-5 h-5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="mt-4 text-sm font-bold text-white/70">
        Ziel: 80+ Punkte vor aggressivem Marketing.
      </p>
    </div>
  );
}
