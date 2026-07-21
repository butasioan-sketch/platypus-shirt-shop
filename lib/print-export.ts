import { PRINT_SPEC, type PrintSide } from './print-spec';
import { getMotifRect, type PrintTransform } from './print-position';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * ZWEI-EBENEN-MODELL DER DRUCKDATEN (Strategie: EMPFOHLEN, siehe
 * CLAUDE-AUFTRAG-DRUCKAUFTRAG-PDF-FREEZE.md):
 *
 * EBENE 1 — DRUCKBLATT (diese Datei): das A4-Transferpapier für den Sublimationsdruck
 * (Epson SC-F100), immer 210×297 mm / 2480×3508 px. Nur `scale` (Zoom) wirkt sich
 * auf den Bildausschnitt aus — object-fit:cover, zentriert.
 *
 * EBENE 2 — PLATZIERUNG AUF SHIRT (lib/print-position.ts / lib/print-job.ts):
 * `transform.x/y` beschreiben NICHT den Bildausschnitt hier, sondern wo das fertige
 * A4-Blatt auf Vorder-/Rückseite des Blanks aufgepresst wird (Produktionsanweisung).
 * getMotifRect(side, transform) ist die Single Source für diese Position; das
 * Druckauftrag-PDF zeigt sie als eigene "Platzierung"-Seite neben dem reinen A4-Blatt.
 *
 * Diese Datei rechnet x/y bewusst NICHT ein — das würde den physischen Druckinhalt
 * ändern. Nur mit explizitem Auftrag anders zu handhaben.
 *
 * MULTI-LAYER-ATELIER (mehrere Bilder/Texte pro Seite, siehe `renderPrintSheetMulti`
 * unten): Sobald mehrere Motive einzeln positionierbar sind, ergibt eine globale
 * "nur scale, x/y global fürs ganze Blatt"-Regel keinen Sinn mehr — jedes Einzelmotiv
 * braucht seine eigene Position. Dort wird x/y bewusst JE Ebene eingerechnet.
 */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number,
) {
  const renderScale = Math.max(boxW / img.width, boxH / img.height);
  const renderW = img.width * renderScale;
  const renderH = img.height * renderScale;
  ctx.drawImage(
    img,
    boxX + (boxW - renderW) / 2,
    boxY + (boxH - renderH) / 2,
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
  drawCover(ctx, img, boxX, boxY, boxW, boxH);
  ctx.restore();

  const format = options?.format ?? 'jpeg';
  const quality = options?.quality ?? (format === 'jpeg' ? 0.92 : undefined);
  return canvas.toDataURL(`image/${format}`, quality);
}

/** Prüft ob ein gerendertes Blatt die Zielauflösung hat */
export function isPrintReadyDataUrl(dataUrl: string): boolean {
  return (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/png')) && dataUrl.length > 10_000;
}

/**
 * MEHRERE MOTIVE PRO SEITE (freie Platzierung, mehrere Bilder/Texte): jede Ebene bekommt
 * ihre eigene Position/Größe INNERHALB der Druckfläche, exakt wie im 2D-Editor gezogen —
 * `getMotifRect` liefert dieselben Prozent-Koordinaten, die auch `ShirtPrintOverlay` und
 * das 3D-Decal nutzen, hier einfach auf die volle A4-Blattfläche statt auf das Garment-Foto
 * angewendet. Damit ist "was der Kunde im Editor sieht" == "was auf dem A4-Blatt landet"
 * WYSIWYG, ohne das alte Einzelmotiv-Zwei-Ebenen-Modell (siehe `renderPrintSheet` oben) zu
 * verändern. Reihenfolge im Array = Z-Order (erstes Element unten, letztes oben).
 */
export async function renderPrintSheetMulti(
  side: PrintSide,
  layers: { src: string; transform: PrintTransform }[],
  productId: string = '1',
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

  for (const layer of layers) {
    const img = await loadImage(layer.src);
    const rect = getMotifRect(side, layer.transform, productId);
    const boxX = (rect.left / 100) * widthPx;
    const boxY = (rect.top / 100) * heightPx;
    const boxW = (rect.width / 100) * widthPx;
    const boxH = (rect.height / 100) * heightPx;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, widthPx, heightPx);
    ctx.clip();
    drawCover(ctx, img, boxX, boxY, boxW, boxH);
    ctx.restore();
  }

  const format = options?.format ?? 'jpeg';
  const quality = options?.quality ?? (format === 'jpeg' ? 0.92 : undefined);
  return canvas.toDataURL(`image/${format}`, quality);
}