'use client';

import { PRINT_SPEC } from '@/lib/print-spec';
import { getPrintImageStyle, getPrintZoneStyle } from '@/lib/print-position';

interface ShirtPrintOverlayProps {
  side: 'front' | 'back';
  imageSrc?: string | null;
  scale?: number;
  pos?: { x: number; y: number };
  showGuide?: boolean;
  onPointerDown?: (e: React.MouseEvent | React.TouchEvent) => void;
  interactive?: boolean;
}

export default function ShirtPrintOverlay({
  side,
  imageSrc,
  scale = 1,
  pos = { x: 0, y: 0 },
  showGuide = true,
  onPointerDown,
  interactive = false,
}: ShirtPrintOverlayProps) {
  const zoneStyle = {
    ...getPrintZoneStyle(side),
    cursor: interactive && imageSrc ? 'grab' : 'default',
    boxShadow: imageSrc
      ? 'inset 0 0 0 1px rgba(226,0,26,0.25)'
      : 'inset 0 0 0 1.5px rgba(255,255,255,0.2)',
  };

  return (
    <div
      className="plt-print-zone"
      style={zoneStyle}
      onMouseDown={interactive ? onPointerDown : undefined}
      onTouchStart={interactive ? onPointerDown : undefined}
    >
      {showGuide && !imageSrc && (
        <div className="plt-print-guide">
          <span className="plt-print-guide-text">
            Druckfläche<br />
            {PRINT_SPEC.widthMm} × {PRINT_SPEC.heightMm} mm
          </span>
        </div>
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={side === 'front' ? 'Motiv Vorderseite' : 'Motiv Rückseite'}
          style={getPrintImageStyle(scale, pos)}
          draggable={false}
        />
      )}
    </div>
  );
}