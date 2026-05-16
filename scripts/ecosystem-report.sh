#!/bin/bash

set -e

REPORT="ECOSYSTEM-REPORT.md"

echo "# PLATYPUS Ecosystem Report" > "$REPORT"
echo "" >> "$REPORT"
echo "Vollständige Übersicht des gesamten Shop-Ökosystems." >> "$REPORT"
echo "" >> "$REPORT"

echo "## Infrastruktur" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Frontend: Next.js 16 + React + Tailwind" >> "$REPORT"
echo "- Deployment: Vercel" >> "$REPORT"
echo "- Runtime: Node.js" >> "$REPORT"
echo "- Betriebssystem: Linux Mint / Ubuntu kompatibel" >> "$REPORT"
echo "- Automatisierung: Bash Script Layer" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Shop Funktionen" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Produktseiten" >> "$REPORT"
echo "- 360° Shirt Viewer" >> "$REPORT"
echo "- Warenkorb" >> "$REPORT"
echo "- Stripe Checkout API" >> "$REPORT"
echo "- Versandseite" >> "$REPORT"
echo "- Datenschutz / Impressum / AGB" >> "$REPORT"
echo "- Brand Sections & Visual Identity" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Admin Bereiche" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Inventory Management" >> "$REPORT"
echo "- Newsletter Dashboard" >> "$REPORT"
echo "- Launch Readiness Board" >> "$REPORT"
echo "- Payment Test Panel" >> "$REPORT"
echo "- Manual Test Runner" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Automation Layer" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Deploy Scripts" >> "$REPORT"
echo "- Backup Scripts" >> "$REPORT"
echo "- Healthchecks" >> "$REPORT"
echo "- Launch Pipelines" >> "$REPORT"
echo "- Build Audits" >> "$REPORT"
echo "- Reporting Systeme" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Statistik" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Scripts Gesamt: $(find scripts -type f -name "*.sh" | wc -l)" >> "$REPORT"
echo "- Components Gesamt: $(find components -type f | wc -l)" >> "$REPORT"
echo "- App Routes Gesamt: $(find app -type f | wc -l)" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Live URLs" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Shop: https://platypus-shirt-shop.vercel.app" >> "$REPORT"
echo "- Admin: https://platypus-shirt-shop.vercel.app/admin" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Build Status" >> "$REPORT"
echo "" >> "$REPORT"

if npm run build >/dev/null 2>&1; then
  echo "✅ Build stabil" >> "$REPORT"
else
  echo "❌ Build Fehler" >> "$REPORT"
fi

echo "" >> "$REPORT"
echo "## Fazit" >> "$REPORT"
echo "" >> "$REPORT"
echo "PLATYPUS ist ein kontrolliertes Shop- und Infrastruktur-System" >> "$REPORT"
echo "mit eigener Linux-Automation, Deployment-Pipelines und Branding-Struktur." >> "$REPORT"

cat "$REPORT"

echo ""
echo "✅ Ecosystem Report erstellt: $REPORT"
