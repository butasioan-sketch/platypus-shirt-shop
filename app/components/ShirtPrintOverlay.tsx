'use client';

import { PRINT_SPEC, getPlacementZoneStyle, getPrintOverlay } from '@/lib/print-spec';
import { getMotifStyle } from '@/lib/print-position';
import { useLocale } from '@/app/components/LocaleProvider';
import type { DesignLayer } from './DesignStudio';

interface ShirtPrintOverlayProps {
  side: 'front' | 'back';
  layers: DesignLayer[];
  selectedId?: string | null;
  onLayerPointerDown?: (e: React.MouseEvent | React.TouchEvent, layer: DesignLayer) => void;
  productId?: string;
}

/** Rendert ALLE Ebenen der aktuellen Seite gestapelt (Array-Reihenfolge = Z-Order).
 *  Nur die ausgewählte Ebene ist optisch hervorgehoben — Auswahl/Drag laeuft ueber
 *  onLayerPointerDown, das DesignStudio uebernimmt Selektion + Positionierung. */
export default function ShirtPrintOverlay({
  side,
  layers,
  selectedId = null,
  onLayerPointerDown,
  productId = '1',
}: ShirtPrintOverlayProps) {
  const { t } = useLocale();
  const overlay = getPrintOverlay(side, productId);
  const placement = getPlacementZoneStyle(side, productId);

  const overlayStyle = {
    position: 'absolute' as const,
    top: `${overlay.top}%`,
    left: `${overlay.left}%`,
    width: `${overlay.width}%`,
    height: `${overlay.height}%`,
    border: '2px dashed rgba(226,0,26,0.35)',
    borderRadius: '4px',
    pointerEvents: 'none' as const,
  };

  if (layers.length === 0) {
    return (
      <>
        <div style={overlayStyle} />
        <div className="plt-print-zone" style={{ ...placement, borderRadius: '3px', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.2)' }}>
          <div className="plt-print-guide">
            <span className="plt-print-guide-text">
              {t.studio.printZoneLabel}<br />
              {PRINT_SPEC.widthMm} × {PRINT_SPEC.heightMm} mm
            </span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={overlayStyle} />
      {layers.map((layer) => {
        const isSelected = layer.id === selectedId;
        return (
          <img
            key={layer.id}
            src={layer.src}
            alt={side === 'front' ? t.studio.front : t.studio.back}
            draggable={false}
            onMouseDown={(e) => onLayerPointerDown?.(e, layer)}
            onTouchStart={(e) => onLayerPointerDown?.(e, layer)}
            style={{
              ...getMotifStyle(side, layer.transform, productId),
              pointerEvents: 'auto',
              cursor: isSelected ? 'grab' : 'pointer',
              borderRadius: '3px',
              boxShadow: isSelected ? 'inset 0 0 0 2px #e2001a, 0 0 8px rgba(226,0,26,0.5)' : 'inset 0 0 0 1px rgba(255,255,255,0.2)',
            }}
          />
        );
      })}
    </>
  );
}
