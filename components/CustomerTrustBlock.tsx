export default function CustomerTrustBlock() {
  return (
    <div className="mt-6 rounded-[2rem] bg-neutral-950 p-6 text-white shadow-xl">
      <p className="text-sm font-black uppercase tracking-widest text-white/50">
        Warum PLATYPUS?
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Kein Massenprodukt. Eigene Produktion. Klare Qualität.
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="font-black">Schwarz & Weiß</p>
          <p className="mt-1 text-sm text-white/60">Fokus statt Chaos.</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4">
          <p className="font-black">Waschtest</p>
          <p className="mt-1 text-sm text-white/60">Qualität wird geprüft.</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4">
          <p className="font-black">Eigenproduktion</p>
          <p className="mt-1 text-sm text-white/60">Direkt aus dem Studio.</p>
        </div>
      </div>
    </div>
  );
}
