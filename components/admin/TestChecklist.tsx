export default function TestChecklist() {
  const items = [
    "Shirt vor dem Druck fotografieren",
    "Presszeit und Temperatur notieren",
    "24 Stunden vor erster Wäsche warten",
    "Auf links waschen",
    "30°C Waschgang dokumentieren",
    "Nach jeder Wäsche Foto machen",
    "Risse, Verblassen und Schrumpfung prüfen",
  ];

  return (
    <div className="rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <h2 className="text-2xl font-black mb-4">Test-Checkliste</h2>

      <div className="space-y-3">
        {items.map((item) => (
          <label key={item} className="flex gap-3 items-start">
            <input type="checkbox" className="mt-1 h-5 w-5" />
            <span className="font-bold text-neutral-700">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
