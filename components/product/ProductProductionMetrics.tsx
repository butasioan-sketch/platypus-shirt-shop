export default function ProductProductionMetrics() {
  const metrics = [
    {
      label: "Waschtest",
      value: "Dokumentiert",
    },
    {
      label: "Produktion",
      value: "Eigenkontrolle",
    },
    {
      label: "Versand",
      value: "Vorbereitet",
    },
    {
      label: "Qualitätsprüfung",
      value: "Manuell",
    },
  ];

  return (
    <div className="mt-6 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Produktionsstatus
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
          >
            <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
              {metric.label}
            </p>

            <p className="mt-2 text-lg font-black text-black">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
