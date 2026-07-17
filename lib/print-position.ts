import type { CSSProperties } from 'react';
import { PRINT_SPEC, type PrintSide } from './print-spec';

export interface PrintTransform {
  scale: number;
  x: number;
  y: number;
}

/** Motiv füllt beim Upload die Standard-Druckfläche (A4-Größe, mittig in der nutzbaren Fläche) */
export function defaultPrintTransform(): PrintTransform {
  return { scale: 1, x: 0, y: 0 };
}

function clampOffset(v: number): number {
  const limit = PRINT_SPEC.maxOffsetPercent;
  return Math.max(-limit, Math.min(limit, v));
}

/**
 * Einzige Quelle der Wahrheit für die Motiv-Position: Rechteck in Prozent
 * des Shirt-Fotos (top/left/width/height). Wird von 2D-Editor UND 3D-Decal
 * gleichermaßen genutzt, damit beide Ansichten identisch mappen.
 */
export function getMotifRect(side: PrintSide, transform: PrintTransform) {
  const base = PRINT_SPEC.overlay[side];
  const zone = PRINT_SPEC.placement[side];
  const width = base.width * transform.scale;
  const height = base.height * transform.scale;
  const cx = zone.left + zone.width / 2 + (clampOffset(transform.x) / 100) * zone.width;
  const cy = zone.top + zone.height / 2 + (clampOffset(transform.y) / 100) * zone.height;
  return { top: cy - height / 2, left: cx - width / 2, width, height };
}

/** CSS für das Motiv — absolut positioniert relativ zum Shirt-Foto-Container */
export function getMotifStyle(side: PrintSide, transform: PrintTransform): CSSProperties {
  const r = getMotifRect(side, transform);
  return {
    position: 'absolute',
    top: `${r.top}%`,
    left: `${r.left}%`,
    width: `${r.width}%`,
    height: `${r.height}%`,
    objectFit: 'cover',
    pointerEvents: 'none',
    userSelect: 'none',
  };
}

/** 3D-Decal-Größe — dieselben Prozentwerte wie im 2D-Editor, auf die Mesh-Bounding-Box übertragen */
export function getDecalDimensions(
  bboxSize: { x: number; y: number; z: number },
  side: PrintSide,
  transform: PrintTransform,
): { w: number; h: number } {
  const r = getMotifRect(side, transform);
  return { w: bboxSize.x * (r.width / 100), h: bboxSize.y * (r.height / 100) };
}

/** 3D-Decal-Position — dieselben Prozentwerte wie im 2D-Editor, auf die Mesh-Bounding-Box übertragen */
export function getDecalPosition(
  center: { x: number; y: number; z: number },
  bboxSize: { x: number; y: number; z: number },
  side: PrintSide,
  transform: PrintTransform,
  front: boolean,
): [number, number, number] {
  const r = getMotifRect(side, transform);
  const cxPct = r.left + r.width / 2;
  const cyPct = r.top + r.height / 2;
  const dirX = front ? 1 : -1;
  const x = center.x + dirX * bboxSize.x * ((cxPct - 50) / 100);
  const y = center.y + bboxSize.y * (0.5 - cyPct / 100);
  const z = center.z + (front ? 1 : -1) * (bboxSize.z / 2);
  return [x, y, z];
}
