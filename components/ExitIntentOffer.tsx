"use client";

import { useEffect, useState } from "react";

export default function ExitIntentOffer() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY < 10) {
        setShow(true);
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl">
        <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
          Warte kurz
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Sichere dir dein Shirt jetzt
        </h2>

        <p className="mt-3 text-sm text-neutral-600">
          Erste Serie. Begrenzte Stückzahl. Produktion läuft bereits.
        </p>

        <a
          href="#produkte"
          className="mt-5 inline-block w-full rounded-2xl bg-black px-5 py-4 font-black text-white"
        >
          Jetzt zurück zum Shop
        </a>

        <button
          onClick={() => setShow(false)}
          className="mt-3 text-xs font-bold text-neutral-500 underline"
        >
          Schließen
        </button>
      </div>
    </div>
  );
}
