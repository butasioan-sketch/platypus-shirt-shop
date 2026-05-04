export default function LaunchOffer() {
  return (
    <div className="mt-6 rounded-[2rem] bg-gradient-to-br from-black to-neutral-800 p-6 text-white shadow-xl">
      <p className="text-sm font-black uppercase tracking-widest text-white/50">
        Launch Angebot
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Erste Testserie · begrenzte Stückzahl
      </h2>

      <p className="mt-3 text-white/70">
        Bestelle jetzt aus der ersten PLATYPUS Serie. Produktion, Verpackung und Versand werden intern dokumentiert.
      </p>

      <a
        href="#produkte"
        className="mt-5 inline-block rounded-2xl bg-white px-6 py-4 font-black text-black active:scale-[0.98]"
      >
        Jetzt T-Shirt sichern
      </a>
    </div>
  );
}
