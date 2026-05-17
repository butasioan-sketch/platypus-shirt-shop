export default function ProductQualityChecklist() {
  const checks = [
    "Druckposition geprüft",
    "Text lesbar",
    "Stoff sauber",
    "Farbe korrekt",
    "Verpackung geprüft",
    "Versanddaten geprüft",
  ];

  return (
    <div className="mt-6 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Qualitätscheck
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
