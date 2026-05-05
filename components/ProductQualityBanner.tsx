export default function ProductQualityBanner() {
  return (
    <div className="mt-6 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Qualität vor Verkauf
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Jede erste Serie wird intern geprüft.
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
          <p className="font-black">Drucktest</p>
          <p className="mt-1 text-sm text-neutral-600">Temperatur, Zeit und Druck werden dokumentiert.</p>
        </div>

        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
          <p className="font-black">Waschtest</p>
          <p className="mt-1 text-sm text-neutral-600">Mehrere Waschgänge werden geprüft.</p>
        </div>

        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
          <p className="font-black">Versandtest</p>
          <p className="mt-1 text-sm text-neutral-600">Verpackung und Lieferprozess werden getestet.</p>
        </div>
      </div>
    </div>
  );
}
