export default function BrandSystemProof() {
  const systems = [
    {
      title: "Shop",
      text: "Live Website, Produktseiten, Warenkorb und Checkout.",
    },
    {
      title: "Produktion",
      text: "Waschtests, Druckprotokolle, Produktionsschein und Qualitätskontrolle.",
    },
    {
      title: "Business",
      text: "Admin, Lager, Newsletter, Marketing-Links und Sales-Plan.",
    },
  ];

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-red-600">
        System Proof
      </p>

      <h2 className="mt-3 text-3xl font-black sm:text-5xl">
        Nicht nur Marke.
        <span className="block text-red-600">
          Ein funktionierendes System.
        </span>
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {systems.map((system) => (
          <div
            key={system.title}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5"
          >
            <p className="text-xl font-black">{system.title}</p>
            <p className="mt-2 text-sm font-bold leading-6 text-neutral-600">
              {system.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
