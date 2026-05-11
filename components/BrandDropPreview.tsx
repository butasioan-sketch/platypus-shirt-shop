export default function BrandDropPreview() {
  const drops = [
    {
      name: "Essential White",
      status: "Aktiv",
      color: "Weiß",
    },
    {
      name: "Essential Black",
      status: "Aktiv",
      color: "Schwarz",
    },
    {
      name: "Red Mindset Drop",
      status: "In Planung",
      color: "Schwarz / Rot",
    },
  ];

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-900 bg-neutral-950 p-6 text-white shadow-2xl">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-red-500">
        Drops
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Aktuelle und kommende PLATYPUS Drops
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {drops.map((drop) => (
          <div
            key={drop.name}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <p className="text-xl font-black">{drop.name}</p>
            <p className="mt-2 text-sm font-bold text-neutral-400">{drop.color}</p>
            <p className="mt-4 inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-black">
              {drop.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
