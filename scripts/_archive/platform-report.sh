#!/bin/bash

set -e

REPORT="PLATFORM-REPORT.md"

echo "# PLATYPUS Platform Report" > "$REPORT"
echo "" >> "$REPORT"
echo "Kompletter Plattform- und Infrastrukturstatus." >> "$REPORT"
echo "" >> "$REPORT"

echo "## Projektstatus" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Status: Aktiv" >> "$REPORT"
echo "- Framework: Next.js 16" >> "$REPORT"
echo "- Deployment: Vercel" >> "$REPORT"
echo "- Betriebssystem: Linux Mint / Ubuntu kompatibel" >> "$REPORT"
echo "- Architektur: Bash + Node + Next.js + Stripe" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Technische Bereiche" >> "$REPORT"
echo "" >> "$REPORT"
echo "- 360° Shirt Viewer" >> "$REPORT"
echo "- Produktseiten" >> "$REPORT"
echo "- Cart & Checkout" >> "$REPORT"
echo "- Stripe Payment API" >> "$REPORT"
echo "- Admin Dashboard" >> "$REPORT"
echo "- Newsletter Bereich" >> "$REPORT"
echo "- Lagerverwaltung" >> "$REPORT"
echo "- Versandseiten" >> "$REPORT"
echo "- Rechtliche Seiten" >> "$REPORT"
echo "- Deployment Automation" >> "$REPORT"
echo "- Healthchecks & Reports" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Script Infrastruktur" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Script Anzahl: $(find scripts -type f -name "*.sh" | wc -l)" >> "$REPORT"
echo "- Executable Scripts: $(find scripts -type f -name "*.sh" -perm -111 | wc -l)" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Build Status" >> "$REPORT"
echo "" >> "$REPORT"

if npm run build >/dev/null 2>&1; then
  echo "✅ Build erfolgreich" >> "$REPORT"
else
  echo "❌ Build Fehler" >> "$REPORT"
fi

echo "" >> "$REPORT"
echo "## URLs" >> "$REPORT"
echo "" >> "$REPORT"
echo "- Live Shop: https://platypus-shirt-shop.vercel.app" >> "$REPORT"
echo "- Admin: https://platypus-shirt-shop.vercel.app/admin" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Vision" >> "$REPORT"
echo "" >> "$REPORT"
echo "PLATYPUS verbindet Branding, Infrastruktur, Automation und Shop-Systeme" >> "$REPORT"
echo "in einer vollständig kontrollierten Linux-Umgebung." >> "$REPORT"

cat "$REPORT"

echo ""
echo "✅ Plattform-Report erstellt: $REPORT"
