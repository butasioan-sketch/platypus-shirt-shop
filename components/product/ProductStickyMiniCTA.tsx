export default function ProductStickyMiniCTA() {
  return (
    <div className="fixed bottom-5 left-5 right-5 z-50 rounded-2xl bg-black p-3 text-white shadow-2xl sm:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-white/60">PLATYPUS Shirt</p>
          <p className="font-black">Bereit zum Warenkorb</p>
        </div>

        <a
          href="/cart"
          className="rounded-xl bg-white px-4 py-3 text-sm font-black text-black"
        >
          Checkout
        </a>
      </div>
    </div>
  );
}
