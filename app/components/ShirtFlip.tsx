'use client';
import { useState } from 'react';

export default function ShirtFlip() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', boxSizing: 'border-box' }}
    >
      {/* Flip-Container */}
      <div style={{ perspective: '1000px', width: '100%', flex: 1 }}>
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s ease',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>
          {/* VORNE */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src="/airfit-front-t.png" alt="Vorderseite"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))' }}
            />
          </div>
          {/* HINTEN */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src="/airfit-back-t.png" alt="Rückseite"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))' }}
            />
          </div>
        </div>
      </div>
      {/* Hinweis */}
      <p style={{ color: '#666', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.5rem', flexShrink: 0 }}>
        {flipped ? '← Vorderseite' : 'Rückseite →'}
      </p>
    </div>
  );
}
