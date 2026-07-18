// Druckauftrag: eingefrorener Produktions-Snapshot (Transforms + Placement) + PDF-Export.
// Ebene 1 (Druckblatt) vs Ebene 2 (Platzierung) — siehe lib/print-export.ts Kommentar.

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { PRINT_SPEC, SHIRT_PHOTO, formatSizeMm, getPlacementZone, NO_PRINT_NOTE, type PrintSide } from './print-spec';
import { getMotifRect, defaultPrintTransform, type PrintTransform } from './print-position';
import type { DesignRecord } from './db';
import type { Order } from './types';

export interface PlacementInfo {
  side: PrintSide;
  percent: { top: number; left: number; width: number; height: number };
  mm: { top: number; left: number; width: number; height: number };
  note: string;
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

// Näherung: Shirt-Foto-Höhe in mm aus den einzigen zwei mm-Referenzwerten der Gr.-L-Kalibrierung.
// Nicht pixelgenau vermessen — dient der Produktions-Orientierung, nicht als exaktes Maßband.
const PHOTO_HEIGHT_MM_APPROX = PRINT_SPEC.shirtLengthMm + PRINT_SPEC.collarOffsetMm;
const PHOTO_WIDTH_MM_APPROX = PHOTO_HEIGHT_MM_APPROX * (SHIRT_PHOTO.width / SHIRT_PHOTO.height);

/** Position/Größe des Motivs auf dem Shirt — Prozent (verbindlich) + mm (Näherung, siehe note). */
export function computePlacementMm(side: PrintSide, transform: PrintTransform): PlacementInfo {
  const r = getMotifRect(side, transform);
  return {
    side,
    percent: { top: round1(r.top), left: round1(r.left), width: round1(r.width), height: round1(r.height) },
    mm: {
      top: round1((r.top / 100) * PHOTO_HEIGHT_MM_APPROX),
      left: round1((r.left / 100) * PHOTO_WIDTH_MM_APPROX),
      width: round1((r.width / 100) * PHOTO_WIDTH_MM_APPROX),
      height: round1((r.height / 100) * PHOTO_HEIGHT_MM_APPROX),
    },
    note: 'mm ungefähr (kalibriert aus shirtLengthMm + collarOffsetMm, Gr. L). Prozentwerte sind die verbindliche Quelle für die Platzierung.',
  };
}

export interface PrintJobDesignEntry {
  id: string;
  hasFront: boolean;
  hasBack: boolean;
  frontTransform: PrintTransform | null;
  backTransform: PrintTransform | null;
  placement: { front?: PlacementInfo; back?: PlacementInfo };
}

export interface PrintJobPayload {
  orderId: string;
  frozenAt: string;
  printSpec: {
    widthMm: number; heightMm: number; dpi: number; widthPx: number; heightPx: number;
    blank: string; method: string;
  };
  designs: PrintJobDesignEntry[];
}

/** Baut den unveränderlichen Produktions-Snapshot — wird beim Freeze in orders.print_job gespeichert. */
export function buildPrintJobPayload(orderId: string, designs: DesignRecord[]): PrintJobPayload {
  return {
    orderId,
    frozenAt: new Date().toISOString(),
    printSpec: {
      widthMm: PRINT_SPEC.widthMm, heightMm: PRINT_SPEC.heightMm, dpi: PRINT_SPEC.dpi,
      widthPx: PRINT_SPEC.widthPx, heightPx: PRINT_SPEC.heightPx,
      blank: PRINT_SPEC.blank, method: PRINT_SPEC.method,
    },
    designs: designs.map((d) => {
      const frontTransform = d.frontImage ? (d.frontTransform || defaultPrintTransform()) : null;
      const backTransform = d.backImage ? (d.backTransform || defaultPrintTransform()) : null;
      return {
        id: d.id,
        hasFront: !!d.frontImage,
        hasBack: !!d.backImage,
        frontTransform,
        backTransform,
        placement: {
          front: frontTransform ? computePlacementMm('front', frontTransform) : undefined,
          back: backTransform ? computePlacementMm('back', backTransform) : undefined,
        },
      };
    }),
  };
}

// === PDF ===

const A4_PT: [number, number] = [595.28, 841.89]; // 210x297mm in PDF-Punkten (72dpi)
const MARGIN = 42;

function drawText(page: PDFPage, font: PDFFont, text: string, x: number, y: number, size = 11, color = rgb(0.07, 0.07, 0.07)) {
  page.drawText(text, { x, y, size, font, color });
}

function parseDataUrl(dataUrl: string): { mime: 'jpeg' | 'png'; bytes: Uint8Array } | null {
  const m = /^data:image\/(jpeg|png);base64,(.+)$/.exec(dataUrl);
  if (!m) return null;
  return { mime: m[1] as 'jpeg' | 'png', bytes: Buffer.from(m[2], 'base64') };
}

async function embedImage(doc: PDFDocument, dataUrl: string) {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;
  return parsed.mime === 'jpeg' ? doc.embedJpg(parsed.bytes) : doc.embedPng(parsed.bytes);
}

function drawPlacementDiagram(page: PDFPage, x: number, y: number, w: number, h: number, placement: PlacementInfo) {
  // Shirt-Fläche als Referenzrahmen (Seitenverhältnis des Shirt-Fotos)
  const shirtAspect = SHIRT_PHOTO.width / SHIRT_PHOTO.height;
  const boxH = h;
  const boxW = boxH * shirtAspect;
  const boxX = x + (w - boxW) / 2;
  const boxY = y;

  page.drawRectangle({ x: boxX, y: boxY, width: boxW, height: boxH, borderColor: rgb(0.6, 0.6, 0.6), borderWidth: 1 });

  // No-Print-Zone: gestrichelter Rahmen der nutzbaren Placement-Zone (Schulter/Seitennaht/Kragen/Saum ausgespart)
  const zone = getPlacementZone(placement.side);
  page.drawRectangle({
    x: boxX + (zone.left / 100) * boxW,
    y: boxY + boxH - ((zone.top + zone.height) / 100) * boxH,
    width: (zone.width / 100) * boxW,
    height: (zone.height / 100) * boxH,
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 0.75,
    borderDashArray: [3, 3],
  });

  const motifX = boxX + (placement.percent.left / 100) * boxW;
  // PDF-Y wächst nach oben, unsere top% wächst nach unten -> umrechnen
  const motifTopFromTop = (placement.percent.top / 100) * boxH;
  const motifH = (placement.percent.height / 100) * boxH;
  const motifW = (placement.percent.width / 100) * boxW;
  const motifY = boxY + boxH - motifTopFromTop - motifH;

  page.drawRectangle({ x: motifX, y: motifY, width: motifW, height: motifH, color: rgb(0.89, 0, 0.1), opacity: 0.35, borderColor: rgb(0.89, 0, 0.1), borderWidth: 1.5 });
}

/** Erzeugt das Druckauftrag-PDF: Auftragskopf + pro Design/Seite Druckblatt + Platzierungsseite. */
export async function generatePrintPdf(order: Order, designs: DesignRecord[], printJob: PrintJobPayload): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  // --- Seite 1: Auftragskopf ---
  const cover = doc.addPage(A4_PT);
  const [pw, ph] = A4_PT;
  let y = ph - MARGIN;
  drawText(cover, bold, 'PLATYPUS — Druckauftrag', MARGIN, y, 20);
  y -= 26;
  drawText(cover, font, `${order.id} · ${new Date(printJob.frozenAt).toLocaleString('de-DE')}`, MARGIN, y, 10, rgb(0.4, 0.4, 0.4));
  y -= 14;
  drawText(cover, font, `Status: ${order.status} · Land: ${order.shippingCountry}${order.shippingMethod ? ' · ' + order.shippingMethod : ''}`, MARGIN, y, 10, rgb(0.4, 0.4, 0.4));
  y -= 30;

