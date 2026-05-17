export default function ProductLaunchReadiness() {
  const items = [
    {
      title: "Shop",
      value: "Online",
    },
    {
      title: "Checkout",
      value: "Aktiv",
    },
    {
      title: "Produktion",
      value: "Vorbereitet",
    },
    {
      title: "Versand",
      value: "Konfiguriert",
    },
  ];

  return (
    <div className="mt-6 rounded-[2rem] border border-black bg-black p-6 text-white shadow-2xl">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
        Launch Readiness
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Erste Bestellungen können verarbeitet werden.
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-white/10 p-4 backdrop-blur"
          >
            <p className="text-xs font-black uppercase tracking-widest text-white/50">
              {item.title}
            </p>

            <p className="mt-2 text-xl font-black">
              ✅ {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
