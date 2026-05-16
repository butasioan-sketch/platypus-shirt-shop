#!/bin/bash

set -e

clear

echo "========================================================="
echo "                 PLATYPUS ALPHA LAUNCH"
echo "========================================================="

echo ""
echo "🚀 RUNNING ALPHA TEST SEQUENCE..."

./scripts/backup-project.sh || true
./scripts/clean-build.sh || true
npm install
npm run build
./scripts/system-check.sh || true
./scripts-healthcheck.sh || true
./scripts/live-launch-check.sh || true
./scripts/shop-report.sh || true

echo ""
echo "🌍 OPENING TEST ENVIRONMENT..."

xdg-open http://localhost:3000 || true
xdg-open https://platypus-shirt-shop.vercel.app || true
xdg-open https://platypus-shirt-shop.vercel.app/admin || true
xdg-open https://platypus-shirt-shop.vercel.app/product/1 || true

echo ""
echo "========================================================="
echo "               ALPHA ENVIRONMENT READY"
echo "========================================================="
