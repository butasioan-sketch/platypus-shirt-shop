#!/bin/bash

set -e

REPORT="PRODUCT-TRIM-REPORT.md"

echo "# PLATYPUS Product Trim Report" > "$REPORT"
echo "" >> "$REPORT"
echo "Ziel: Produktseite stärker, kürzer und kaufbarer machen." >> "$REPORT"
echo "" >> "$REPORT"

echo "## Produkt-Komponenten Anzahl" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Komponenten: $(find components/product -type f | wc -l)" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Empfehlung" >> "$REPORT"
echo "" >> "$REPORT"
echo "### Oben behalten" >> "$REPORT"
echo "- Viewer" >> "$REPORT"
echo "- Preis" >> "$REPORT"
echo "- Größe" >> "$REPORT"
echo "- Fit" >> "$REPORT"
echo "- Warenkorb" >> "$REPORT"
echo "- Versand/Zahlung Kurzinfo" >> "$REPORT"
echo "" >> "$REPORT"

echo "### Nach unten verschieben" >> "$REPORT"
echo "- FAQ" >> "$REPORT"
echo "- Pflegehinweise" >> "$REPORT"
echo "- Qualitätscheck" >> "$REPORT"
echo "- Produktionsdetails" >> "$REPORT"
echo "- Rückgabehinweis" >> "$REPORT"
echo "" >> "$REPORT"

echo "### Später eventuell entfernen oder zusammenfassen" >> "$REPORT"
echo "- doppelte Trust-Blöcke" >> "$REPORT"
echo "- doppelte CTA-Blöcke" >> "$REPORT"
echo "- zu viele Audit-Blöcke" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Dateien" >> "$REPORT"
echo "" >> "$REPORT"
echo "\`\`\`" >> "$REPORT"
find components/product -type f | sort >> "$REPORT"
echo "\`\`\`" >> "$REPORT"

cat "$REPORT"

echo ""
echo "✅ Trim Report erstellt: $REPORT"
