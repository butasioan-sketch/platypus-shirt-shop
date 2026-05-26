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
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(saved);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const changeQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    updateCart(newCart);
  };

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold mb-10 tracking-tight">Warenkorb</h1>

        {cart.length === 0 ? (
          <p className="text-zinc-400">Dein Warenkorb ist leer.</p>
        ) : (
          <>
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-zinc-800 pb-5">
                  <div>
                    <div className="font-medium">PLATYPUS Classic</div>
                    <div className="flex items-center gap-3 mt-1">
                      <button onClick={() => changeQuantity(index, item.quantity - 1)} className="px-2 py-0.5 bg-zinc-800 rounded">-</button>
                      <span className="font-mono">{item.quantity}</span>
                      <button onClick={() => changeQuantity(index, item.quantity + 1)} className="px-2 py-0.5 bg-zinc-800 rounded">+</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div>€{(item.price * item.quantity).toFixed(2)}</div>
                    <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-500 text-sm">Entfernen</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between text-2xl font-medium">
              <div>Gesamt</div>
              <div>€{total.toFixed(2)}</div>
            </div>

            <button className="mt-8 w-full py-4 bg-white text-black rounded-3xl font-medium text-lg">
              Zur Kasse
            </button>
          </>
        )}
      </div>
    </div>
  );
}
