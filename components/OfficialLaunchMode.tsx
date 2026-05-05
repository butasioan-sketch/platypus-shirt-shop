export default function OfficialLaunchMode() {
  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Verkaufsstatus
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Testverkauf aktiv
      </h2>

      <p className="mt-3 text-neutral-600 font-bold">
        Der Shop ist live. Bestellungen werden als reale Testbestellungen behandelt, bis Produktqualität, Versand und Zahlung final geprüft sind.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 font-black text-emerald-900">
          ✅ Shop online
        </div>

        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 font-black text-emerald-900">
          ✅ Checkout aktiv
        </div>

        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 font-black text-amber-900">
          ⚠️ Testserie
        </div>
      </div>
    </div>
  );
}
