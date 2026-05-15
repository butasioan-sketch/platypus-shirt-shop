export default function BrandFinalCTA() {
  return (
    <div className="mt-8 rounded-[2rem] bg-black p-8 text-white shadow-2xl">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-red-500">
        PLATYPUS
      </p>

      <h2 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">
        Built from zero.
        <span className="block text-red-500">
          Ready for the first order.
        </span>
      </h2>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <a href="#produkte" className="rounded-2xl bg-red-600 px-6 py-4 text-center font-black text-white">
          Shirt wählen
        </a>

        <a href="/versand" className="rounded-2xl bg-white px-6 py-4 text-center font-black text-black">
          Versand prüfen
        </a>

        <a href="/cart" className="rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-center font-black text-white">
          Checkout
        </a>
      </div>
    </div>
  );
}