  drawText(cover, bold, 'Artikel', MARGIN, y, 12);
  y -= 18;
  for (const item of order.items || []) {
    drawText(cover, font, `${item.quantity}× ${item.name} · Größe ${item.size}${item.color ? ' · ' + item.color : ''} · Design ${item.designId || 'FEHLT'}`, MARGIN, y, 10);
    y -= 15;
  }
  y -= 20;

  drawText(cover, bold, 'Druckstandard', MARGIN, y, 12);
  y -= 18;
  drawText(cover, font, `Format: ${formatSizeMm()} Hochformat · ${PRINT_SPEC.dpi} dpi · ${PRINT_SPEC.widthPx} × ${PRINT_SPEC.heightPx} px`, MARGIN, y, 10);
  y -= 15;
  drawText(cover, font, `Blank: ${PRINT_SPEC.blank} · Methode: ${PRINT_SPEC.method}`, MARGIN, y, 10);
  y -= 15;
  drawText(cover, font, `Epson SC-F100: Papier A4, „Actual size" / 100 % — kein Fit-to-Page`, MARGIN, y, 10);
  y -= 25;
  drawText(cover, font, `Eingefroren am: ${new Date(printJob.frozenAt).toLocaleString('de-DE')} (unveränderlicher Produktions-Snapshot)`, MARGIN, y, 9, rgb(0.5, 0.5, 0.5));

