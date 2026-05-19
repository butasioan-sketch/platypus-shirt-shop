"use client";

import { useState } from "react";

export default function OrderRefundPanel() {
  const [reason, setReason] = useState("");
  const [saved, setSaved] = useState("");

  function saveRefundNote() {
    const entry = {
      reason,
      status: "refund_review_required",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("platypus-refund-note", JSON.stringify(entry));
    setSaved("✅ Refund-Notiz gespeichert. Rückerstattung muss manuell in Stripe geprüft werden.");
  }

  return (
    <div className="mt-8 rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-950 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-red-700">
        Refund Review
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Rückerstattung prüfen
      </h2>

      <p className="mt-3 text-sm font-bold leading-6 text-red-900">
        Dieses Panel dokumentiert nur den internen Refund-Wunsch.
        Die echte Rückerstattung erfolgt manuell im Stripe Dashboard.
      </p>

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Grund für Rückerstattung oder Prüfung..."
        className="mt-5 h-32 w-full rounded-2xl border border-red-200 bg-white p-4 font-bold text-black outline-none focus:border-red-600"
      />

      <button
        onClick={saveRefundNote}
        disabled={!reason}
        className="mt-4 rounded-2xl bg-red-700 px-5 py-3 font-black text-white disabled:bg-red-200 disabled:text-red-500"
      >
        Refund-Prüfung speichern
      </button>

      {saved && (
        <p className="mt-4 rounded-2xl bg-white p-4 text-sm font-black text-red-900">
          {saved}
        </p>
      )}
    </div>
  );
}
