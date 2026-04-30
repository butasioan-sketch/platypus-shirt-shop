"use client";

import Link from "next/link";
import { useCart } from "../../store/cart";

export default function CartPage() {
  const { items, removeFromCart } = useCart();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-5xl font-black">Warenkorb</h1>
        <Link href="/" className="underline">
          ← Zurück zum Shop
        </Link>
      </div>

      <div className="mt-10 space-y-4">
        {items.length === 0 && (
          <p className="text-neutral-400">Dein Warenkorb ist leer.</p>
        )}

        {items.map((item) => (
          <div key={item.id} className="border border-neutral-700 p-5 rounded-xl">
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <p>Menge: {item.quantity}</p>
            <p>Einzelpreis: {item.price} €</p>
            <p>Summe: {(item.price * item.quantity).toFixed(2)} €</p>

            <button
              onClick={() => removeFromCart(item.id)}
              className="mt-2 bg-red-600 px-4 py-2 rounded font-bold"
            >
              Entfernen
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-neutral-700 pt-6">
        <p className="text-3xl font-black">
          Gesamt: {total.toFixed(2)} €
        </p>

        <button className="mt-6 bg-white text-black px-6 py-3 rounded-xl font-black">
          Checkout vorbereiten
        </button>
      </div>
    </main>
  );
}
