"use client";

import Link from "next/link";
import { useCart } from "../store/cart";

export default function MobileBottomBar() {
  const items = useCart((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white border-t border-neutral-200 p-4 flex gap-3 safe-bottom">
      <Link href="/admin" className="flex-1 text-center border border-neutral-300 py-3 rounded-2xl font-black">
        Produktion
      </Link>

      <div className="flex-1 text-center bg-black text-white py-3 rounded-2xl font-black">
        Warenkorb {totalItems}
      </div>
    </div>
  );
}
