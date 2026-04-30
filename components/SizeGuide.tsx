"use client";

export default function SizeGuide() {
  const rows = [
    ["S", "69 cm", "50 cm"],
    ["M", "72 cm", "53 cm"],
    ["L", "74 cm", "56 cm"],
    ["XL", "76 cm", "59 cm"],
    ["XXL", "78 cm", "62 cm"],
  ];

  return (
    <div className="mt-6 rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
      <p className="font-black mb-3">Größentabelle</p>

      <div className="grid grid-cols-3 text-sm font-bold text-neutral-500 border-b border-neutral-200 pb-2">
        <span>Größe</span>
        <span>Länge</span>
        <span>Breite</span>
      </div>

      {rows.map((row) => (
        <div key={row[0]} className="grid grid-cols-3 text-sm py-2 border-b border-neutral-100">
          <span className="font-black">{row[0]}</span>
          <span>{row[1]}</span>
          <span>{row[2]}</span>
        </div>
      ))}
    </div>
  );
}
