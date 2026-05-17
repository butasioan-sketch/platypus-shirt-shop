"use client";

import { useState } from "react";

export default function ProductPersonalization() {
  const [text, setText] = useState("");

  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Personalisierung
      </p>

      <input
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 28))}
        placeholder="Optionaler Text auf dem Shirt"
        className="mt-3 w-full rounded-2xl border border-neutral-300 px-4 py-3 font-bold outline-none focus:border-black"
      />

      <p className="mt-2 text-xs font-bold text-neutral-500">
        {text.length}/28 Zeichen
      </p>

      {text && (
        <div className="mt-4 rounded-2xl bg-black p-4 text-center text-white">
          <p className="text-xs font-bold text-white/50">Vorschau Text</p>
          <p className="mt-1 text-xl font-black">{text}</p>
        </div>
      )}
    </div>
  );
}
