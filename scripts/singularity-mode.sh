#!/bin/bash

set -e

clear

echo "========================================================="
echo "                PLATYPUS SINGULARITY MODE"
echo "========================================================="

echo ""
echo "🚀 INITIALIZING FULL STACK CONTROL..."

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
echo "4. Healthcheck"
./scripts-healthcheck.sh || true

echo ""
echo "5. System Check"
./scripts/system-check.sh || true

echo ""
echo "6. Live Launch Check"
./scripts/live-launch-check.sh || true

echo ""
echo "7. Shop Report"
./scripts/shop-report.sh || true

echo ""
echo "8. Opening Shop"
xdg-open https://platypus-shirt-shop.vercel.app || true

echo ""
echo "9. Opening Admin"
xdg-open https://platypus-shirt-shop.vercel.app/admin || true

echo ""
echo "10. Final Deploy"
./scripts-deploy.sh || true

echo ""
echo "========================================================="
echo "               SINGULARITY MODE ACTIVE"
echo "========================================================="
