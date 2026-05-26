'use client';

import { useEffect, useState } from 'react';

export default function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCount(cart.length);
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, []);

  if (count === 0) return null;

  return (
    <span className="text-xs bg-white text-black px-1.5 py-0.5 rounded-full font-mono">
      {count}
    </span>
  );
}
