export default function TestOrderScript() {
  const steps = [
    "Shop öffnen",
    "Weißes Shirt Größe M auswählen",
    "1 Stück in Warenkorb legen",
    "Checkout öffnen",
    "Versandart auswählen",
    "Zahlungsart Karte auswählen",
    "Testzahlung durchführen",
    "Admin prüfen",
    "Produktionsschein drucken",
    "Lagerbestand prüfen",
  ];

  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Testbestellung Script
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Einmal komplett durchtesten
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {steps.map((step, index) => (
          <div key={step} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 font-black">
            {index + 1}. {step}
          </div>
        ))}
      </div>
    </div>
  );
}
