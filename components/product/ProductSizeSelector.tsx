"use client";

import { useState } from "react";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductSizeSelector() {
  const [selected, setSelected] = useState("M");

  return (
    <div className="mt-6">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Größe wählen
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelected(size)}
            className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${
              selected === size
                ? "border-black bg-black text-white"
                : "border-neutral-300 bg-white text-black"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs font-bold text-neutral-500">
        Ausgewählt: {selected}
      </p>
    </div>
  );
}
