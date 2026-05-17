export default function ProductReviewHighlight() {
  return (
    <div className="mt-6 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Erste Stimmen
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
          <p className="text-lg">★★★★★</p>
          <p className="mt-2 text-sm font-bold text-neutral-700">
            Stoff fühlt sich deutlich hochwertiger an als typische Basic-Shirts.
          </p>
          <p className="mt-3 text-xs font-black text-neutral-500">
            Testkunde A
          </p>
        </div>

        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
          <p className="text-lg">★★★★★</p>
          <p className="mt-2 text-sm font-bold text-neutral-700">
            Der minimalistische Schwarz-Weiß Fokus wirkt sehr clean und modern.
          </p>
          <p className="mt-3 text-xs font-black text-neutral-500">
            Testkunde B
          </p>
        </div>
      </div>
    </div>
  );
}
