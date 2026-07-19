// Kundenblick-Composite: Garment-Foto + Motiv exakt wie im 2D-Editor (Reklamations-Nachweis).
// Client-Canvas (wie renderPrintSheet) — teilt getMotifRect mit ShirtPrintOverlay, daher pixel-treu.

import { getGarmentProfile, getGarmentPhotoSrc, type PrintSide } from './print-spec';
import { getMotifRect, type PrintTransform } from './print-position';

const TARGET_WIDTH = 1000;

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

/**
 * Rendert den exakten Kundenblick (Atelier-Ansicht): Garment-Foto + Motiv auf der
 * vom Kunden gewählten Position/Skalierung. Gleiche getMotifRect-Quelle wie
 * ShirtPrintOverlay — Reklamations-Nachweis "das hat der Kunde gesehen".
 */
export async function renderCustomerViewComposite(
  side: PrintSide,
  motifSrc: string,
  transform: PrintTransform,
  productId: string = '1',
): Promise<string> {
  const profile = getGarmentProfile(productId);
  const targetHeight = Math.round(TARGET_WIDTH * (profile.photoHeight / profile.photoWidth));

  const canvas = document.createElement('canvas');
  canvas.width = TARGET_WIDTH;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas nicht verfügbar');

  const [garmentImg, motifImg] = await Promise.all([
    loadImage(getGarmentPhotoSrc(side, productId)),
    loadImage(motifSrc),
  ]);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, TARGET_WIDTH, targetHeight);

  // Garment-Foto: object-fit:contain, wie im Editor (Container-Aspect == Foto-Aspect -> volle Fläche)
  const garmentScale = Math.min(TARGET_WIDTH / garmentImg.width, targetHeight / garmentImg.height);
  const garmentW = garmentImg.width * garmentScale;
  const garmentH = garmentImg.height * garmentScale;
  const garmentX = (TARGET_WIDTH - garmentW) / 2;
  const garmentY = (targetHeight - garmentH) / 2;
  ctx.drawImage(garmentImg, garmentX, garmentY, garmentW, garmentH);

  // Motiv: identische Prozent-Position/-Größe wie getMotifStyle (ShirtPrintOverlay)
  const rect = getMotifRect(side, transform, productId);
  const boxX = garmentX + (rect.left / 100) * garmentW;
  const boxY = garmentY + (rect.top / 100) * garmentH;
  const boxW = (rect.width / 100) * garmentW;
  const boxH = (rect.height / 100) * garmentH;
  drawCover(ctx, motifImg, boxX, boxY, boxW, boxH);

  return canvas.toDataURL('image/jpeg', 0.85);
}
