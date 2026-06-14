'use client';

import React, { useState, useEffect } from 'react';

export default function DesignPreview({ designId }: { designId: string }) {
  const [front, setFront] = useState<string | null>(null);
  const [back, setBack] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/designs?id=${encodeURIComponent(designId)}`)
      .then(r => r.json())
      .then(data => {
        if (!active) return;
        setFront(data.design?.front_image || null);
        setBack(data.design?.back_image || null);
        setLoading(false);
      })
      .catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [designId]);

  if (loading) return <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.75rem' }}>Design wird geladen…</p>;
  if (!front && !back) return null;

  const thumb: React.CSSProperties = {
    width: '90px', height: '110px', objectFit: 'contain',
    background: '#f5f5f5', borderRadius: '8px', cursor: 'pointer', border: '1px solid #333',
  };

  return (
    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #1a1a1a' }}>
      <p style={{ color: '#e2001a', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        🎨 Kunden-Design (zum Drucken)
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {front && (
          <div style={{ textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={front} alt="Vorderseite" style={thumb} onClick={() => setZoom(front)} />
            <p style={{ color: '#888', fontSize: '0.65rem', marginTop: '0.25rem' }}>Vorne</p>
          </div>
        )}
        {back && (
          <div style={{ textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={back} alt="Rückseite" style={thumb} onClick={() => setZoom(back)} />
            <p style={{ color: '#888', fontSize: '0.65rem', marginTop: '0.25rem' }}>Hinten</p>
          </div>
        )}
      </div>
      <p style={{ color: '#555', fontSize: '0.65rem', marginTop: '0.4rem' }}>ID: {designId}</p>

      {zoom && (
        <div
          onClick={() => setZoom(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: '2rem',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom} alt="Design groß" style={{ maxWidth: '90%', maxHeight: '90%', background: '#fff', borderRadius: '12px' }} />
        </div>
      )}
    </div>
  );
}
