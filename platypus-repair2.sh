#!/bin/bash
set -euo pipefail

GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
info() { echo -e "${CYAN}[->]${NC} $1"; }
fail() { echo -e "${RED}[FAIL]${NC} $1"; }

# ============================================================
# Viewer.tsx ansehen
# ============================================================
info "Aktueller Viewer.tsx Inhalt (erste 30 Zeilen):"
head -30 app/components/Viewer/Viewer.tsx
echo ""
info "Was liegt im Viewer Ordner:"
ls -la app/components/Viewer/

# ============================================================
# FIX: Viewer.tsx durch saubere, eigenständige Version ersetzen
# (kein ColorPicker Import, kein fehlendes Modul)
# ============================================================
info "Viewer.tsx wird durch eigenständige Version ersetzt..."

cat > app/components/Viewer/Viewer.tsx << 'EOF'
'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ViewerProps {
  color?: string;
}

export default function Viewer({ color = '#f5f5f5' }: ViewerProps) {
  const [rotation, setRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [dragging, setDragging] = useState(false);
  const lastX = useRef(0);

  useEffect(() => {
    if (!autoRotate || dragging) return;
    const interval = setInterval(() => {
      setRotation(r => (r + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [autoRotate, dragging]);

  const onDown = (clientX: number) => {
    setDragging(true);
    setAutoRotate(false);
    lastX.current = clientX;
  };

  const onMove = (clientX: number) => {
    if (!dragging) return;
    const delta = clientX - lastX.current;
    setRotation(r => (r + delta) % 360);
    lastX.current = clientX;
  };

  const onUp = () => setDragging(false);

  const isDark = color === '#111111' || color === '#111' || color === '#000';
  const shirtFill = color;
  const shadowColor = isDark ? '#000' : '#ccc';

  return (
    <div
      style={{
        width: '100%', height: '100%', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none',
        overflow: 'hidden',
      }}
      onMouseDown={e => onDown(e.clientX)}
      onMouseMove={e => onMove(e.clientX)}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={e => onDown(e.touches[0].clientX)}
      onTouchMove={e => onMove(e.touches[0].clientX)}
      onTouchEnd={onUp}
    >
      {/* SHIRT SVG mit 3D Rotation */}
      <div style={{
        transform: `perspective(800px) rotateY(${rotation}deg)`,
        transition: dragging ? 'none' : 'transform 0.05s linear',
        transformStyle: 'preserve-3d',
      }}>
        <svg width="220" height="260" viewBox="0 0 220 260" style={{ filter: `drop-shadow(0 20px 30px ${shadowColor}40)` }}>
          {/* Shirt Körper */}
          <path
            d="M60 40 L90 20 L110 35 L130 20 L160 40 L185 65 L165 90 L150 80 L150 230 L70 230 L70 80 L55 90 L35 65 Z"
            fill={shirtFill}
            stroke={isDark ? '#333' : '#ddd'}
            strokeWidth="1.5"
          />
          {/* Kragen */}
          <path d="M90 20 Q110 45 130 20" fill="none" stroke={isDark ? '#333' : '#ddd'} strokeWidth="1.5" />
          {/* Falten-Andeutung */}
          <line x1="110" y1="90" x2="110" y2="220" stroke={isDark ? '#222' : '#eee'} strokeWidth="1" opacity="0.5" />
        </svg>
      </div>

      {/* Rotation Indikator */}
      <div style={{
        position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '0.5rem', alignItems: 'center',
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); setAutoRotate(a => !a); }}
          style={{
            background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
            borderRadius: '999px', padding: '0.3rem 0.75rem', fontSize: '0.7rem',
            cursor: 'pointer', backdropFilter: 'blur(8px)',
          }}
        >
          {autoRotate ? '⏸ Auto' : '▶ Auto'}
        </button>
        <span style={{
          background: 'rgba(0,0,0,0.6)', color: '#888', borderRadius: '999px',
          padding: '0.3rem 0.75rem', fontSize: '0.7rem', backdropFilter: 'blur(8px)',
        }}>
          {Math.round(((rotation % 360) + 360) % 360)}°
        </span>
      </div>

      {/* Hint */}
      <div style={{
        position: 'absolute', top: '1rem', left: '50%', transform: 'translateX(-50%)',
        color: isDark ? '#666' : '#999', fontSize: '0.7rem', letterSpacing: '0.1em',
        textTransform: 'uppercase', pointerEvents: 'none',
      }}>
        ← Ziehen zum Drehen →
      </div>
    </div>
  );
}
EOF
ok "Viewer.tsx ersetzt (eigenständig, kein ColorPicker)"

# Falls ein ColorPicker-Stub anderswo gebraucht wird, prüfen
if grep -rl "from './ColorPicker'" app/ 2>/dev/null | grep -v Viewer.tsx; then
  info "ColorPicker wird noch woanders importiert — erstelle Stub"
  cat > app/components/Viewer/ColorPicker.tsx << 'EOF'
'use client';
export default function ColorPicker() { return null; }
EOF
  ok "ColorPicker Stub erstellt"
fi

# ============================================================
# BUILD TEST — stoppt bei Fehler
# ============================================================
info "Build wird getestet..."
echo ""

if npm run build > /tmp/repair2-build.log 2>&1; then
  ok "================================"
  ok "  BUILD ERFOLGREICH"
  ok "================================"
else
  fail "================================"
  fail "  NÄCHSTER FEHLER"
  fail "================================"
  echo ""
  tail -35 /tmp/repair2-build.log
  echo ""
  fail "STOPP — kein Deploy. Schick mir diese Zeilen."
  exit 1
fi

echo ""
info "Routen die jetzt live gehen:"
find app -name "page.tsx" | sed 's|app||;s|/page.tsx||;s|^$|/|' | sort
echo ""
echo "================================================"
echo "  BEREIT — Build ist grün"
echo "================================================"
echo ""
echo "Wenn du deployen willst:"
echo "  git add . && git commit -m 'fix: viewer + proxy migration' && npx vercel --prod"

