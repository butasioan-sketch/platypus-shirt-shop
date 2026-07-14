import type { CSSProperties } from 'react';
import { PRINT_SPEC, getPrintOverlayBox } from './print-spec';

export interface PrintTransform {
  scale: number;
  x: number;
  y: number;
}

/** Motiv füllt beim Upload die Standard-Druckfläche (realistisch, cover) */
export function defaultPrintTransform(): PrintTransform {
  return { scale: 1, x: 0, y: 0 };
}

/** CSS für Motiv innerhalb der Druckfläche — deckt die Zone wie echter Sublimationsdruck */
export function getPrintImageStyle(
  scale: number,
  pos: { x: number; y: number },
): CSSProperties {
  return {
    position: 'absolute',
    width: `${Math.round(scale * 100)}%`,
    height: `${Math.round(scale * 100)}%`,
    objectFit: 'cover',
    objectPosition: `${50 + pos.x}% ${50 + pos.y}%`,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    userSelect: 'none',
  };
}

export function getPrintZoneStyle(): CSSProperties {
  return {
    ...getPrintOverlayBox(),
    pointerEvents: 'auto',
    zIndex: 2,
    borderRadius: '3px',
    overflow: 'hidden',
  };
}

/** 3D-Decal-Größe aus gleicher Overlay-Spec wie 2D-Editor */
export function getDecalDimensions(
  bboxSize: { x: number; y: number; z: number },
  scale: number,
): { w: number; h: number } {
  const o = PRINT_SPEC.overlay;
  const h = bboxSize.y * (o.height / 100) * scale;
  const w = h * PRINT_SPEC.aspectRatio;
  return { w, h };
}

/** 3D-Decal-Position — spiegelt overlay top/left aus print-spec */
export function getDecalPosition(
  center: { x: number; y: number; z: number },
  bboxSize: { x: number; y: number; z: number },
  print: PrintTransform,
  front: boolean,
): [number, number, number] {
  const o = PRINT_SPEC.overlay;
  const dirX = front ? 1 : -1;
  const zoneCenterY = center.y + bboxSize.y * (0.5 - (o.top + o.height / 2) / 100);
  const zoneCenterX = center.x + dirX * bboxSize.x * ((o.left + o.width / 2 - 50) / 100);
  const x = zoneCenterX + dirX * (print.x / 100) * bboxSize.x * 0.35;
  const y = zoneCenterY - (print.y / 100) * bboxSize.y * 0.35;
  const z = center.z + (front ? 1 : -1) * (bboxSize.z / 2);
  return [x, y, z];
}