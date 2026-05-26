'use client';

import React, { useEffect, useState } from 'react';

interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold mb-10 tracking-tight">Dein Warenkorb</h1>

        {cart.length === 0 ? (
          <p className="text-zinc-400">Dein Warenkorb ist leer.</p>
        ) : (
          <div className="space-y-6">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div>
                  <div className="font-medium">PLATYPUS Classic</div>
                  <div className="text-sm text-zinc-400">Menge: {item.quantity}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div>€{(item.price * item.quantity).toFixed(2)}</div>
                  <button 
                    onClick={() => removeItem(index)}
                    className="text-red-400 hover:text-red-500 text-sm"
                  >
                    Entfernen
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-6 flex justify-between text-xl font-medium">
              <div>Gesamt</div>
              <div>€{total.toFixed(2)}</div>
            </div>

            <button className="mt-6 w-full py-4 bg-white text-black rounded-3xl font-medium">
              Zur Kasse
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
