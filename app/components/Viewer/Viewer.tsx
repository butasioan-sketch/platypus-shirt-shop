'use client';

import React, { useState } from 'react';
import ColorPicker from './ColorPicker';

// ======================================================
// PLATYPUS Premium Viewer mit Farbauswahl
// ======================================================

interface ViewerProps {
  images: string[];
}

export default function Viewer({ images }: ViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [color, setColor] = useState('#ffffff');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const total = images.length;

  const changeFrame = (delta: number) => {
    setCurrentIndex((prev) => (prev + delta + total) % total);
  };

  const handleStart = (x: number) => {
    setIsDragging(true);
    setStartX(x);
  };

  const handleMove = (x: number) => {
    if (!isDragging) return;
    const diff = x - startX;
    if (Math.abs(diff) > 10) {
      changeFrame(diff > 0 ? -1 : 1);
      setStartX(x);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Viewer */}
      <div
        className="relative w-full max-w-[540px] overflow-hidden rounded-3xl bg-zinc-950 select-none"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={() => setIsDragging(false)}
      >
        <img
          src={images[currentIndex]}
          alt="Shirt"
          className="w-full h-auto pointer-events-none"
          draggable={false}
        />
        <div 
          className="absolute inset-0 mix-blend-multiply pointer-events-none transition-colors duration-200" 
          style={{ backgroundColor: color, opacity: 0.7 }} 
        />
      </div>

      {/* Color Picker */}
      <ColorPicker selectedColor={color} onChange={setColor} />
    </div>
  );
}
