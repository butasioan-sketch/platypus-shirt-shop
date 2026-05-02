export default function ConversionBar() {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl bg-black p-5 text-white shadow-xl">
        <p className="text-sm font-black text-white/60">Versand</p>
        <p className="mt-1 text-xl font-black">Kostenlos ab 70 €</p>
      </div>

      <div className="rounded-2xl bg-white p-5 border border-neutral-200 shadow-xl">
        <p className="text-sm font-black text-neutral-500">Produktion</p>
        <p className="mt-1 text-xl font-black">Eigenproduktion</p>
      </div>

      <div className="rounded-2xl bg-white p-5 border border-neutral-200 shadow-xl">
        <p className="text-sm font-black text-neutral-500">Qualität</p>
        <p className="mt-1 text-xl font-black">Waschtest dokumentiert</p>
      </div>
    </div>
  );
}
