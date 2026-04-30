export default function QualityRecommendation({ tests }: { tests: any[] }) {
  const latest = tests[0];
  const sellable = tests.filter((t) => t.rating === "Sehr gut" || t.rating === "Gut").length;
  const bad = tests.filter((t) => t.rating === "Problem" || t.rating === "Nicht verkaufen").length;

  let message = "Noch nicht genug Tests für eine Empfehlung.";
  let style = "bg-neutral-50 border-neutral-200 text-neutral-700";

  if (tests.length >= 3 && sellable >= 3 && bad === 0) {
    message = "Produkt wirkt testbereit. Weiter mit 5–10 Waschzyklen prüfen.";
    style = "bg-emerald-50 border-emerald-200 text-emerald-900";
  }

  if (bad > 0) {
    message = "Achtung: Probleme erkannt. Vor Verkauf Druckparameter verbessern.";
    style = "bg-red-50 border-red-200 text-red-900";
  }

  return (
    <div className={`mt-8 rounded-[2rem] border p-6 shadow-sm ${style}`}>
      <p className="text-sm font-black uppercase tracking-widest">Qualitäts-Empfehlung</p>
      <h2 className="mt-2 text-2xl font-black">{message}</h2>

      {latest && (
        <p className="mt-3 text-sm">
          Letzter Test: {latest.productName} · Waschgang {latest.washCount} · Bewertung {latest.rating}
        </p>
      )}
    </div>
  );
}
