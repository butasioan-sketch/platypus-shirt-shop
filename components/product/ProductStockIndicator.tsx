export default function ProductStockIndicator() {
  return (
    <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
      <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
        Lagerstatus
      </p>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-2xl font-black">100 Stück</p>
          <p className="text-sm font-bold text-emerald-700">
            Sofort für Testserie verfügbar
          </p>
        </div>

        <div className="h-4 w-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-400/50" />
      </div>
    </div>
  );
}
