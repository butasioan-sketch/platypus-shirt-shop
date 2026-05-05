export default function ProductComparisonBlock() {
  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Entscheidungshilfe
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Weiß oder Schwarz?
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-5">
          <p className="text-2xl font-black">Weiß</p>
          <p className="mt-2 text-sm text-neutral-600">
            Ideal für helle Motive, klare Details und Sublimation.
          </p>
          <a href="#produkte" className="mt-4 inline-block rounded-xl bg-black px-4 py-3 font-black text-white">
            Weiß ansehen
          </a>
        </div>

        <div className="rounded-2xl bg-black p-5 text-white">
          <p className="text-2xl font-black">Schwarz</p>
          <p className="mt-2 text-sm text-white/70">
            Ideal für starken Kontrast, Streetwear-Look und Flexdruck.
          </p>
          <a href="#produkte" className="mt-4 inline-block rounded-xl bg-white px-4 py-3 font-black text-black">
            Schwarz ansehen
          </a>
        </div>
      </div>
    </div>
  );
}
