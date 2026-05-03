"use client";

export default function StockUrgency({ stock }: { stock: number }) {
  if (stock > 8) return null;

  return (
    <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-900">
      <p className="font-black">
        🔥 Nur noch {stock} Stück verfügbar
      </p>
      <p className="text-xs mt-1">
        Hohe Nachfrage – Produktion läuft aktuell
      </p>
    </div>
  );
}
