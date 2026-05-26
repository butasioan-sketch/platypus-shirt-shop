'use client';

import React, { useState } from 'react';
import Viewer from '@/app/components/Viewer/Viewer';
import { products } from '@/app/lib/products';

export default function ProductPage() {
  const product = products['platypus-classic'];
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ id: product.id, quantity, price: product.price });
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));

    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <Viewer images={product.images} />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="text-xs tracking-[3px] text-zinc-500 mb-1">PREMIUM</div>
              <h1 className="text-5xl font-semibold tracking-[-1.5px] mb-3">{product.name}</h1>
              <div className="text-4xl mb-8">€{product.price}</div>

              <p className="text-zinc-400 max-w-md">
                Hochwertiges T-Shirt mit exzellenter Passform.<br />
                Echtzeit-Farbwechsel • 360° Ansicht • Premium Qualität.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6 mt-10">
                <div className="text-sm text-zinc-400">Menge</div>
                <div className="flex border border-zinc-800 rounded-2xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-xl active:bg-zinc-900">−</button>
                  <div className="px-6 flex items-center font-mono border-x border-zinc-800">{quantity}</div>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-xl active:bg-zinc-900">+</button>
                </div>
              </div>

              <button 
                onClick={addToCart}
                className="w-full py-4 bg-white active:bg-zinc-200 text-black rounded-3xl font-medium text-lg transition"
              >
                {added ? '✓ Zum Warenkorb hinzugefügt' : 'In den Warenkorb'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
