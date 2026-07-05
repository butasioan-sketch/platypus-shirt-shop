'use client';
import { useState } from 'react';

interface ShirtFlipProps {
  color?: string;
}

export default function ShirtFlip({ color = '#f5f5f5' }: ShirtFlipProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      style={{ cursor: 'pointer', perspective: '1000px', width: '100%', maxWidth: '420px', margin: '0 auto' }}
      title={flipped ? 'Klick für Vorderseite' : 'Klick für Rückseite'}
    >
      {/* Flip-Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '110%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>

        {/* VORDERSEITE */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          borderRadius: '16px',
          overflow: 'hidden',
          background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img
            src="/airfit-front.png"
            alt="AirFit Pro Vorderseite"
            style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply' }}
          />
          <div style={{
            position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.7rem',
            padding: '0.3rem 0.8rem', borderRadius: '999px', letterSpacing: '0.1em',
            backdropFilter: 'blur(4px)',
          }}>
            👆 VORNE — tippen für Rückseite
          </div>
        </div>

        {/* RÜCKSEITE */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: '16px',
          overflow: 'hidden',
          background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img
            src="/airfit-back.png"
            alt="AirFit Pro Rückseite"
            style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply' }}
          />
          <div style={{
            position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.7rem',
            padding: '0.3rem 0.8rem', borderRadius: '999px', letterSpacing: '0.1em',
            backdropFilter: 'blur(4px)',
          }}>
            👆 HINTEN — tippen für Vorderseite
          </div>
        </div>
      </div>
    </div>
  );
}
