"use client";

import { useState } from "react";

export default function OrderDataResetPanel() {
  const [status, setStatus] = useState("");

  function resetOrderData() {
    if (!confirm("Alle lokalen Order-Daten wirklich löschen?")) return;

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

    keys.forEach((key) => localStorage.removeItem(key));
    setStatus("✅ Lokale Order-Daten wurden gelöscht.");
  }

  return (
    <div className="mt-8 rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-950 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-red-700">
        Reset
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Lokale Testdaten löschen
      </h2>

      <p className="mt-3 text-sm font-bold leading-6 text-red-900">
        Löscht nur lokale Admin-Testdaten im Browser. Stripe-Zahlungen und echte Vercel-Daten bleiben unberührt.
      </p>

      <button
        onClick={resetOrderData}
        className="mt-5 rounded-2xl bg-red-700 px-5 py-3 font-black text-white"
      >
        Order-Testdaten löschen
      </button>

      {status && (
        <p className="mt-4 rounded-2xl bg-white p-4 text-sm font-black text-red-900">
          {status}
        </p>
      )}
    </div>
  );
}
