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
 * format='jpeg' (default) für DB-Speicherung: ~400–900 KB statt 4–12 MB PNG.
 * format='png' für maximale Qualität (Admin-Export auf Anfrage).
 */
export async function renderPrintSheet(
  src: string,
  transform: PrintTransform,
  options?: { background?: string; format?: 'jpeg' | 'png'; quality?: number },
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

  const format = options?.format ?? 'jpeg';
  const quality = options?.quality ?? (format === 'jpeg' ? 0.92 : undefined);
  return canvas.toDataURL(`image/${format}`, quality);
}

/** Prüft ob ein gerendertes Blatt die Zielauflösung hat */
export function isPrintReadyDataUrl(dataUrl: string): boolean {
  return (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/png')) && dataUrl.length > 10_000;
}