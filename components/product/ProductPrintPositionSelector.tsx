"use client";

import { useState } from "react";

const positions = [
  "Brust Mitte",
  "Brust Links",
  "Rücken Mitte",
  "Nacken",
];

export default function ProductPrintPositionSelector() {
  const [position, setPosition] = useState("Brust Mitte");

  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Druckposition
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {positions.map((item) => (
          <button
            key={item}
            onClick={() => setPosition(item)}
            className={`rounded-2xl border px-4 py-3 text-sm font-black ${
              position === item
                ? "border-black bg-black text-white"
                : "border-neutral-300 bg-white text-black"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs font-bold text-neutral-500">
        Ausgewählt: {position}
      </p>
    </div>
  );
}
