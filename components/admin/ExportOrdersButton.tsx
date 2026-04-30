"use client";

export default function ExportOrdersButton({ orders }: { orders: any[] }) {
  function exportCSV() {
    const header = [
      "Datum",
      "Referenz",
      "Kunde",
      "Email",
      "Adresse",
      "Stadt",
      "Zahlung",
      "Status",
      "Gesamt",
      "Produkte",
    ];

    const rows = orders.map((order) => [
      order.createdAt ? new Date(order.createdAt).toLocaleString("de-DE") : "",
      order.reference || order.id,
      order.customer?.name || "",
      order.customer?.email || "",
      order.customer?.address || "",
      order.customer?.city || "",
      order.paymentMethod || "",
      order.status || "",
      Number(order.total || 0).toFixed(2),
      (order.items || [])
        .map((item: any) => `${item.quantity}x ${item.name} ${item.size}`)
        .join(" | "),
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "platypus-bestellungen.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={exportCSV}
      disabled={orders.length === 0}
      className="mt-6 rounded-2xl bg-black px-5 py-3 font-black text-white disabled:bg-neutral-300 disabled:text-neutral-500"
    >
      Bestellungen als CSV exportieren
    </button>
  );
}
