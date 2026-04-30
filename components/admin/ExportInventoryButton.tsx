"use client";

import { products } from "../../data/products";

export default function ExportInventoryButton({ stock }: { stock: any[] }) {
  function exportCSV() {
    const header = [
      "Produkt",
      "Produkt ID",
      "Größe",
      "Bestand",
      "Mindestbestand",
      "Status",
    ];

    const rows = stock.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const low = item.stock <= item.minStock;

      return [
        product?.name || "",
        item.productId,
        item.size,
        item.stock,
        item.minStock,
        low ? "Nachbestellen" : "OK",
      ];
    });

    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "platypus-lagerbestand.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={exportCSV}
      className="mt-6 rounded-2xl bg-black px-5 py-3 font-black text-white"
    >
      Lagerbestand als CSV exportieren
    </button>
  );
}
