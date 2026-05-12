export default function BrandEndStatement() {
  return (
    <div className="mt-12 overflow-hidden rounded-[2rem] border border-red-600/20 bg-black text-white shadow-2xl">
      <div className="bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.18),transparent_45%)] p-10 text-center sm:p-16">
        <p className="text-xs font-black uppercase tracking-[0.45em] text-red-500">
          Final Statement
        </p>

        <h2 className="mt-6 text-4xl font-black leading-tight sm:text-7xl">
          ON ME.
          <span className="block text-red-500">
            AND IN YOUR HEAD.
          </span>
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-sm font-bold leading-7 text-neutral-300 sm:text-lg">
          PLATYPUS ist mehr als Kleidung. Es ist Präsenz, Identität und Aufbau.
          Von Produktion bis Infrastruktur entsteht alles kontrolliert, dokumentiert und bewusst.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#produkte"
            className="rounded-2xl bg-red-600 px-8 py-4 font-black text-white shadow-xl active:scale-[0.98]"
          >
            Produkte ansehen
          </a>

          <a
            href="/versand"
            className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 font-black text-white active:scale-[0.98]"
          >
            Versand & Zahlung
          </a>
        </div>
      </div>
    </div>
  );
}
