export default function TestStats({ tests }: { tests: any[] }) {
  const sellable = tests.filter(
    (t) => t.rating === "Sehr gut" || t.rating === "Gut"
  ).length;

  const problems = tests.filter(
    (t) => t.rating === "Problem" || t.rating === "Nicht verkaufen"
  ).length;

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      <div className="rounded-3xl bg-white border border-neutral-200 p-5 shadow-sm">
        <p className="text-neutral-500 font-bold">Tests gesamt</p>
        <p className="text-5xl font-black">{tests.length}</p>
      </div>

      <div className="rounded-3xl bg-white border border-neutral-200 p-5 shadow-sm">
        <p className="text-neutral-500 font-bold">Verkaufbar</p>
        <p className="text-5xl font-black text-emerald-700">{sellable}</p>
      </div>

      <div className="rounded-3xl bg-white border border-neutral-200 p-5 shadow-sm">
        <p className="text-neutral-500 font-bold">Probleme</p>
        <p className="text-5xl font-black text-red-700">{problems}</p>
      </div>
    </div>
  );
}
