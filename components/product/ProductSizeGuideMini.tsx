export default function ProductSizeGuideMini() {
  const rows = [
    { size: "S", chest: "48 cm", length: "70 cm" },
    { size: "M", chest: "51 cm", length: "72 cm" },
    { size: "L", chest: "54 cm", length: "74 cm" },
    { size: "XL", chest: "57 cm", length: "76 cm" },
    { size: "XXL", chest: "60 cm", length: "78 cm" },
  ];

  return (
    <div className="mt-6 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Größentabelle
      </p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100 font-black">
            <tr>
              <th className="p-3">Größe</th>
              <th className="p-3">Brust</th>
              <th className="p-3">Länge</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.size} className="border-t border-neutral-200 font-bold">
                <td className="p-3">{row.size}</td>
                <td className="p-3">{row.chest}</td>
                <td className="p-3">{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
