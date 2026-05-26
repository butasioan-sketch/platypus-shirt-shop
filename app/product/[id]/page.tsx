'use client';

import React, { useState } from 'react';
import Viewer from '@/app/components/Viewer/Viewer';

const demoImages = [
  '/shirt-1.png', '/shirt-2.png', '/shirt-3.png', '/shirt-4.png',
  '/shirt-5.png', '/shirt-6.png', '/shirt-7.png', '/shirt-8.png',
];

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    // Später: echte Cart-Logik
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Viewer */}
          <div>
            <Viewer images={demoImages} />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="uppercase tracking-[3px] text-xs text-zinc-500 mb-2">Premium Print-on-Demand</div>
              <h1 className="text-5xl font-semibold tracking-tighter mb-4">PLATYPUS Classic</h1>
              <div className="text-3xl font-medium mb-8">€39</div>

              <div className="prose prose-invert text-zinc-400 max-w-md">
                <p>Hochwertiges T-Shirt mit exzellenter Passform. 
                360° Ansicht, Echtzeit-Farbwechsel und Premium-Qualität.</p>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-sm text-zinc-400">Menge</div>
                <div className="flex items-center border border-zinc-800 rounded-2xl">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-xl">−</button>
                  <div className="px-5 font-mono">{quantity}</div>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-xl">+</button>
                </div>
              </div>

              <button 
                onClick={addToCart}
                className="w-full py-4 bg-white text-black rounded-3xl font-medium text-lg active:scale-[0.985] transition"
              >
                {added ? '✓ Hinzugefügt' : 'In den Warenkorb'}
              </button>

              <div className="text-center text-xs text-zinc-500 mt-4">
                Kostenloser Versand ab 2 Stück • 30 Tage Rückgabe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
