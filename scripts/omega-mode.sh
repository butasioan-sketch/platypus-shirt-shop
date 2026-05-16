#!/bin/bash

set -e

clear

echo "========================================================="
echo "                    PLATYPUS OMEGA MODE"
echo "========================================================="

echo ""
echo "🚀 FULL SYSTEM INITIALIZATION..."

echo ""
echo "1. Backup"
./scripts/backup-project.sh || true

echo ""
echo "2. Clean Build"
./scripts/clean-build.sh || true

echo ""
echo "3. Build"
npm run build

echo ""
echo "4. System Check"
./scripts/system-check.sh || true

echo ""
echo "5. Healthcheck"
./scripts-healthcheck.sh || true

echo ""
echo "6. Full Reset Check"
./scripts/full-reset-check.sh || true

echo ""
echo "7. Shop Report"
./scripts/shop-report.sh || true

echo ""
echo "8. Opening Localhost"
xdg-open http://localhost:3000 || true

echo ""
echo "9. Opening Live Shop"
xdg-open https://platypus-shirt-shop.vercel.app || true

echo ""
echo "10. Opening Admin"
xdg-open https://platypus-shirt-shop.vercel.app/admin || true

echo ""
echo "11. Deploy"
./scripts-deploy.sh || true

echo ""
echo "========================================================="
echo "                  OMEGA MODE COMPLETE"
echo "========================================================="
