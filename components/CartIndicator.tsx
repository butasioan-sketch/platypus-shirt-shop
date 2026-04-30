"use client";

import { useCart } from "../store/cart";

export default function CartIndicator() {
  const items = useCart((state) => state.items);

  return (
    <div className="fixed top-5 right-5 bg-white text-black px-4 py-2 rounded-full font-bold cursor-pointer">
      🛒 {items.length}
    </div>
  );
}
