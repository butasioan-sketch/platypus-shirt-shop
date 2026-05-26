'use client';

import React from 'react';
import Viewer from '@/app/components/Viewer/Viewer';

// ======================================================
// PLATYPUS Product Page (Demo)
// ======================================================

// Temporäre Demo-Bilder (später durch echte ersetzen)
const demoImages = [
  '/shirt-1.png',
  '/shirt-2.png',
  '/shirt-3.png',
  '/shirt-4.png',
  '/shirt-5.png',
  '/shirt-6.png',
  '/shirt-7.png',
  '/shirt-8.png',
];

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">PLATYPUS Shirt</h1>
        <p className="text-zinc-400 mb-10">Premium Qualität • 360° Ansicht • Farbauswahl</p>

        <Viewer images={demoImages} />

        <div className="mt-12 text-center text-sm text-zinc-500">
          Ziehen zum Drehen • Farbe auswählen • Auto-Rotate &amp; Zoom verfügbar
        </div>
      </div>
    </div>
  );
}
