"use client";

import { useState } from "react";

export default function OrderCompletionPanel() {
  const [done, setDone] = useState(false);

  function completeOrder() {
    const entry = {
      status: "completed",
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem("platypus-last-order-completion", JSON.stringify(entry));
    setDone(true);
  }

  return (
    <div className="mt-8 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-emerald-950 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
        Abschluss
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Bestellung abschließen
      </h2>

      <p className="mt-3 text-sm font-bold leading-6 text-emerald-900">
        Nutze diesen Schritt erst, wenn Zahlung, Produktion, Qualitätskontrolle,
        Verpackung und Tracking geprüft wurden.
      </p>

      <button
        onClick={completeOrder}
        className="mt-5 rounded-2xl bg-emerald-700 px-5 py-3 font-black text-white"
      >
        Order als abgeschlossen markieren
      </button>

      {done && (
        <p className="mt-4 rounded-2xl bg-white p-4 text-sm font-black text-emerald-900">
          ✅ Bestellung wurde als abgeschlossen markiert.
        </p>
      )}
    </div>
  );
}
