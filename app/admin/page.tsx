"use client";

import { useState } from "react";

import { useOrders } from "../../store/orders";
import { getPaymentLabel, getPaymentProvider } from "../../lib/paymentLabels";
import PaymentStatusBadge from "../../components/PaymentStatusBadge";
import ExportOrdersButton from "../../components/admin/ExportOrdersButton";
import PrintOrderButton from "../../components/admin/PrintOrderButton";
import OrderSearchFilter from "../../components/admin/OrderSearchFilter";
import OrderTimeline from "../../components/admin/OrderTimeline";
import AdminQuickLinks from "../../components/admin/AdminQuickLinks";
import StockWarnings from "../../components/StockWarnings";
import AdminStatsOverview from "../../components/admin/AdminStatsOverview";
import LaunchChecklistAdmin from "../../components/LaunchChecklistAdmin";
import ShopStatusBar from "../../components/ShopStatusBar";

export default function AdminPage() {
  const { orders, updateStatus } = useOrders();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filteredOrders = orders.filter((order: any) => {
    const query = search.toLowerCase();

    const matchesSearch =
      String(order.reference || order.id).toLowerCase().includes(query) ||
      String(order.customer?.name || "").toLowerCase().includes(query) ||
      String(order.customer?.email || "").toLowerCase().includes(query) ||
      String(order.items?.map((i: any) => i.name).join(" ") || "").toLowerCase().includes(query);

    const matchesStatus = status === "all" || order.status === status;

    return matchesSearch && matchesStatus;
  });

  const openOrders = orders.filter((o: any) => o.status === "offen");
  const productionOrders = orders.filter((o: any) => o.status === "produktion");
  const finishedOrders = orders.filter((o: any) => o.status === "fertig");

  return (
    <main className="min-h-screen bg-[#f6f3ed] text-black p-5 sm:p-10">
      <div className="bg-white rounded-[2rem] border border-neutral-200 shadow-xl p-6 sm:p-10">
        <p className="text-neutral-500 font-black uppercase tracking-widest text-xs">
          Admin Bereich
        </p>

        <h1 className="mt-3 text-4xl sm:text-6xl font-black">
          Produktions-Dashboard
        </h1>

        <p className="mt-4 text-neutral-600">\n          Bestellungen, Zahlungsart, Payment-Status, Größe und Produktionsstatus.\n        </p>\n\n        <a href="/admin/tests" className="mt-6 inline-block bg-black text-white px-5 py-3 rounded-2xl font-black">\n          Waschtests öffnen\n        </a>
      </div>

      <AdminQuickLinks />
      <AdminStatsOverview />
      <LaunchChecklistAdmin />
      <ShopStatusBar />
      <StockWarnings />

      <ExportOrdersButton orders={orders} />

      <OrderSearchFilter search={search} setSearch={setSearch} status={status} setStatus={setStatus} />

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <div className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm">
          <p className="text-neutral-500 font-bold">Offen</p>
          <p className="text-5xl font-black">{openOrders.length}</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm">
          <p className="text-neutral-500 font-bold">Produktion</p>
          <p className="text-5xl font-black">{productionOrders.length}</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm">
          <p className="text-neutral-500 font-bold">Fertig</p>
          <p className="text-5xl font-black">{finishedOrders.length}</p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {filteredOrders.length === 0 && (
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
            <p className="text-neutral-500 font-bold">Noch keine Bestellungen.</p>
          </div>
        )}

        {filteredOrders.map((order: any) => (
          <div key={order.id} className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div>
                <p className="text-xs text-neutral-500 font-black uppercase">
                  Bestellung
                </p>

                <p className="font-black break-all">{order.reference || order.id}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <PaymentStatusBadge mode={order.paymentStatus === "provider_ready_demo_redirect" ? "ready" : "demo"} />
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black">
                    {getPaymentLabel(order.paymentMethod)}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black">
                    Provider: {getPaymentProvider(order.paymentMethod)}
                  </span>
                </div>

                <div className="mt-4 grid gap-1 text-sm">
                  <p><b>Kunde:</b> {order.customer?.name || "-"}</p>
                  <p><b>E-Mail:</b> {order.customer?.email || "-"}</p>
                  <p><b>Adresse:</b> {order.customer?.address || "-"}, {order.customer?.city || "-"}</p>
                  <p><b>Payment Session:</b> {order.paymentSessionId || "-"}</p>
                  <p><b>Erstellt:</b> {order.createdAt ? new Date(order.createdAt).toLocaleString("de-DE") : "-"}</p>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-3xl font-black">{Number(order.total || 0).toFixed(2)} €</p>

                <OrderTimeline status={order.status} />

                <PrintOrderButton order={order} />

                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value as any)}
                  className="mt-3 bg-neutral-50 border border-neutral-300 p-3 rounded-2xl font-black"
                >
                  <option value="offen">offen</option>
                  <option value="produktion">in Produktion</option>
                  <option value="fertig">fertig</option>
                </select>
              </div>
            </div>

            <div className="mt-5 border-t border-neutral-200 pt-5">
              <p className="font-black mb-3">Produktionsliste</p>

              <div className="space-y-3">
                {order.items?.map((item: any) => (
                  <div key={`${item.id}-${item.size}-${item.fit}`} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <p className="font-black">
                      {item.quantity}x {item.name}
                    </p>

                    <p className="text-sm text-neutral-600">
                      Farbe: {item.color} · Größe: {item.size} · Passform: Regular · Technik: {item.print}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
