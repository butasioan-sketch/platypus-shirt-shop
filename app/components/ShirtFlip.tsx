'use client';
import { useState } from 'react';

interface ShirtFlipProps {
  color?: string;
}

export default function ShirtFlip({ color = '#f5f5f5' }: ShirtFlipProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Flip-Wrapper */}
      <div
        onClick={() => setFlipped(!flipped)}
        style={{ cursor: 'pointer', perspective: '1000px', width: '100%' }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s ease',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>

          {/* VORDERSEITE */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#f8f8f8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img
              src="/airfit-front.png"
              alt="AirFit Pro Vorderseite"
              style={{ width: '90%', height: '90%', objectFit: 'contain' }}
            />
          </div>

          {/* RÜCKSEITE */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#f8f8f8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img
              src="/airfit-back.png"
              alt="AirFit Pro Rückseite"
              style={{ width: '90%', height: '90%', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>

      {/* Hinweis AUSSERHALB des Flip-Containers — bleibt immer lesbar */}
      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          cursor: 'pointer',
          textAlign: 'center',
          marginTop: '0.5rem',
          color: '#aaa',
          fontSize: '0.72rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {flipped ? '← Vorderseite zeigen' : 'Tippen für Rückseite →'}
      </div>
    </div>
  );
}
