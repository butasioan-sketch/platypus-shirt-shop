export default function BuyConfidenceBlock() {
  const items = [
    "Sichere Zahlung",
    "Versand ab 3,99 €",
    "Kostenlos ab 70 €",
    "Eigenproduktion",
    "Waschtest dokumentiert",
    "Regular Fit",
  ];

  return (
    <div className="mt-6 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Sicher kaufen
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 font-black"
          >
            ✅ {item}
          </div>
        ))}
      </div>
    </div>
  );
}
