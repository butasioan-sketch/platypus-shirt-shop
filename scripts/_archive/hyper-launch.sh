#!/bin/bash

set -e

clear

echo "========================================================="
echo "                PLATYPUS HYPER LAUNCH"
echo "========================================================="

echo ""
echo "🚀 RUNNING HYPER DEPLOYMENT..."

./scripts/backup-project.sh || true
./scripts/clean-build.sh || true
npm run build
./scripts/system-check.sh || true
./scripts-healthcheck.sh || true
./scripts/live-launch-check.sh || true
./scripts/shop-report.sh || true
./scripts/final-launch-sequence.sh || true

echo ""
echo "🌍 Opening Shop..."
xdg-open https://platypus-shirt-shop.vercel.app || true

echo ""
echo "🛠 Opening Admin..."
xdg-open https://platypus-shirt-shop.vercel.app/admin || true

echo ""
echo "========================================================="
echo "                 HYPER LAUNCH COMPLETE"
echo "========================================================="
