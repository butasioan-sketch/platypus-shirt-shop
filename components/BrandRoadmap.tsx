export default function BrandRoadmap() {
  const roadmap = [
    {
      phase: "Phase 1",
      title: "Shop & Infrastruktur",
      text: "Eigener Shop, Admin, Deployments, Zahlungsstruktur und Produktbasis.",
    },
    {
      phase: "Phase 2",
      title: "Content & Produktion",
      text: "Studiofotos, Waschtests, echte Produktshots und verbesserte 360° Ansicht.",
    },
    {
      phase: "Phase 3",
      title: "Drops & Skalierung",
      text: "Limitierte Kollektionen, Marketing, internationale Reichweite und Automatisierung.",
    },
  ];

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-900 bg-neutral-950 p-8 text-white shadow-2xl">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-red-500">
        Roadmap
      </p>

      <h2 className="mt-4 text-3xl font-black sm:text-5xl">
        Der Aufbau läuft bereits.
      </h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {roadmap.map((item) => (
          <div
            key={item.phase}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <p className="text-sm font-black uppercase tracking-widest text-red-400">
              {item.phase}
            </p>

            <p className="mt-3 text-2xl font-black">
              {item.title}
            </p>

            <p className="mt-3 text-sm font-bold leading-6 text-neutral-300">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