  if (designs.every((d) => !d.frontImage && !d.backImage)) {
    y -= 30;
    drawText(cover, bold, 'KEIN MOTIV HINTERLEGT — nicht druckbar. Kundenkontakt oder Storno prüfen.', MARGIN, y, 11, rgb(0.85, 0.2, 0));
  }

  // --- Pro Design: Druckblatt + Platzierung je Seite ---
  for (const d of designs) {
    const entry = printJob.designs.find((e) => e.id === d.id);
    const sides: { side: PrintSide; image: string | null | undefined; placement: PlacementInfo | undefined }[] = [
      { side: 'front', image: d.frontImage, placement: entry?.placement.front },
      { side: 'back', image: d.backImage, placement: entry?.placement.back },
    ];

    for (const { side, image, placement } of sides) {
      if (!image) continue;
      const sideLabel = side === 'front' ? 'VORNE' : 'HINTEN';
      const preview = side === 'front' ? d.frontPreview : d.backPreview;

      // Druckblatt-Seite
      const sheetPage = doc.addPage(A4_PT);
      drawText(sheetPage, bold, `DRUCKBLATT ${sideLabel} — ${d.id}`, MARGIN, ph - MARGIN, 13);
      const img = await embedImage(doc, image);
      if (img) {
        const maxW = pw - MARGIN * 2;
        const maxH = ph - MARGIN * 2 - 30;
        const scale = Math.min(maxW / img.width, maxH / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        sheetPage.drawImage(img, { x: (pw - w) / 2, y: MARGIN, width: w, height: h });
      }

      // Platzierungs-Seite
      if (placement) {
        const placePage = doc.addPage(A4_PT);
        drawText(placePage, bold, `PLATZIERUNG ${sideLabel} — ${d.id}`, MARGIN, ph - MARGIN, 13);
        let py = ph - MARGIN - 30;
        drawText(placePage, font, `Position (% der Placement-Zone, Gr. L): top ${placement.percent.top}% · left ${placement.percent.left}% · width ${placement.percent.width}% · height ${placement.percent.height}%`, MARGIN, py, 9);
        py -= 14;
        drawText(placePage, font, `Näherung mm: top ${placement.mm.top} · left ${placement.mm.left} · width ${placement.mm.width} · height ${placement.mm.height}`, MARGIN, py, 9, rgb(0.45, 0.45, 0.45));
        py -= 14;
        drawText(placePage, font, placement.note, MARGIN, py, 7.5, rgb(0.55, 0.55, 0.55));
        py -= 30;
        drawText(placePage, font, 'A4-Transfer so auf Blank positionieren (rot = Motiv-Bereich, gestrichelt = nutzbare Zone):', MARGIN, py, 9);
        py -= 14;
        drawText(placePage, font, NO_PRINT_NOTE, MARGIN, py, 7.5, rgb(0.55, 0.55, 0.55));
        py -= 16;
        drawPlacementDiagram(placePage, MARGIN, MARGIN, pw - MARGIN * 2, py - MARGIN, placement);
      }

      // Kundenblick-Seite — Reklamations-Nachweis: exakt das, was der Kunde im Atelier sah
      const viewPage = doc.addPage(A4_PT);
      drawText(viewPage, bold, `KUNDENBLICK ${sideLabel} — ${d.id}`, MARGIN, ph - MARGIN, 13);
      drawText(viewPage, font, 'Kundenansicht Atelier — verbindlich für Reklamation', MARGIN, ph - MARGIN - 18, 9, rgb(0.45, 0.45, 0.45));
      if (preview) {
        const viewImg = await embedImage(doc, preview);
        if (viewImg) {
          const maxW = pw - MARGIN * 2;
          const maxH = ph - MARGIN * 2 - 60;
          const scale = Math.min(maxW / viewImg.width, maxH / viewImg.height);
          const w = viewImg.width * scale;
          const h = viewImg.height * scale;
          viewPage.drawImage(viewImg, { x: (pw - w) / 2, y: MARGIN + 20, width: w, height: h });
        }
      } else {
        drawText(viewPage, font, 'Kundenblick-Preview nicht verfügbar (Legacy-Design vor Einführung dieser Ansicht).', MARGIN, ph - MARGIN - 60, 9, rgb(0.6, 0.4, 0));
        drawText(viewPage, font, 'Siehe Platzierungsseite (% + Diagramm) als Ersatz-Nachweis.', MARGIN, ph - MARGIN - 76, 9, rgb(0.45, 0.45, 0.45));
      }
      drawText(viewPage, font, `${order.id} · ${d.id} · ${new Date(printJob.frozenAt).toLocaleString('de-DE')}`, MARGIN, MARGIN - 8, 7.5, rgb(0.55, 0.55, 0.55));
    }
  }

  return doc.save();
}
