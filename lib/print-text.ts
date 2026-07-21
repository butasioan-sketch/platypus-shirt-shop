// Text-Motiv: rendert einen Spruch als transparentes PNG bei Druckblatt-Aufloesung.
// Läuft danach durch dieselbe Pipeline wie ein Bild-Upload (applyUpload) — Zoom/Position/
// Druckblatt/Kundenblick/PDF brauchen dafür keinerlei Änderung.

import { PRINT_SPEC } from './print-spec';

const FONT_FAMILY = '"Arial Black", system-ui, sans-serif';
const DEFAULT_TEXT_COLOR = '#111111';
const MAX_WIDTH_RATIO = 0.84; // Rand links/rechts

/** Dunkle Textfarben zur Auswahl im Atelier — helle/pastellige Farben sublimieren auf weißem
 *  Stoff kaum sichtbar, daher bewusst auf gut lesbare, dunkle Töne begrenzt. */
export const TEXT_COLOR_OPTIONS = [
  { key: 'black', hex: '#111111', label: 'Schwarz' },
  { key: 'darkgrey', hex: '#3a3a3a', label: 'Dunkelgrau' },
  { key: 'navy', hex: '#1b2a4a', label: 'Navy' },
  { key: 'darkred', hex: '#7a1420', label: 'Dunkelrot' },
] as const;

export interface RenderedTextImage {
  dataUrl: string;
  width: number;
  height: number;
}

/** Rendert `text` zentriert, transparenter Hintergrund, Auto-Fit-Schriftgröße (schrumpft bis es passt, wickelt notfalls in 2 Zeilen). */
export function renderTextImage(text: string, fontScale: number = 1, color: string = DEFAULT_TEXT_COLOR): RenderedTextImage {
  const { widthPx, heightPx } = PRINT_SPEC;
  const canvas = document.createElement('canvas');
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas nicht verfügbar');

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;

  const maxWidth = widthPx * MAX_WIDTH_RATIO;
  const baseSize = Math.round(widthPx * 0.115 * Math.max(0.5, Math.min(2, fontScale)));
  const minSize = 40;

  const fits = (str: string, size: number) => {
    ctx.font = `800 ${size}px ${FONT_FAMILY}`;
    return ctx.measureText(str).width <= maxWidth;
  };

  let fontSize = baseSize;
  let lines = [text];

  while (!fits(text, fontSize) && fontSize > minSize) fontSize -= 4;

  if (!fits(text, fontSize)) {
    // Immer noch zu breit -> auf zwei Zeilen umbrechen, am Leerzeichen naechst der Mitte.
    const mid = Math.floor(text.length / 2);
    let splitAt = text.lastIndexOf(' ', mid);
    if (splitAt < 0) splitAt = text.indexOf(' ', mid);
    if (splitAt > 0) {
      lines = [text.slice(0, splitAt).trim(), text.slice(splitAt).trim()];
      fontSize = baseSize;
      const longest = lines.reduce((a, b) => (a.length >= b.length ? a : b));
      while (!fits(longest, fontSize) && fontSize > 28) fontSize -= 4;
    }
  }

  ctx.font = `800 ${fontSize}px ${FONT_FAMILY}`;
  const lineHeight = fontSize * 1.18;
  const startY = heightPx / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, widthPx / 2, startY + i * lineHeight);
  });

  return { dataUrl: canvas.toDataURL('image/png'), width: widthPx, height: heightPx };
}
