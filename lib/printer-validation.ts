// Drucker-Validierung für Procolored K13 Lite DTF-Drucker
// Max. Druckfläche: A3+ (329 × 483 mm)
// Auflösung: 1440 dpi (empfohlen: mind. 300 dpi für Uploads)
// Farben: CMYK + Weiß

export interface ImageMetadata {
  width: number; // Pixel
  height: number; // Pixel
  dpi?: number;
  type?: string;
  sizeInMB?: number;
}

export interface PrinterValidationWarning {
  level: 'warning' | 'error';
  message: string;
  suggestion?: string;
}

/**
 * Procolored K13 Lite Specs
 */
export const PRINTER_SPEC = {
  name: 'Procolored K13 Lite',
  maxPrintAreaMM: { width: 329, height: 483 }, // A3+
  maxPrintAreaPixels: { width: 3874, height: 5689 }, // @ 300 DPI
  minRecommendedDPI: 300,
  optimalDPI: 300,
  maxDPI: 1440,
  supportedFormats: ['image/png', 'image/jpeg', 'image/svg+xml'],
  colors: 'CMYK + Weiß',
} as const;

/**
 * Validiert Bild-Metadata gegen Drucker-Anforderungen
 */
export function validateForPrinter(image: ImageMetadata): PrinterValidationWarning[] {
  const warnings: PrinterValidationWarning[] = [];

  // DPI-Prüfung
  if (image.dpi && image.dpi < PRINTER_SPEC.minRecommendedDPI) {
    warnings.push({
      level: 'warning',
      message: `DPI zu niedrig (${image.dpi} DPI)`,
      suggestion: `Für professionellen Druck empfehlen wir mindestens ${PRINTER_SPEC.minRecommendedDPI} DPI. Niedrigere Auflösung kann zu unscharfen Drucken führen.`,
    });
  }

  // Bildgröße vs. Druckfläche (A3 = 297×420mm @ 300 DPI)
  const maxWidthPixels = 3508; // 297mm × 300 DPI / 25.4
  const maxHeightPixels = 4961; // 420mm × 300 DPI / 25.4

  if (image.width > maxWidthPixels || image.height > maxHeightPixels) {
    warnings.push({
      level: 'warning',
      message: `Bild sehr groß (${image.width}×${image.height} px)`,
      suggestion: `Max. empfohlene Größe: ${maxWidthPixels}×${maxHeightPixels} px (A3 @ 300 DPI). Größere Bilder werden skaliert.`,
    });
  }

  // Format-Prüfung
  if (image.type && !PRINTER_SPEC.supportedFormats.includes(image.type as any)) {
    warnings.push({
      level: 'error',
      message: `Format nicht unterstützt (${image.type})`,
      suggestion: `Bitte nutzen Sie PNG, JPG oder SVG.`,
    });
  }

  // Dateigröße-Warnung (> 50 MB könnte Upload-Probleme verursachen)
  if (image.sizeInMB && image.sizeInMB > 50) {
    warnings.push({
      level: 'warning',
      message: `Datei sehr groß (${image.sizeInMB.toFixed(1)} MB)`,
      suggestion: `Große Dateien können Upload-Zeit verlängern. Optimal: unter 10 MB.`,
    });
  }

  return warnings;
}

/**
 * Berechnet mm-Größe aus Pixel + DPI
 */
export function pixelsToMM(pixels: number, dpi: number = 300): number {
  return Math.round((pixels / dpi) * 25.4 * 10) / 10; // 1 decimal place
}

/**
 * Berechnet Pixel aus mm + DPI
 */
export function mmToPixels(mm: number, dpi: number = 300): number {
  return Math.round((mm / 25.4) * dpi);
}

/**
 * Prüft ob Bild druckfertig ist (keine Errors, nur Warnungen erlaubt)
 */
export function isPrintReady(warnings: PrinterValidationWarning[]): boolean {
  return !warnings.some(w => w.level === 'error');
}
