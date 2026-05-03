export default function FirstSaleChecklist() {
  const items = [
    "Produktbilder sichtbar",
    "Preis klar sichtbar",
    "Versandkosten sichtbar",
    "Zahlungsarten sichtbar",
    "Waschtest vorbereitet",
    "Admin bereit",
  ];

  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        First Sale Readiness
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Bereit für die erste Testbestellung
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 font-black text-emerald-900"
          >
            ✅ {item}
          </div>
        ))}
      </div>
    </div>
  );
}
