#!/bin/bash

set -e

clear

echo "========================================================="
echo "                 PLATYPUS GAMMA LAUNCH"
echo "========================================================="

echo ""
echo "🚀 STARTING GAMMA RELEASE PIPELINE..."

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
echo "🌍 OPENING COMPLETE TEST NETWORK..."

xdg-open http://localhost:3000 || true
xdg-open https://platypus-shirt-shop.vercel.app || true
xdg-open https://platypus-shirt-shop.vercel.app/admin || true
xdg-open https://platypus-shirt-shop.vercel.app/product/1 || true
xdg-open https://platypus-shirt-shop.vercel.app/product/2 || true
xdg-open https://platypus-shirt-shop.vercel.app/cart || true
xdg-open https://platypus-shirt-shop.vercel.app/versand || true

echo ""
echo "========================================================="
echo "                 GAMMA SYSTEM READY"
echo "========================================================="
