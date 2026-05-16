#!/bin/bash

set -e

clear

echo "========================================================="
echo "                  PLATYPUS BETA LAUNCH"
echo "========================================================="

echo ""
echo "🚀 STARTING BETA ENVIRONMENT..."

./scripts/backup-project.sh || true
./scripts/clean-build.sh || true
npm install
npm run build
./scripts/system-check.sh || true
./scripts-healthcheck.sh || true
./scripts/live-launch-check.sh || true
./scripts/shop-report.sh || true
./scripts/final-launch-sequence.sh || true

echo ""
echo "🌍 OPENING BETA SYSTEM..."

xdg-open http://localhost:3000 || true
xdg-open https://platypus-shirt-shop.vercel.app || true
xdg-open https://platypus-shirt-shop.vercel.app/admin || true
xdg-open https://platypus-shirt-shop.vercel.app/product/1 || true
xdg-open https://platypus-shirt-shop.vercel.app/product/2 || true
xdg-open https://platypus-shirt-shop.vercel.app/cart || true

echo ""
echo "========================================================="
echo "                BETA SYSTEM READY"
echo "========================================================="
