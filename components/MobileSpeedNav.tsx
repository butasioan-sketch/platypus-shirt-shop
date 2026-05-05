export default function MobileSpeedNav() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:hidden">
      <a
        href="#produkte"
        className="rounded-2xl bg-black px-4 py-4 text-center font-black text-white"
      >
        Produkte
      </a>

      <a
        href="/cart"
        className="rounded-2xl bg-white border border-neutral-200 px-4 py-4 text-center font-black text-black"
      >
        Checkout
      </a>

      <a
        href="/versand"
        className="rounded-2xl bg-white border border-neutral-200 px-4 py-4 text-center font-black text-black"
      >
        Versand
      </a>

      <a
        href="/admin"
        className="rounded-2xl bg-white border border-neutral-200 px-4 py-4 text-center font-black text-black"
      >
        Admin
      </a>
    </div>
  );
}
