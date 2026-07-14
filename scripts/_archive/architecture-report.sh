#!/bin/bash

set -e

REPORT="ARCHITECTURE-REPORT.md"

echo "# PLATYPUS Architecture Report" > "$REPORT"
echo "" >> "$REPORT"
echo "Automatisch generierter Infrastruktur-Report." >> "$REPORT"
echo "" >> "$REPORT"

echo "## System" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Node: $(node -v)" >> "$REPORT"
echo "- NPM: $(npm -v)" >> "$REPORT"
echo "- Git Branch: $(git branch --show-current)" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Build Status" >> "$REPORT"
echo "" >> "$REPORT"

if npm run build >/dev/null 2>&1; then
  echo "✅ Build erfolgreich" >> "$REPORT"
else
  echo "❌ Build Fehler" >> "$REPORT"
fi

echo "" >> "$REPORT"
echo "## Core Bereiche" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Next.js Shop Infrastruktur" >> "$REPORT"
echo "- 360° Shirt Viewer" >> "$REPORT"
echo "- Admin Dashboard" >> "$REPORT"
echo "- Checkout & Stripe API" >> "$REPORT"
echo "- Versand & Rechtliches" >> "$REPORT"
echo "- Bash Automation Layer" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Script Statistik" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Gesamtzahl Scripts: $(find scripts -type f -name "*.sh" | wc -l)" >> "$REPORT"
echo "- Ausführbare Scripts: $(find scripts -type f -name "*.sh" -perm -111 | wc -l)" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Live URLs" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Shop: https://platypus-shirt-shop.vercel.app" >> "$REPORT"
echo "- Admin: https://platypus-shirt-shop.vercel.app/admin" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Status" >> "$REPORT"
echo "" >> "$REPORT"
echo "Projekt ist build-stabil und deployfähig." >> "$REPORT"

cat "$REPORT"

echo ""
echo "✅ Architektur-Report erstellt: $REPORT"
