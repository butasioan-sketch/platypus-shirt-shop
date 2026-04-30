"use client";

export default function OrderSearchFilter({
  search,
  setSearch,
  status,
  setStatus,
}: {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}) {
  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Suche nach Referenz, Kunde, E-Mail oder Produkt..."
          className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 p-4 font-bold"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 p-4 font-black"
        >
          <option value="all">Alle Status</option>
          <option value="offen">Offen</option>
          <option value="produktion">Produktion</option>
          <option value="fertig">Fertig</option>
        </select>
      </div>
    </div>
  );
}
