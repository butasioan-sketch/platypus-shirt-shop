export default function BrandProductPromise() {
  const promises = [
    {
      title: "Keine Massenware",
      text: "Jedes Shirt entsteht aus einer kontrollierten Kleinserie.",
    },
    {
      title: "Klare Optik",
      text: "Schwarz, Weiß, Rot. Fokus statt Überladung.",
    },
    {
      title: "Eigenes System",
      text: "Shop, Produktion, Tests und Versand werden intern aufgebaut.",
    },
  ];

  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-red-600">
        Product Promise
      </p>

      <h2 className="mt-3 text-3xl font-black sm:text-5xl">
        PLATYPUS steht für Kontrolle.
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {promises.map((promise) => (
          <div
            key={promise.title}
            className="rounded-2xl bg-neutral-50 border border-neutral-200 p-5"
          >
            <p className="text-xl font-black">{promise.title}</p>
            <p className="mt-2 text-sm font-bold text-neutral-600">
              {promise.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
