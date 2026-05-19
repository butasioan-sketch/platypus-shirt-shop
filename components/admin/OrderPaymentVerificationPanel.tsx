"use client";

import { useState } from "react";

export default function OrderPaymentVerificationPanel() {
  const [paymentId, setPaymentId] = useState("");
  const [saved, setSaved] = useState("");

  function savePaymentReference() {
    const entry = {
      paymentId,
      verifiedAt: new Date().toISOString(),
      status: "payment_verified",
    };

    localStorage.setItem("platypus-payment-verification", JSON.stringify(entry));
    setSaved(`✅ Zahlung referenziert: ${paymentId}`);
  }

  return (
    <div className="mt-8 rounded-[2rem] border border-emerald-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
        Payment Verification
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Stripe Zahlung dokumentieren
      </h2>

      <input
        value={paymentId}
        onChange={(e) => setPaymentId(e.target.value)}
        placeholder="Stripe Payment ID oder Checkout Session ID..."
        className="mt-5 w-full rounded-2xl border border-neutral-300 px-4 py-3 font-bold outline-none focus:border-black"
      />

      <button
        onClick={savePaymentReference}
        disabled={!paymentId}
        className="mt-4 rounded-2xl bg-black px-5 py-3 font-black text-white disabled:bg-neutral-300 disabled:text-neutral-500"
      >
        Zahlung speichern
      </button>

      {saved && (
        <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-900">
          {saved}
        </p>
      )}
    </div>
  );
}
