'use client';

import React, { useState, useCallback } from 'react';

// ======================================================
// PLATYPUS Premium 360° Viewer (v2)
// Mit Farbwechsel-Unterstützung + verbesserter Struktur
// ======================================================

interface ViewerProps {
  images: string[];
  color?: string;
  onColorChange?: (color: string) => void;
}

export default function Viewer({ images, color = '#ffffff', onColorChange }: ViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const total = images.length;

  const changeFrame = useCallback((delta: number) => {
    setCurrentIndex((prev) => (prev + delta + total) % total);
  }, [total]);

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

  const handleEnd = () => setIsDragging(false);

  return (
    <div
      className="relative w-full max-w-[540px] mx-auto overflow-hidden rounded-3xl bg-zinc-950 select-none"
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      <div className="relative">
        <img
          src={images[currentIndex]}
          alt="Shirt"
          className="w-full h-auto pointer-events-none"
          draggable={false}
        />

        {/* Farb-Overlay (einfach & performant) */}
        <div
          className="absolute inset-0 mix-blend-multiply pointer-events-none"
          style={{ backgroundColor: color, opacity: 0.65 }}
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-5 right-5 flex gap-2 z-10">
        <button
          onClick={() => changeFrame(-1)}
          className="px-4 py-2 bg-black/70 hover:bg-black text-white rounded-2xl text-sm transition"
        >
          ←
        </button>
        <button
          onClick={() => changeFrame(1)}
          className="px-4 py-2 bg-black/70 hover:bg-black text-white rounded-2xl text-sm transition"
        >
          →
        </button>
      </div>
    </div>
  );
}
