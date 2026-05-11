"use client";

import BrandLogo from "./BrandLogo";

import Link from "next/link";
import { useCart } from "../store/cart";

export default function AppHeader() {
  const items = useCart((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-neutral-200 px-5 sm:px-8 py-4 flex justify-between items-center shadow-sm">
      <Link href="/" className="font-black text-2xl tracking-tight">
        PLATYPUS
      </Link>

      <div className="hidden sm:flex gap-6 items-center">
        <Link href="/admin" className="font-bold text-neutral-700 hover:text-black">
          Produktion
        </Link>

        <div className="bg-black text-white px-4 py-2 rounded-full font-black">
          🛒 {totalItems}
        </div>
      </div>

      <div className="sm:hidden bg-black text-white px-4 py-2 rounded-full font-black">
        🛒 {totalItems}
      </div>
    </nav>
  );
}
