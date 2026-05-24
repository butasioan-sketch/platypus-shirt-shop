export default function OrderAdminFinalSummary() {
  const items = [
    "Zahlung dokumentieren",
    "Risk Check durchführen",
    "Produktion prüfen",
    "Packaging vorbereiten",
    "Tracking speichern",
    "Order abschließen",
    "Testdaten bei Bedarf löschen",
  ];

  return (
    <div className="mt-8 rounded-[2rem] border border-black bg-black p-6 text-white shadow-2xl">
      <p className="text-xs font-black uppercase tracking-widest text-red-500">
        Final Order System
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Admin Orders ist jetzt als Arbeitszentrale nutzbar.
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
