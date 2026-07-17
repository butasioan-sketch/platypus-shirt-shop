'use client';

import { PRINT_SPEC, getPlacementZoneStyle } from '@/lib/print-spec';
import { getMotifStyle } from '@/lib/print-position';
import { useLocale } from '@/app/components/LocaleProvider';

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
  const { t } = useLocale();

  if (!imageSrc) {
    if (!showGuide) return null;
    return (
      <div className="plt-print-zone" style={{ ...getPlacementZoneStyle(side), borderRadius: '3px', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.2)' }}>
        <div className="plt-print-guide">
          <span className="plt-print-guide-text">
            {t.studio.printZoneLabel}<br />
            {PRINT_SPEC.widthMm} × {PRINT_SPEC.heightMm} mm
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={side === 'front' ? t.studio.front : t.studio.back}
      draggable={false}
      onMouseDown={interactive ? onPointerDown : undefined}
      onTouchStart={interactive ? onPointerDown : undefined}
      style={{
        ...getMotifStyle(side, { scale, x: pos.x, y: pos.y }),
        pointerEvents: interactive ? 'auto' : 'none',
        cursor: interactive ? 'grab' : 'default',
        borderRadius: '3px',
        boxShadow: 'inset 0 0 0 1px rgba(226,0,26,0.25)',
      }}
    />
  );
}
