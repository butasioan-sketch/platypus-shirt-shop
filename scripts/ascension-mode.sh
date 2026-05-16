#!/bin/bash

set -e

clear

echo "========================================================="
echo "                 PLATYPUS ASCENSION MODE"
echo "========================================================="

echo ""
echo "🚀 ASCENDING COMPLETE SYSTEM..."

echo ""
echo "1. Backup"
./scripts/backup-project.sh || true

echo ""
echo "2. Build"
npm run build

echo ""
echo "3. System Check"
./scripts/system-check.sh || true

echo ""
echo "4. Healthcheck"
./scripts-healthcheck.sh || true

echo ""
echo "5. Shop Report"
./scripts/shop-report.sh || true

echo ""
echo "6. Final Launch"
./scripts/final-launch-sequence.sh || true

echo ""
echo "7. Open Localhost"
xdg-open http://localhost:3000 || true

echo ""
echo "8. Open Live Shop"
xdg-open https://platypus-shirt-shop.vercel.app || true

echo ""
echo "9. Open Admin"
xdg-open https://platypus-shirt-shop.vercel.app/admin || true

echo ""
echo "========================================================="
echo "                ASCENSION COMPLETE"
echo "========================================================="
