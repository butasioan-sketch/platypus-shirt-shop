export default function ProductPageReducePlan() {
  const keep = [
    "Viewer",
    "Preis",
    "Größe",
    "Fit",
    "Warenkorb",
    "Versand",
  ];

  return (
    <div className="mt-6 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Fokus-Modus
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Die wichtigsten Kaufpunkte bleiben oben.
      </h2>

      <div className="mt-4 flex flex-wrap gap-2">
        {keep.map((item) => (
          <span
            key={item}
            className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-black text-neutral-700"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
