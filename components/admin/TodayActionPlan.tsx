export default function TodayActionPlan() {
  const actions = [
    "1 Testbestellung durchführen",
    "1 weißes Shirt bedrucken",
    "1 schwarzes Shirt bedrucken",
    "Vorher/Nachher Fotos speichern",
    "Waschtest Nummer 1 dokumentieren",
    "Shop-Link an 3 Personen schicken",
  ];

  return (
    <div className="mt-8 rounded-[2rem] bg-black p-6 text-white shadow-xl">
      <p className="text-sm font-black uppercase tracking-widest text-white/50">
        Tagesplan
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Heute näher zum ersten Verkauf
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <div key={action} className="rounded-2xl bg-white/10 p-4 font-black">
            ✅ {action}
          </div>
        ))}
      </div>
    </div>
  );
}
