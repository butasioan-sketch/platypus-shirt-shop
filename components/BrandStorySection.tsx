export default function BrandStorySection() {
  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-red-600">
        Story
      </p>

      <h2 className="mt-3 text-3xl font-black sm:text-5xl">
        PLATYPUS entsteht nicht aus Zufall.
      </h2>

      <p className="mt-5 max-w-3xl text-sm font-bold leading-7 text-neutral-600 sm:text-base">
        PLATYPUS ist ein Aufbauprojekt: eigene Shirts, eigene Produktion, eigene Tests,
        eigene Infrastruktur. Jeder Schritt wird dokumentiert, verbessert und kontrolliert.
        Aus Idee wird System. Aus System wird Marke.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
          <p className="font-black">Start</p>
          <p className="mt-1 text-sm text-neutral-600">Shirts, Maschinen, erster Shop.</p>
        </div>

        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
          <p className="font-black">Aufbau</p>
          <p className="mt-1 text-sm text-neutral-600">Tests, Qualität, Checkout, Admin.</p>
        </div>

        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
          <p className="font-black">Ziel</p>
          <p className="mt-1 text-sm text-neutral-600">Echte Marke mit eigener Kontrolle.</p>
        </div>
      </div>
    </div>
  );
}
