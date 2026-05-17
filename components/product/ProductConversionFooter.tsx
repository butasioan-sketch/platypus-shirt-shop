export default function ProductConversionFooter() {
  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-2xl">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">
        Ready
      </p>

      <h2 className="mt-3 text-4xl font-black leading-tight">
        Jetzt die erste PLATYPUS Bestellung starten.
      </h2>

      <p className="mt-4 max-w-2xl text-sm font-bold leading-6 text-neutral-600">
        Produkt, Fit, Größe und Personalisierung sind vorbereitet.
        Die erste Testserie dient dazu, Produktion, Versand und Qualität final zu perfektionieren.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="/cart"
          className="rounded-2xl bg-black px-6 py-4 text-sm font-black text-white"
        >
          Zum Warenkorb
        </a>

        <a
          href="/versand"
          className="rounded-2xl border border-neutral-300 bg-white px-6 py-4 text-sm font-black text-black"
        >
          Versand ansehen
        </a>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-neutral-50 p-4 text-sm font-black">
          ✅ 360° Produktansicht
        </div>

        <div className="rounded-2xl bg-neutral-50 p-4 text-sm font-black">
          ✅ Kontrollierte Produktion
        </div>

        <div className="rounded-2xl bg-neutral-50 p-4 text-sm font-black">
          ✅ Stripe Checkout aktiv
        </div>
      </div>
    </div>
  );
}
