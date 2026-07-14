#!/bin/bash

set -e

clear

echo "========================================================="
echo "              PLATYPUS WORLD DOMINATION"
echo "========================================================="

echo ""
echo "1. Backup"
./scripts/backup-project.sh || true

echo ""
echo "2. Build"
npm run build

echo ""
echo "3. Healthcheck"
./scripts-healthcheck.sh || true

echo ""
echo "4. System Check"
./scripts/system-check.sh || true

echo ""
echo "5. Shop Report"
./scripts/shop-report.sh || true

echo ""
echo "6. Open Live Shop"
xdg-open https://platypus-shirt-shop.vercel.app

echo ""
echo "7. Open Admin"
xdg-open https://platypus-shirt-shop.vercel.app/admin

echo ""
echo "========================================================="
echo "             PLATYPUS SYSTEM FULLY ACTIVE"
echo "========================================================="
