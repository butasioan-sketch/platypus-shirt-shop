"use client";

export default function ExportTestsButton({ tests }: { tests: any[] }) {
  function exportCSV() {
    const header = [
      "Datum",
      "Produkt",
      "Farbe",
      "Druck",
      "Temperatur",
      "Zeit",
      "Druck",
      "Waschgang",
      "Waschtemperatur",
      "Trockner",
      "Schrumpfung",
      "Bewertung",
      "Notizen",
    ];

    const rows = tests.map((t) => [
      new Date(t.createdAt).toLocaleString("de-DE"),
      t.productName,
      t.color,
      t.print,
      t.pressTemp,
      t.pressTime,
      t.pressure,
      t.washCount,
      t.washTemp,
      t.dryer,
      t.shrinkage,
      t.rating,
      (t.notes || "").replaceAll("\n", " "),
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";"))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "platypus-waschtests.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={exportCSV}
      disabled={tests.length === 0}
      className="mt-4 rounded-2xl bg-black px-5 py-3 font-black text-white disabled:bg-neutral-300 disabled:text-neutral-500"
    >
      Waschtests als CSV exportieren
    </button>
  );
}
