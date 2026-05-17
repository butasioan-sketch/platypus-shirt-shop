export default function ProductNextDropBanner() {
  return (
    <div className="mt-6 overflow-hidden rounded-[2rem] border border-black bg-black text-white shadow-2xl">
      <div className="bg-gradient-to-r from-red-600 via-black to-red-600 p-[1px]">
        <div className="rounded-[2rem] bg-black p-6">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
            Next Drop
          </p>

          <h2 className="mt-3 text-3xl font-black leading-tight">
            Weitere Farben und neue Prints werden vorbereitet.
          </h2>

          <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-white/70">
            Die erste Serie fokussiert bewusst Schwarz und Weiß.
            Neue Motive, weitere Stoffe und zusätzliche Fits werden nach den ersten Testbestellungen erweitert.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <div className="rounded-full bg-white/10 px-4 py-2 text-xs font-black">
              Schwarz & Weiß Fokus
            </div>

            <div className="rounded-full bg-white/10 px-4 py-2 text-xs font-black">
              Neue Prints geplant
            </div>

            <div className="rounded-full bg-white/10 px-4 py-2 text-xs font-black">
              Weitere Fits vorbereitet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
