export default function ShirtMaterialInfo() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
        <p className="font-black">185 g/m²</p>
        <p className="text-sm text-neutral-600 mt-1">stabiler Alltag-Stoff</p>
      </div>

      <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
        <p className="font-black">Regular Fit</p>
        <p className="text-sm text-neutral-600 mt-1">einheitlicher Schnitt</p>
      </div>

      <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
        <p className="font-black">Schwarz & Weiß</p>
        <p className="text-sm text-neutral-600 mt-1">fokussierte Produktion</p>
      </div>
    </div>
  );
}
