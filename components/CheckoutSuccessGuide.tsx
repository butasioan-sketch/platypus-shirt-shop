export default function CheckoutSuccessGuide() {
  return (
    <div className="mt-6 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-emerald-950 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
        Nach erfolgreicher Zahlung
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Bestellung prüfen und Produktion vorbereiten.
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 text-sm font-black">
          ✅ Zahlung im Stripe Dashboard prüfen
        </div>

        <div className="rounded-2xl bg-white p-4 text-sm font-black">
          ✅ Bestellung im Admin dokumentieren
        </div>

        <div className="rounded-2xl bg-white p-4 text-sm font-black">
          ✅ Produktdaten für Druck prüfen
        </div>

        <div className="rounded-2xl bg-white p-4 text-sm font-black">
          ✅ Versand vorbereiten
        </div>
      </div>
    </div>
  );
}
