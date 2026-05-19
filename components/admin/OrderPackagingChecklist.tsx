export default function OrderPackagingChecklist() {
  const checks = [
    "Shirt gefaltet",
    "Druck geschützt",
    "Rechnung/Notiz beigelegt",
    "Paketgröße gewählt",
    "Versandlabel vorbereitet",
    "Tracking dokumentiert",
  ];

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Packaging
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Verpackung & Versand
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {checks.map((check) => (
          <div
            key={check}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm font-black text-neutral-700"
          >
            ☐ {check}
          </div>
        ))}
      </div>
    </div>
  );
}
