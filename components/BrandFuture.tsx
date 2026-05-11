export default function BrandFuture() {
  const goals = [
    "Eigene Premium Shirt Linie",
    "Limitierte Drops",
    "Professionelle Studio-Fotos",
    "Reale 3D Produktdarstellung",
    "Internationale Lieferung",
    "Komplette Produktionskontrolle",
  ];

  return (
    <div className="mt-8 overflow-hidden rounded-[2rem] border border-red-500/20 bg-black text-white shadow-2xl">
      <div className="bg-[radial-gradient(circle_at_bottom,rgba(255,0,0,0.18),transparent_45%)] p-8 sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-red-500">
          Future Vision
        </p>

        <h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-5xl">
          PLATYPUS entwickelt sich
          <span className="block text-red-500">
            von Shop zu Infrastruktur.
          </span>
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {goals.map((goal) => (
            <div
              key={goal}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="font-black text-lg">
                ☐ {goal}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
