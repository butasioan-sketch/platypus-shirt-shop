"use client";

import { useEffect, useState } from "react";

export default function ExitIntentOffer() {
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY < 10) {
        setShow(true);
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [closed]);

  if (!show || closed) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-[1.5rem] border border-neutral-200 bg-white p-5 text-black shadow-2xl sm:bottom-6 sm:right-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-red-600">
            PLATYPUS Drop
          </p>

          <h2 className="mt-2 text-xl font-black">
            Erste Testserie sichern
          </h2>

          <p className="mt-2 text-sm font-bold text-neutral-600">
            Der Shop bleibt frei bedienbar. Du kannst weiter navigieren.
          </p>
        </div>

        <button
          onClick={() => setClosed(true)}
          className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-black text-neutral-500"
        >
          ×
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <a
          href="#produkte"
          className="flex-1 rounded-2xl bg-black px-4 py-3 text-center text-sm font-black text-white"
        >
          Produkte
        </a>

        <button
          onClick={() => setClosed(true)}
          className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-black text-black"
        >
          Später
        </button>
      </div>
    </div>
  );
}
