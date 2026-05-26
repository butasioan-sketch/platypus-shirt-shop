'use client';

import React, { useState, useEffect, useRef } from 'react';
import ColorPicker from './ColorPicker';

// ======================================================
// PLATYPUS Premium Viewer (mit Auto-Rotate + Snapshot)
// ======================================================

interface ViewerProps {
  images: string[];
}

export default function Viewer({ images }: ViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [color, setColor] = useState('#ffffff');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = images.length;

  // Auto Rotation
  useEffect(() => {
    if (autoRotate) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % total);
      }, 120);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRotate, total]);

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
    if (!containerRef.current) return;
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
        ref={containerRef}
        className="relative w-full max-w-[540px] overflow-hidden rounded-3xl bg-zinc-950 select-none"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={() => setIsDragging(false)}
      >
        <img src={images[currentIndex]} alt="Shirt" className="w-full h-auto" draggable={false} />
        <div className="absolute inset-0 mix-blend-multiply pointer-events-none" style={{ backgroundColor: color, opacity: 0.7 }} />
      </div>

      <ColorPicker selectedColor={color} onChange={setColor} />

      <div className="flex gap-4">
        <button onClick={() => setAutoRotate(!autoRotate)} className="px-5 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-sm">
          {autoRotate ? 'Auto-Rotate stoppen' : 'Auto-Rotate starten'}
        </button>
        <button onClick={takeSnapshot} className="px-5 py-2.5 rounded-2xl bg-white text-black text-sm font-medium">
          Snapshot
        </button>
      </div>
    </div>
  );
}
