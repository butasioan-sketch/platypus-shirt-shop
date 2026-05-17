export default function ProductConfidenceBar() {
  const items = [
    "Preis klar",
    "Versand klar",
    "Zahlung klar",
    "Produktion klar",
  ];

  return (
    <div className="mt-6 rounded-2xl bg-black p-5 text-white shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-white/50">
        Kaufklarheit
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-xl bg-white/10 p-3 text-center text-xs font-black"
          >
            ✅ {item}
          </div>
        ))}
      </div>
    </div>
  );
}
