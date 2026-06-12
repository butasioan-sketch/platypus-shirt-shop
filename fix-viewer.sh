#!/bin/bash
set -uo pipefail
GREEN='\033[0;32m'; CYAN='\033[0;36m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
info() { echo -e "${CYAN}[->]${NC} $1"; }
fail() { echo -e "${RED}[FAIL]${NC} $1"; }

info "Viewer wird durch echte 360°-Version ersetzt..."

cat > app/components/Viewer/Viewer.tsx << 'EOF'
'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ViewerProps {
  color?: string;
}

export default function Viewer({ color = '#f5f5f5' }: ViewerProps) {
  const [angle, setAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [dragging, setDragging] = useState(false);
  const lastX = useRef(0);

  useEffect(() => {
    if (!autoRotate || dragging) return;
    const id = setInterval(() => setAngle(a => (a + 1) % 360), 40);
    return () => clearInterval(id);
  }, [autoRotate, dragging]);

  const norm = ((angle % 360) + 360) % 360;
  // Rückseite zwischen 90° und 270°
  const isBack = norm > 90 && norm < 270;
  // Wie stark zur Seite gedreht (0 = frontal, 1 = Kante)
  const sideFactor = Math.abs(Math.sin((norm * Math.PI) / 180));
  // Breite schrumpft zur Kante, aber nie ganz auf 0 (min 12%)
  const widthScale = 0.12 + 0.88 * Math.abs(Math.cos((norm * Math.PI) / 180));

  const onDown = (x: number) => { setDragging(true); setAutoRotate(false); lastX.current = x; };
  const onMove = (x: number) => {
    if (!dragging) return;
    setAngle(a => (a + (x - lastX.current)) % 360);
    lastX.current = x;
  };
  const onUp = () => setDragging(false);

  const isDark = ['#111111', '#111', '#000', '#000000'].includes(color);
  const shirtColor = color;
  const lineColor = isDark ? '#444' : '#ccc';
  const printColor = isDark ? '#222' : '#e8e8e8';

  return (
    <div
      style={{
        width: '100%', height: '100%', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none', overflow: 'hidden',
      }}
      onMouseDown={e => onDown(e.clientX)}
      onMouseMove={e => onMove(e.clientX)}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={e => onDown(e.touches[0].clientX)}
      onTouchMove={e => onMove(e.touches[0].clientX)}
      onTouchEnd={onUp}
    >
      <div style={{
        transform: `scaleX(${widthScale})`,
        transition: dragging ? 'none' : 'transform 0.04s linear',
      }}>
        <svg width="240" height="300" viewBox="0 0 240 300" style={{ filter: `drop-shadow(0 12px 20px rgba(0,0,0,${isDark ? 0.5 : 0.2}))` }}>
          {/* T-Shirt Körper */}
          <path
            d="M75 50 L105 25 L135 25 L165 50 L200 75 L178 105 L160 92 L160 280 L80 280 L80 92 L62 105 L40 75 Z"
            fill={shirtColor} stroke={lineColor} strokeWidth="2"
          />
          {/* Ärmel-Andeutung */}
          <path d="M75 50 L62 105 L80 92 Z" fill={shirtColor} stroke={lineColor} strokeWidth="1.5"/>
          <path d="M165 50 L178 105 L160 92 Z" fill={shirtColor} stroke={lineColor} strokeWidth="1.5"/>
          {/* Kragen: vorne rund, hinten flach */}
          {isBack ? (
            <path d="M105 25 Q120 33 135 25" fill="none" stroke={lineColor} strokeWidth="2"/>
          ) : (
            <path d="M105 25 Q120 52 135 25" fill="none" stroke={lineColor} strokeWidth="2"/>
          )}
          {/* Druckfläche-Andeutung */}
          <rect x="95" y="120" width="50" height="70" rx="4" fill={printColor} opacity="0.5"/>
        </svg>
      </div>

      {/* Seiten-Label */}
      <div style={{
        position: 'absolute', top: '0.75rem', left: '50%', transform: 'translateX(-50%)',
        color: isDark ? '#888' : '#999', fontSize: '0.7rem', letterSpacing: '0.15em',
        textTransform: 'uppercase', pointerEvents: 'none', fontWeight: 600,
      }}>
        {isBack ? 'Rückseite' : 'Vorderseite'}
      </div>

      {/* Steuerung */}
      <div style={{
        position: 'absolute', bottom: '0.75rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '0.5rem', alignItems: 'center',
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); setAutoRotate(a => !a); }}
          style={{
            background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
            borderRadius: '999px', padding: '0.3rem 0.8rem', fontSize: '0.7rem',
            cursor: 'pointer',
          }}
        >
          {autoRotate ? '⏸ Auto' : '▶ Auto'}
        </button>
        <span style={{
          background: 'rgba(0,0,0,0.6)', color: '#aaa', borderRadius: '999px',
          padding: '0.3rem 0.8rem', fontSize: '0.7rem',
        }}>
          {Math.round(norm)}°
        </span>
      </div>

      <div style={{
        position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)',
        color: isDark ? '#555' : '#aaa', fontSize: '0.65rem', letterSpacing: '0.1em',
        textTransform: 'uppercase', pointerEvents: 'none',
      }}>
        ← ziehen zum drehen →
      </div>
    </div>
  );
}
EOF
ok "Viewer ersetzt"

info "Build wird getestet..."
if npm run build > /tmp/viewer-build.log 2>&1; then
  ok "BUILD GRÜN"
else
  fail "Build Fehler:"
  tail -20 /tmp/viewer-build.log
  exit 1
fi

echo ""
echo "=================================================="
echo "  VIEWER REPARIERT"
echo "=================================================="
echo ""
echo "  Server läuft wahrscheinlich noch. Falls nicht:"
echo "    npm run dev"
echo ""
echo "  Dann im Chrome neu laden:"
echo "    localhost:3000/product/1"
echo ""
echo "  Das Shirt dreht sich jetzt sauber,"
echo "  zeigt Vorder- und Rückseite, ohne zur Linie zu werden."
echo "=================================================="

