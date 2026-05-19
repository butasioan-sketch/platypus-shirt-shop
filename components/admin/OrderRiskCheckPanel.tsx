"use client";

import { useState } from "react";

export default function OrderRiskCheckPanel() {
  const [checked, setChecked] = useState(false);

  function markChecked() {
    const entry = {
      status: "risk_checked",
      checkedAt: new Date().toISOString(),
      notes: [
        "Zahlung geprüft",
        "Bestelldaten geprüft",
        "Adresse prüfen",
        "Ungewöhnliche Angaben prüfen",
      ],
    };

    localStorage.setItem("platypus-order-risk-check", JSON.stringify(entry));
    setChecked(true);
  }

  return (
    <div className="mt-8 rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-amber-700">
        Risk Check
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Bestellung vor Produktion prüfen
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 text-sm font-black">
          ☐ Zahlungsstatus geprüft
        </div>

        <div className="rounded-2xl bg-white p-4 text-sm font-black">
          ☐ Lieferadresse plausibel
        </div>

        <div className="rounded-2xl bg-white p-4 text-sm font-black">
          ☐ Produktdaten vollständig
        </div>

        <div className="rounded-2xl bg-white p-4 text-sm font-black">
          ☐ Keine Auffälligkeiten
        </div>
      </div>

      <button
        onClick={markChecked}
        className="mt-5 rounded-2xl bg-black px-5 py-3 font-black text-white"
      >
        Risk Check speichern
      </button>

      {checked && (
        <p className="mt-4 rounded-2xl bg-white p-4 text-sm font-black text-amber-900">
          ✅ Risk Check gespeichert.
        </p>
      )}
    </div>
  );
}
