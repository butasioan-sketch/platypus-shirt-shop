"use client";

import { useState } from "react";

export default function OrderExportPanel() {
  const [exportText, setExportText] = useState("");

  function exportOrders() {
    const orders = JSON.parse(localStorage.getItem("platypus-manual-orders") || "[]");
    const text = JSON.stringify(orders, null, 2);
    setExportText(text);
    navigator.clipboard.writeText(text);
    alert("Orders wurden in die Zwischenablage kopiert.");
  }

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Order Export
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Bestellungen exportieren
      </h2>

      <button
        onClick={exportOrders}
        className="mt-5 rounded-2xl bg-black px-5 py-3 font-black text-white"
      >
        Orders kopieren
      </button>

      {exportText && (
        <pre className="mt-5 max-h-80 overflow-auto rounded-2xl bg-neutral-950 p-4 text-xs font-bold text-white">
          {exportText}
        </pre>
      )}
    </div>
  );
}
