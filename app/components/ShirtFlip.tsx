'use client';
import { useState } from 'react';

interface ShirtFlipProps {
  color?: string;
}

export default function ShirtFlip({ color = '#f5f5f5' }: ShirtFlipProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Flip-Container */}
      <div
        onClick={() => setFlipped(!flipped)}
        style={{ cursor: 'pointer', perspective: '1000px', width: '260px', height: '260px' }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s ease',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>

          {/* VORDERSEITE */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img
              src="/airfit-front.png"
              alt="Vorderseite"
              style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))' }}
            />
          </div>

          {/* RÜCKSEITE */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img
              src="/airfit-back.png"
              alt="Rückseite"
              style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))' }}
            />
          </div>
        </div>
      </div>

      {/* Hinweis */}
      <p
        onClick={() => setFlipped(!flipped)}
        style={{ cursor: 'pointer', color: '#666', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.5rem' }}
      >
        {flipped ? '← Vorderseite' : 'Rückseite →'}
      </p>
    </div>
  );
}
