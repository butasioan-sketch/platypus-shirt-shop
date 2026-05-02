export default function UrgencyBar() {
  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-black">
          🔥 Erste Testserie läuft · Schwarz & Weiß verfügbar
        </p>

        <p className="text-sm font-bold text-neutral-600">
          Produktion startet nach Zahlungseingang
        </p>
      </div>
    </div>
  );
}
