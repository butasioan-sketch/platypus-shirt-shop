"use client";

import { useState } from "react";

export default function OrderImportPanel() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  function importOrders() {
    try {
      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed)) {
        setStatus("❌ Import muss eine JSON-Liste sein.");
        return;
      }

      localStorage.setItem("platypus-manual-orders", JSON.stringify(parsed));
      setStatus(`✅ ${parsed.length} Orders importiert.`);
    } catch {
      setStatus("❌ Ungültiges JSON.");
    }
  }

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Order Import
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Bestellungen importieren
      </h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="JSON Export hier einfügen..."
        className="mt-5 h-52 w-full rounded-2xl border border-neutral-300 p-4 font-mono text-xs outline-none focus:border-black"
      />

      <button
        onClick={importOrders}
        className="mt-4 rounded-2xl bg-black px-5 py-3 font-black text-white"
      >
        Orders importieren
      </button>

      {status && (
        <p className="mt-4 rounded-2xl bg-neutral-50 p-4 text-sm font-black">
          {status}
        </p>
      )}
    </div>
  );
}
