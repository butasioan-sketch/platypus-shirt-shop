export default function ProductFinalTrustStack() {
  const items = [
    "Produktdaten transparent",
    "Größe und Fit sichtbar",
    "Druckposition wählbar",
    "Personalisierung geprüft",
    "Versand im Checkout sichtbar",
    "Zahlung über aktivierte Anbieter",
  ];

  return (
    <div className="mt-6 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Vor dem Kauf
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Alles Wichtige ist sichtbar.
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm font-black text-neutral-700"
          >
            ✅ {item}
          </div>
        ))}
      </div>
    </div>
  );
}
