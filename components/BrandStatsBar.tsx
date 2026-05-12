export default function BrandStatsBar() {
  const stats = [
    {
      value: "360°",
      label: "Produktansicht",
    },
    {
      value: "100%",
      label: "Eigene Infrastruktur",
    },
    {
      value: "24/7",
      label: "Live Deployment",
    },
    {
      value: "∞",
      label: "Skalierbarkeit",
    },
  ];

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[2rem] border border-neutral-200 bg-white p-6 text-center shadow-xl"
        >
          <p className="text-4xl font-black text-red-600">
            {stat.value}
          </p>

          <p className="mt-2 text-sm font-black uppercase tracking-widest text-neutral-500">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
