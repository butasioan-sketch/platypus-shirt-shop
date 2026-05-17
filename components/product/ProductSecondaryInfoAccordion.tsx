"use client";

import { useState } from "react";

export default function ProductSecondaryInfoAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
            Details
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Weitere Produktinfos anzeigen
          </h2>
        </div>

        <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-black">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className="mt-5 grid gap-3 text-sm font-bold text-neutral-700">
          <p>• Pflege: 30°C waschen, auf links drehen.</p>
          <p>• Produktion: Druckdaten werden vor Produktion geprüft.</p>
          <p>• Versand: Versandart wird im Checkout gewählt.</p>
          <p>• Rückgabe: Nicht-personalisierte Artikel nach AGB.</p>
        </div>
      )}
    </div>
  );
}
