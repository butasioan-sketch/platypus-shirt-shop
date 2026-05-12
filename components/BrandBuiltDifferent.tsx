export default function BrandBuiltDifferent() {
  const points = [
    "Eigener Code statt Baukasten",
    "Eigene Produktion statt Dropshipping",
    "Eigene Tests statt leere Versprechen",
    "Eigene Infrastruktur statt Plattform-Abhängigkeit",
  ];

  return (
    <div className="mt-8 rounded-[2rem] border border-red-600/20 bg-black p-8 text-white shadow-2xl">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-red-500">
        Built Different
      </p>

      <h2 className="mt-4 text-3xl font-black sm:text-5xl">
        PLATYPUS wird nicht geklickt.
        <span className="block text-red-500">
          PLATYPUS wird gebaut.
        </span>
      </h2>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {points.map((point) => (
          <div key={point} className="rounded-2xl border border-white/10 bg-white/5 p-5 font-black">
            {point}
          </div>
        ))}
      </div>
    </div>
  );
}
