"use client";

import Link from "next/link";
import { useCart } from "../store/cart";

export default function CartRecoveryBlock() {
  const items = useCart((state) => state.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  if (count === 0) return null;

  return (
    <div className="mt-8 rounded-[2rem] bg-amber-50 border border-amber-200 p-6 text-amber-950 shadow-sm">
      <p className="text-sm font-black uppercase tracking-widest text-amber-700">
        Warenkorb wartet
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Du hast {count} Artikel im Warenkorb.
      </h2>

      <p className="mt-3 text-sm font-bold">
        Schließe deine Bestellung ab, bevor deine Größe ausverkauft ist.
      </p>

      <Link
        href="/cart"
        className="mt-5 inline-block rounded-2xl bg-black px-6 py-4 font-black text-white"
      >
        Checkout öffnen
      </Link>
    </div>
  );
}
