"use client";

export default function OrderDashboardRefresh() {
  function refreshPage() {
    window.location.reload();
  }

  function openOrders() {
    window.open("/admin/orders", "_self");
  }

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-black p-6 text-white shadow-2xl">
      <p className="text-xs font-black uppercase tracking-widest text-red-500">
        Dashboard Control
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Order-Daten aktualisieren
      </h2>

      <p className="mt-3 text-sm font-bold text-white/70">
        Nach Import, Tracking oder Statusänderung kannst du die Order-Zentrale neu laden.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={refreshPage}
          className="rounded-2xl bg-white px-5 py-3 font-black text-black"
        >
          Seite aktualisieren
        </button>

        <button
          onClick={openOrders}
          className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 font-black text-white"
        >
          Orders öffnen
        </button>
      </div>
    </div>
  );
}
