export default function ProductSectionTrust() {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
        <p className="text-sm font-black text-neutral-500">Qualität</p>
        <p className="mt-1 text-xl font-black">Waschtest vorbereitet</p>
      </div>

      <div className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
        <p className="text-sm font-black text-neutral-500">Versand</p>
        <p className="mt-1 text-xl font-black">DHL · Hermes · DPD · GLS</p>
      </div>

      <div className="rounded-2xl bg-white border border-neutral-200 p-5 shadow-sm">
        <p className="text-sm font-black text-neutral-500">Payment</p>
        <p className="mt-1 text-xl font-black">Stripe Struktur aktiv</p>
      </div>
    </div>
  );
}
