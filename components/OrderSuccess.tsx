"use client";

import { getPaymentLabel } from "../lib/paymentLabels";

export default function OrderSuccess({
  order,
  onClose,
}: {
  order: any;
  onClose: () => void;
}) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center p-5">
      <div className="bg-white rounded-[2rem] max-w-md w-full p-6 shadow-2xl">
        <p className="text-sm font-black text-emerald-700">BESTELLUNG GESPEICHERT</p>

        <h2 className="mt-2 text-3xl font-black">Danke für deine Bestellung.</h2>

        <div className="mt-5 rounded-2xl bg-neutral-50 border border-neutral-200 p-4 text-sm space-y-2">
          <p><b>Referenz:</b> {order.reference}</p>
          <p><b>Zahlung:</b> {getPaymentLabel(order.paymentMethod)}</p>
          <p><b>Gesamt:</b> {Number(order.total || 0).toFixed(2)} €</p>
          <p><b>Status:</b> {order.status}</p>
        </div>

        <p className="mt-4 text-sm text-neutral-600">
          Deine Bestellung ist jetzt im Produktions-Dashboard sichtbar.
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-black text-white py-4 rounded-2xl font-black"
        >
          Schließen
        </button>
      </div>
    </div>
  );
}
