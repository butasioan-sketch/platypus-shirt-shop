#!/bin/bash

set -e

REPORT="PRODUCT-PAGE-REPORT.md"

echo "# PLATYPUS Product Page Report" > "$REPORT"
echo "" >> "$REPORT"
echo "Automatisch generierter Status der Produktseiten." >> "$REPORT"
echo "" >> "$REPORT"

echo "## Produkt-Komponenten" >> "$REPORT"
echo "" >> "$REPORT"
echo "\`\`\`" >> "$REPORT"
find components/product -type f | sort >> "$REPORT"
echo "\`\`\`" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Statistik" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Produkt-Komponenten: $(find components/product -type f | wc -l)" >> "$REPORT"
echo "- Produktseiten Route: /product/[id]" >> "$REPORT"
echo "- Live Produkt 1: https://platypus-shirt-shop.vercel.app/product/1" >> "$REPORT"
echo "- Live Produkt 2: https://platypus-shirt-shop.vercel.app/product/2" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Build Status" >> "$REPORT"
echo "" >> "$REPORT"

if npm run build >/tmp/platypus-product-build.log 2>&1; then
  echo "✅ Build erfolgreich" >> "$REPORT"
else
  echo "❌ Build Fehler" >> "$REPORT"
fi

echo "" >> "$REPORT"
echo "## Fokus" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Vertrauen erhöhen" >> "$REPORT"
echo "- Produktkonfiguration verbessern" >> "$REPORT"
echo "- Mobile Checkout CTA stärken" >> "$REPORT"
echo "- Kaufentscheidung vereinfachen" >> "$REPORT"

cat "$REPORT"

echo ""
echo "✅ Produktseiten-Report erstellt: $REPORT"
