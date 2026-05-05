"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentResultBanner() {
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");

  if (!payment) return null;

  if (payment === "success") {
    return (
      <div className="mb-6 rounded-[2rem] bg-emerald-50 border border-emerald-200 p-5 text-emerald-900 shadow-sm">
        <p className="font-black">✅ Zahlung erfolgreich</p>
        <p className="mt-1 text-sm font-bold">
          Danke. Deine Bestellung wurde angenommen und geht in die Produktion.
        </p>
      </div>
    );
  }

  if (payment === "cancel") {
    return (
      <div className="mb-6 rounded-[2rem] bg-amber-50 border border-amber-200 p-5 text-amber-900 shadow-sm">
        <p className="font-black">⚠️ Zahlung abgebrochen</p>
        <p className="mt-1 text-sm font-bold">
          Kein Problem. Du kannst den Checkout jederzeit erneut starten.
        </p>
      </div>
    );
  }

  return null;
}
