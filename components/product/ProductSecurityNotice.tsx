export default function ProductSecurityNotice() {
  return (
    <div className="mt-6 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-emerald-950 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
        Sicherheit
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Deine Bestellung wird sauber verarbeitet.
      </h2>

      <p className="mt-3 text-sm font-bold leading-6 text-emerald-900">
        Checkout, Zahlung, Versand und Produktionsdaten werden strukturiert geprüft.
        Vor dem Versand erfolgt eine manuelle Qualitätskontrolle.
      </p>
    </div>
  );
}
