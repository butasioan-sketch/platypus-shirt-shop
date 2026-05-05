"use client";

import Link from "next/link";
import { useCart } from "../store/cart";

export default function StickyDesktopCheckout() {
  const items = useCart((state) => state.items);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden w-96 rounded-[2rem] bg-white border border-neutral-200 p-5 shadow-2xl sm:block">
      <p className="text-sm font-black text-neutral-500">Warenkorb</p>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-2xl font-black">{count} Artikel</p>
        <p className="text-2xl font-black">{total.toFixed(2)} €</p>
      </div>

      <Link
        href="/cart"
        className="mt-4 block rounded-2xl bg-black px-5 py-4 text-center font-black text-white active:scale-[0.98]"
      >
        Zum Checkout
      </Link>
    </div>
  );
}
