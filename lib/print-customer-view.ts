// Kundenblick-Composite: Shirt-Foto + Motiv exakt wie im 2D-Editor (Reklamations-Nachweis).
// Client-Canvas (wie renderPrintSheet) — teilt getMotifRect mit ShirtPrintOverlay, daher pixel-treu.

import { SHIRT_PHOTO, type PrintSide } from './print-spec';
import { getMotifRect, type PrintTransform } from './print-position';

const TARGET_WIDTH = 1000;
const TARGET_HEIGHT = Math.round(TARGET_WIDTH * (SHIRT_PHOTO.height / SHIRT_PHOTO.width));

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** object-fit:cover — Bild skaliert & zentriert füllen, Überstand abgeschnitten (wie CSS auf dem Motiv-<img>). */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number,
) {
  const scale = Math.max(boxW / img.width, boxH / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.save();
  ctx.beginPath();
  ctx.rect(boxX, boxY, boxW, boxH);
  ctx.clip();
  ctx.drawImage(img, boxX + (boxW - w) / 2, boxY + (boxH - h) / 2, w, h);
  ctx.restore();
}

const SHIRT_PHOTO_SRC: Record<PrintSide, string> = {
  front: '/airfit-front-t.png',
  back: '/airfit-back-t.png',
};

/**
 * Rendert den exakten Kundenblick (Atelier-Ansicht): Shirt-Foto + Motiv auf der
 * vom Kunden gewählten Position/Skalierung. Gleiche getMotifRect-Quelle wie
 * ShirtPrintOverlay — Reklamations-Nachweis "das hat der Kunde gesehen".
 */
export async function renderCustomerViewComposite(
  side: PrintSide,
  motifSrc: string,
  transform: PrintTransform,
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas nicht verfügbar');

  const [shirtImg, motifImg] = await Promise.all([
    loadImage(SHIRT_PHOTO_SRC[side]),
    loadImage(motifSrc),
  ]);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

  // Shirt-Foto: object-fit:contain, wie im Editor (Container-Aspect == Foto-Aspect -> volle Fläche)
  const shirtScale = Math.min(TARGET_WIDTH / shirtImg.width, TARGET_HEIGHT / shirtImg.height);
  const shirtW = shirtImg.width * shirtScale;
  const shirtH = shirtImg.height * shirtScale;
  const shirtX = (TARGET_WIDTH - shirtW) / 2;
  const shirtY = (TARGET_HEIGHT - shirtH) / 2;
  ctx.drawImage(shirtImg, shirtX, shirtY, shirtW, shirtH);

  // Motiv: identische Prozent-Position/-Größe wie getMotifStyle (ShirtPrintOverlay)
  const rect = getMotifRect(side, transform);
  const boxX = shirtX + (rect.left / 100) * shirtW;
  const boxY = shirtY + (rect.top / 100) * shirtH;
  const boxW = (rect.width / 100) * shirtW;
  const boxH = (rect.height / 100) * shirtH;
  drawCover(ctx, motifImg, boxX, boxY, boxW, boxH);

  return canvas.toDataURL('image/jpeg', 0.85);
}
