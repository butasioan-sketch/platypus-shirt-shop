"use client";

export default function OrderQuickActions() {
  function openStripeDashboard() {
    window.open("https://dashboard.stripe.com/test/payments", "_blank");
  }

  function openAdmin() {
    window.open("/admin", "_self");
  }

  function openInventory() {
    window.open("/admin/inventory", "_self");
  }

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Quick Actions
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Bestellprozess schneller steuern
      </h2>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={openStripeDashboard}
          className="rounded-2xl bg-black px-5 py-3 font-black text-white"
        >
          Stripe öffnen
        </button>

        <button
          onClick={openInventory}
          className="rounded-2xl border border-neutral-300 px-5 py-3 font-black"
        >
          Inventory
        </button>

        <button
          onClick={openAdmin}
          className="rounded-2xl border border-neutral-300 px-5 py-3 font-black"
        >
          Admin
        </button>
      </div>
    </div>
  );
}
