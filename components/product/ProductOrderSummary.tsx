export default function ProductOrderSummary() {
  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Bestellübersicht
      </p>

      <div className="mt-4 grid gap-3 text-sm font-bold text-neutral-700">
        <div className="flex justify-between">
          <span>Produkt</span>
          <span>PLATYPUS Shirt</span>
        </div>

        <div className="flex justify-between">
          <span>Produktion</span>
          <span>Eigene Fertigung</span>
        </div>

        <div className="flex justify-between">
          <span>Prüfung</span>
          <span>Manuelle Kontrolle</span>
        </div>

        <div className="flex justify-between">
          <span>Versand</span>
          <span>Im Checkout wählbar</span>
        </div>
      </div>
    </div>
  );
}
