export default function ProductSpecs({ product }: { product: any }) {
  const specs = [
    ["Material", "100% Baumwolle"],
    ["Schnitt", "Regular Fit"],
    ["Gewicht", "185 g/m²"],
    ["Farbe", product.color],
    ["Drucktechnik", product.print],
    ["Produktion", "Eigenproduktion"],
  ];

  return (
    <div className="mt-6 rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
      <p className="font-black mb-3">Produktdetails</p>

      <div className="grid gap-2">
        {specs.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 border-b border-neutral-200 pb-2 text-sm">
            <span className="text-neutral-500 font-bold">{label}</span>
            <span className="font-black text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
