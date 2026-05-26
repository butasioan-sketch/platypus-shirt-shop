'use client';

import React, { useState } from 'react';
import ColorPicker from './ColorPicker';

interface ViewerProps {
  images: string[];
}

export default function Viewer({ images }: ViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [color, setColor] = useState('#ffffff');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [zoom, setZoom] = useState(1);

  const total = images.length;

  const changeFrame = (delta: number) => {
    setCurrentIndex((prev) => (prev + delta + total) % total);
  };

  const handleStart = (x: number) => {
    setIsDragging(true);
    setStartX(x);
    setAutoRotate(false);
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
      <div
        className="relative w-full max-w-[560px] overflow-hidden rounded-3xl bg-zinc-950 select-none"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={() => setIsDragging(false)}
      >
        <div style={{ transform: `scale(${zoom})`, transition: 'transform 0.1s' }}>
          <img src={images[currentIndex]} alt="Shirt" className="w-full h-auto" draggable={false} />
          <div className="absolute inset-0 mix-blend-multiply pointer-events-none" style={{ backgroundColor: color, opacity: 0.7 }} />
        </div>
      </div>

      <ColorPicker selectedColor={color} onChange={setColor} />

      <div className="flex gap-3 flex-wrap justify-center">
        <button onClick={() => setAutoRotate(!autoRotate)} className="px-5 py-2.5 bg-zinc-800 rounded-2xl text-sm">
          {autoRotate ? 'Stop Rotate' : 'Auto Rotate'}
        </button>
        <button onClick={() => setZoom(z => Math.max(0.6, z - 0.2))} className="px-4 py-2.5 bg-zinc-800 rounded-2xl">−</button>
        <button onClick={() => setZoom(1)} className="px-4 py-2.5 bg-zinc-800 rounded-2xl">Reset</button>
        <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="px-4 py-2.5 bg-zinc-800 rounded-2xl">+</button>
        <button onClick={() => { /* Snapshot */ }} className="px-5 py-2.5 bg-white text-black rounded-2xl text-sm font-medium">
          Snapshot
        </button>
      </div>
    </div>
  );
}
