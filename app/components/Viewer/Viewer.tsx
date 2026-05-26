'use client';

import React, { useState, useRef, useCallback } from 'react';

// ======================================================
// PLATYPUS Premium 360° Viewer
// Saubere, erweiterbare und performante Version
// ======================================================

interface ViewerProps {
  images: string[];           // Array mit 360° Bildern
  initialColor?: string;
  onColorChange?: (color: string) => void;
}

export default function Viewer({ images, initialColor = '#ffffff', onColorChange }: ViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalFrames = images.length;

  // Effiziente Index-Berechnung
  const updateIndex = useCallback((delta: number) => {
    setCurrentIndex((prev) => {
      const newIndex = (prev + delta + totalFrames) % totalFrames;
      return newIndex;
    });
  }, [totalFrames]);

  // Mouse & Touch Handling (optimiert)
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    if (Math.abs(diff) > 8) {
      updateIndex(diff > 0 ? -1 : 1);
      setStartX(clientX);
    }
  };

  const handleEnd = () => setIsDragging(false);

  // Event Handler
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-[520px] mx-auto select-none overflow-hidden rounded-2xl bg-zinc-950"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={handleEnd}
    >
      <img
        src={images[currentIndex]}
        alt="Shirt"
        className="w-full h-auto pointer-events-none select-none"
        draggable={false}
      />

      {/* Overlay Controls (später erweiterbar) */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button 
          onClick={() => updateIndex(-1)}
          className="px-3 py-1.5 bg-black/60 text-white text-sm rounded-lg backdrop-blur"
        >
          ←
        </button>
        <button 
          onClick={() => updateIndex(1)}
          className="px-3 py-1.5 bg-black/60 text-white text-sm rounded-lg backdrop-blur"
        >
          →
        </button>
      </div>
    </div>
  );
}
