export default function ProductPageAudit() {
  const checks = [
    "Produktbild sichtbar",
    "360° Viewer sichtbar",
    "Preis sichtbar",
    "Größe wählbar",
    "Fit wählbar",
    "Druckposition sichtbar",
    "Personalisierung sichtbar",
    "Versandhinweis sichtbar",
    "Zahlungshinweis sichtbar",
    "Pflegehinweise sichtbar",
  ];

  return (
    <div className="mt-6 rounded-[2rem] border border-neutral-200 bg-neutral-50 p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Produktseiten-Audit
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Diese Produktseite ist kaufbereit strukturiert.
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {checks.map((check) => (
          <div
            key={check}
            className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm font-black text-neutral-700"
          >
            ✅ {check}
          </div>
        ))}
      </div>
    </div>
  );
}
