'use client';

import React, { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);

  const total = images.length;

  useEffect(() => {
    images.forEach(src => { const img = new Image(); img.src = src; });
  }, [images]);

  useEffect(() => {
    setIsLoading(true);
    const img = new Image();
    img.src = images[currentIndex];
    img.onload = () => setIsLoading(false);
  }, [currentIndex, images]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') changeFrame(-1);
      if (e.key === 'ArrowRight') changeFrame(1);
      if (e.key.toLowerCase() === 'r') setAutoRotate(!autoRotate);
      if (e.key === '+') setZoom(z => Math.min(3, z + 0.2));
      if (e.key === '-') setZoom(z => Math.max(0.6, z - 0.2));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

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

  const takeSnapshot = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = images[currentIndex];

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.65;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      const link = document.createElement('a');
      link.download = `platypus-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
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
        {isLoading && <div className="absolute inset-0 flex items-center justify-center z-10"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>}

        <div style={{ transform: `scale(${zoom})`, transition: 'transform 0.1s ease-out', opacity: isLoading ? 0.4 : 1 }}>
          <img src={images[currentIndex]} alt="Shirt" className="w-full h-auto" draggable={false} />
          <div className="absolute inset-0 mix-blend-multiply pointer-events-none" style={{ backgroundColor: color, opacity: 0.7 }} />
        </div>
      </div>

      <ColorPicker selectedColor={color} onChange={setColor} />

      <div className="flex gap-3 flex-wrap justify-center text-sm">
        <button onClick={() => setAutoRotate(!autoRotate)} className="px-5 py-2 bg-zinc-800 rounded-2xl">Auto Rotate</button>
        <button onClick={() => setZoom(z => Math.max(0.6, z - 0.2))} className="px-4 py-2 bg-zinc-800 rounded-2xl">−</button>
        <button onClick={() => setZoom(1)} className="px-4 py-2 bg-zinc-800 rounded-2xl">Reset</button>
        <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="px-4 py-2 bg-zinc-800 rounded-2xl">+</button>
        <button onClick={takeSnapshot} className="px-5 py-2 bg-white text-black rounded-2xl font-medium">Snapshot</button>
      </div>

      <div className="text-xs text-zinc-500">← → Drehen • R = Auto • +/- Zoom</div>
    </div>
  );
}
