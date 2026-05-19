"use client";

import { useState } from "react";

export default function OrderCustomerNotePanel() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState("");

  function saveNote() {
    const entry = {
      note,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("platypus-customer-note", JSON.stringify(entry));
    setSaved("✅ Kundennotiz gespeichert.");
  }

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Kundennotiz
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Interne Order-Notiz
      </h2>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="z.B. Kunde wünscht schnelle Lieferung, Druckposition prüfen..."
        className="mt-5 h-36 w-full rounded-2xl border border-neutral-300 p-4 font-bold outline-none focus:border-black"
      />

      <button
        onClick={saveNote}
        disabled={!note}
        className="mt-4 rounded-2xl bg-black px-5 py-3 font-black text-white disabled:bg-neutral-300 disabled:text-neutral-500"
      >
        Notiz speichern
      </button>

      {saved && (
        <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-900">
          {saved}
        </p>
      )}
    </div>
  );
}
