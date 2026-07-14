import { PRINT_SPEC } from './print-spec';
import type { PrintTransform } from './print-position';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** CSS object-fit:cover + object-position — identisch zu getPrintImageStyle */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number,
  pos: { x: number; y: number },
) {
  const anchorPctX = (50 + pos.x) / 100;
  const anchorPctY = (50 + pos.y) / 100;
  const renderScale = Math.max(boxW / img.width, boxH / img.height);
  const renderW = img.width * renderScale;
  const renderH = img.height * renderScale;
  const anchorBoxX = anchorPctX * boxW;
  const anchorBoxY = anchorPctY * boxH;
  const anchorImgX = anchorPctX * renderW;
  const anchorImgY = anchorPctY * renderH;
  ctx.drawImage(
    img,
    boxX + anchorBoxX - anchorImgX,
    boxY + anchorBoxY - anchorImgY,
    renderW,
    renderH,
  );
}

/**
 * Rendert ein Motiv als druckfertiges Blatt — exakt 2480×3508 px (210×297 mm @ 300 dpi).
 * Entspricht der Vorschau im Design-Studio (cover + Position + Zoom).
 */
export async function renderPrintSheet(
  src: string,
  transform: PrintTransform,
  options?: { background?: string },
): Promise<string> {
  const { widthPx, heightPx } = PRINT_SPEC;
  const canvas = document.createElement('canvas');
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas nicht verfügbar');

  ctx.fillStyle = options?.background ?? '#ffffff';
  ctx.fillRect(0, 0, widthPx, heightPx);

  const img = await loadImage(src);
  const boxW = widthPx * transform.scale;
  const boxH = heightPx * transform.scale;
  const boxX = (widthPx - boxW) / 2;
  const boxY = (heightPx - boxH) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, widthPx, heightPx);
  ctx.clip();
  drawCover(ctx, img, boxX, boxY, boxW, boxH, { x: transform.x, y: transform.y });
  ctx.restore();

  return canvas.toDataURL('image/png');
}

/** Prüft ob ein gerendertes Blatt die Zielauflösung hat */
export function isPrintReadyDataUrl(dataUrl: string): boolean {
  return dataUrl.startsWith('data:image/png') && dataUrl.length > 50_000;
}