"use client";

import { useState } from "react";

const fits = [
  {
    id: "regular",
    label: "Regular Fit",
    text: "Klassischer Schnitt",
  },
  {
    id: "oversized",
    label: "Oversized",
    text: "Locker und breiter",
  },
];

export default function ProductFitSelector() {
  const [selected, setSelected] = useState("regular");

  return (
    <div className="mt-6">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Fit wählen
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {fits.map((fit) => (
          <button
            key={fit.id}
            onClick={() => setSelected(fit.id)}
            className={`rounded-2xl border p-4 text-left transition ${
              selected === fit.id
                ? "border-black bg-black text-white"
                : "border-neutral-300 bg-white text-black"
            }`}
          >
            <p className="font-black">{fit.label}</p>
            <p className="mt-1 text-xs opacity-70">{fit.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
