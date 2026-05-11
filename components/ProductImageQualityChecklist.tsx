export default function ProductImageQualityChecklist() {
  const items = [
    "Transparenter Hintergrund",
    "Gleichmäßiges Licht",
    "Realistische Stoffstruktur",
    "Vorderseite und Rückseite",
    "Mobile Darstellung prüfen",
    "360° Rotation testen",
  ];

  return (
    <div className="mt-6 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Bildqualität
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Produktoptik verbessern
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 font-black">
            ✅ {item}
          </div>
        ))}
      </div>
    </div>
  );
}
