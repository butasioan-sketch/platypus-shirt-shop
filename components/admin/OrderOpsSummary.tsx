export default function OrderOpsSummary() {
  const items = [
    "Stripe Zahlung prüfen",
    "Order manuell erfassen",
    "Produktionsdaten kontrollieren",
    "Tracking speichern",
    "Order abschließen",
  ];

  return (
    <div className="mt-8 rounded-[2rem] border border-black bg-black p-6 text-white shadow-2xl">
      <p className="text-xs font-black uppercase tracking-widest text-red-500">
        Order Ops
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Zentrale für echte Testbestellungen
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-white/10 p-4 text-sm font-black"
          >
            ✅ {item}
          </div>
        ))}
      </div>
    </div>
  );
}
