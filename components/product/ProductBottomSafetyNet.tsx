export default function ProductBottomSafetyNet() {
  return (
    <div className="mt-8 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-emerald-950 shadow-xl">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-700">
        Sicherer Abschluss
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Du kannst vor dem Bezahlen alles prüfen.
      </h2>

      <p className="mt-3 text-sm font-bold leading-6 text-emerald-900">
        Im Warenkorb und Checkout siehst du Produkt, Menge, Versand und Zahlungsart noch einmal,
        bevor du deine Bestellung abschließt.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 text-sm font-black">
          ✅ Warenkorb prüfen
        </div>

        <div className="rounded-2xl bg-white p-4 text-sm font-black">
          ✅ Versand wählen
        </div>

        <div className="rounded-2xl bg-white p-4 text-sm font-black">
          ✅ Zahlung bestätigen
        </div>
      </div>
    </div>
  );
}
