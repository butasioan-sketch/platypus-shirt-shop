"use client";

import Link from "next/link";
import Checkout from "../../components/Checkout";
import { useCart } from "../../store/cart";

function itemKey(item: any) {
  return `${item.id}-${item.size}-${item.fit || "Regular"}`;
}

export default function CartPage() {
  const items = useCart((state) => state.items);
  const removeFromCart = useCart((state) => state.removeFromCart);
  const clearCart = useCart((state) => state.clearCart);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="min-h-screen bg-[#f6f3ed] p-5 sm:p-10 text-black">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-6 shadow-xl border border-neutral-200">
        <Link href="/" className="font-black underline">
          ← Zurück zum Shop
        </Link>

        <h1 className="mt-6 text-4xl font-black">Warenkorb</h1>

        {items.length === 0 ? (
          <p className="mt-6 text-neutral-600 font-bold">Dein Warenkorb ist leer.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={itemKey(item)} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                <p className="font-black">{item.name}</p>
                <p className="text-sm text-neutral-600">Größe: {item.size}</p>
                <p className="text-sm text-neutral-600">Passform: Regular</p>
                <p className="text-sm text-neutral-600">
                  {item.quantity}x {item.price} €
                </p>

                <button
                  onClick={() => removeFromCart(itemKey(item))}
                  className="mt-3 rounded-xl bg-red-600 px-4 py-2 font-black text-white"
                >
                  Entfernen
                </button>
              </div>
            ))}

            <p className="text-2xl font-black">Gesamt: {total.toFixed(2)} €</p>

            <button
              onClick={clearCart}
              className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white"
            >
              Warenkorb leeren
            </button>
          </div>
        )}
      </div>

      <Checkout />
    </main>
  );
}
