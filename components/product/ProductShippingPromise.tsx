export default function ProductShippingPromise() {
  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Versandversprechen
      </p>

      <p className="mt-2 text-sm font-bold text-neutral-700">
        Versandart und Kosten wählst du im Checkout. Jede Bestellung wird vor dem Versand geprüft und sauber verpackt.
      </p>

      <a
        href="/versand"
        className="mt-4 inline-block rounded-2xl bg-black px-5 py-3 text-sm font-black text-white"
      >
        Versandoptionen ansehen
      </a>
    </div>
  );
}
