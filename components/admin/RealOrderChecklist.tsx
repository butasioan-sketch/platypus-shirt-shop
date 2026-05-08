export default function RealOrderChecklist() {
  const tasks = [
    "Echte Versandadresse testen",
    "Stripe-Zahlung erfolgreich testen",
    "Verpackung fotografieren",
    "Trackingnummer dokumentieren",
    "Kundenmail prüfen",
    "Waschtest nach Versand dokumentieren",
  ];

  return (
    <div className="mt-8 rounded-[2rem] bg-emerald-50 border border-emerald-200 p-6 shadow-xl">
      <p className="text-sm font-black uppercase tracking-widest text-emerald-700">
        Real Order Check
      </p>

      <h2 className="mt-2 text-3xl font-black text-emerald-950">
        Vorbereitung für echte Bestellungen
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {tasks.map((task) => (
          <div
            key={task}
            className="rounded-2xl bg-white border border-emerald-200 p-4 font-black text-emerald-900"
          >
            ☐ {task}
          </div>
        ))}
      </div>
    </div>
  );
}
