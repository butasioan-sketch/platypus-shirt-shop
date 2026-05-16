#!/bin/bash

set -e

REPORT="DOCTOR-REPORT.md"

echo "# PLATYPUS Doctor Report" > "$REPORT"
echo "" >> "$REPORT"

echo "## Zeitpunkt" >> "$REPORT"
echo "" >> "$REPORT"
date >> "$REPORT"
echo "" >> "$REPORT"

echo "## Git Status" >> "$REPORT"
echo '```' >> "$REPORT"
git status >> "$REPORT"
echo '```' >> "$REPORT"
echo "" >> "$REPORT"

echo "## Build Status" >> "$REPORT"
echo "" >> "$REPORT"

if npm run build >/tmp/platypus-build.log 2>&1; then
  echo "✅ Build erfolgreich" >> "$REPORT"
else
  echo "❌ Build Fehler" >> "$REPORT"
fi

echo "" >> "$REPORT"
echo "## Build Log" >> "$REPORT"
echo '```' >> "$REPORT"
cat /tmp/platypus-build.log >> "$REPORT"
echo '```' >> "$REPORT"
echo "" >> "$REPORT"

echo "## Dateien" >> "$REPORT"
echo "" >> "$REPORT"

for file in \
  app/page.tsx \
  app/layout.tsx \
  components/HeroSection.tsx \
  components/ProductCard.tsx \
  components/Shirt360.tsx \
  components/Checkout.tsx \
  components/BrandLogo.tsx \
  public/brand/logo.jpeg \
  data/products.ts \
  data/payments.ts \
  data/shipping.ts
do
  if [ -f "$file" ]; then
    echo "✅ $file" >> "$REPORT"
  else
    echo "❌ $file fehlt" >> "$REPORT"
  fi
done

echo "" >> "$REPORT"
echo "## Statistik" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Components: $(find components -type f | wc -l)" >> "$REPORT"
echo "- Scripts: $(find scripts -type f -name '*.sh' | wc -l)" >> "$REPORT"
echo "- App Dateien: $(find app -type f | wc -l)" >> "$REPORT"

cat "$REPORT"

echo ""
echo "✅ Doctor Report erstellt: $REPORT"
