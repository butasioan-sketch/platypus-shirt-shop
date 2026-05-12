export default function BrandDropCTA() {
  return (
    <div className="mt-8 rounded-[2rem] bg-red-600 p-6 text-white shadow-2xl">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-white/70">
        Limited First Drop
      </p>

      <h2 className="mt-3 text-3xl font-black sm:text-5xl">
        Erste PLATYPUS Serie sichern.
      </h2>

      <p className="mt-4 max-w-2xl text-sm font-bold text-white/80">
        Schwarz. Weiß. Klare Haltung. Eigene Produktion. Limitierte Testserie.
      </p>

      <a
        href="#produkte"
        className="mt-6 inline-block rounded-2xl bg-black px-6 py-4 font-black text-white active:scale-[0.98]"
      >
        Jetzt Drop ansehen
      </a>
    </div>
  );
}
