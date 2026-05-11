export default function BrandMission() {
  return (
    <div className="mt-8 overflow-hidden rounded-[2rem] border border-neutral-800 bg-neutral-950 text-white shadow-2xl">
      <div className="bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.18),transparent_40%)] p-8 sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-red-500">
          Brand Mission
        </p>

        <h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-5xl">
          Kleidung als Aussage.
          <span className="block text-red-500">
            Nicht nur als Produkt.
          </span>
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-black uppercase tracking-widest text-red-400">
              Qualität
            </p>

            <p className="mt-2 text-sm font-bold text-neutral-300">
              Hochwertige Stoffe, reale Waschtests und kontrollierte Produktion.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-black uppercase tracking-widest text-red-400">
              Wirkung
            </p>

            <p className="mt-2 text-sm font-bold text-neutral-300">
              Designs mit Präsenz, Haltung und Wiedererkennungswert.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-black uppercase tracking-widest text-red-400">
              Infrastruktur
            </p>

            <p className="mt-2 text-sm font-bold text-neutral-300">
              Eigene Systeme statt Baukasten-Limits. Volle Kontrolle über Marke und Shop.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
