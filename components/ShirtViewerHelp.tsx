"use client";

import { useState } from "react";

export default function ShirtViewerHelp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute left-5 bottom-16 z-20">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-black shadow-xl"
      >
        Hilfe
      </button>

      {open && (
        <div className="mt-2 w-64 rounded-2xl bg-white p-4 text-xs font-bold text-neutral-700 shadow-2xl">
          Ziehe das Shirt mit Maus oder Finger, um Vorderseite und Rückseite zu prüfen.
          Nutze die Steuerung unter dem Viewer für Start, Pause und Reset.
        </div>
      )}
    </div>
  );
}
