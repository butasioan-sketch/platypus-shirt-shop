"use client";

import { useState } from "react";

export default function OrderTrackingPanel() {
  const [tracking, setTracking] = useState("");
  const [saved, setSaved] = useState("");

  function saveTracking() {
    const entry = {
      tracking,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("platypus-last-tracking", JSON.stringify(entry));
    setSaved(`✅ Tracking gespeichert: ${tracking}`);
  }

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Tracking
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Versandnummer dokumentieren
      </h2>

      <input
        value={tracking}
        onChange={(e) => setTracking(e.target.value)}
        placeholder="Trackingnummer eingeben..."
        className="mt-5 w-full rounded-2xl border border-neutral-300 px-4 py-3 font-bold outline-none focus:border-black"
      />

      <button
        onClick={saveTracking}
        disabled={!tracking}
        className="mt-4 rounded-2xl bg-black px-5 py-3 font-black text-white disabled:bg-neutral-300 disabled:text-neutral-500"
      >
        Tracking speichern
      </button>

      {saved && (
        <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-900">
          {saved}
        </p>
      )}
    </div>
  );
}
