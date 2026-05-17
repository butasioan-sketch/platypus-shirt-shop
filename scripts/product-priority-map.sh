#!/bin/bash

set -e

REPORT="PRODUCT-PRIORITY-MAP.md"

echo "# Product Priority Map" > "$REPORT"
echo "" >> "$REPORT"

echo "## KRITISCH (immer sichtbar)" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Produktbild" >> "$REPORT"
echo "- 360° Viewer" >> "$REPORT"
echo "- Preis" >> "$REPORT"
echo "- Größe" >> "$REPORT"
echo "- Fit" >> "$REPORT"
echo "- In den Warenkorb" >> "$REPORT"
echo "- Versand Kurzinfo" >> "$REPORT"
echo "" >> "$REPORT"

echo "## WICHTIG (unter Hauptbereich)" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Personalisierung" >> "$REPORT"
echo "- Druckposition" >> "$REPORT"
echo "- Trust Badges" >> "$REPORT"
echo "- Zahlung" >> "$REPORT"
echo "- Lagerstatus" >> "$REPORT"
echo "" >> "$REPORT"

echo "## SEKUNDÄR (weiter unten)" >> "$REPORT"
echo "" >> "$REPORT"
echo "- FAQ" >> "$REPORT"
echo "- Pflegehinweise" >> "$REPORT"
echo "- Produktionsdetails" >> "$REPORT"
echo "- Qualitätscheck" >> "$REPORT"
echo "- Launch Readiness" >> "$REPORT"
echo "" >> "$REPORT"

echo "## SPÄTER REDUZIEREN" >> "$REPORT"
echo "" >> "$REPORT"
echo "- doppelte CTA Bereiche" >> "$REPORT"
echo "- doppelte Vertrauens-Blöcke" >> "$REPORT"
echo "- zu viele finale Hinweise" >> "$REPORT"
echo "" >> "$REPORT"

cat "$REPORT"

echo ""
echo "✅ Product Priority Map erstellt: $REPORT"
