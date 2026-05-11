export default function ProductPhotoGuide() {
  const steps = [
    "Shirt auf Kleiderbügel oder flach fotografieren",
    "Tageslicht oder gleichmäßige Softbox nutzen",
    "Neutraler Hintergrund",
    "Vorderseite fotografieren",
    "Rückseite fotografieren",
    "Detailfoto vom Stoff machen",
    "Detailfoto vom Druck machen",
    "Bilder später freistellen",
  ];

  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Foto Workflow
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Bessere Produktbilder vorbereiten
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {steps.map((step) => (
          <div key={step} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 font-black">
            ☐ {step}
          </div>
        ))}
      </div>
    </div>
  );
}
