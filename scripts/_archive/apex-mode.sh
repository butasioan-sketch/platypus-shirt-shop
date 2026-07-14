#!/bin/bash

set -e

clear

echo "========================================================="
echo "                    PLATYPUS APEX MODE"
echo "========================================================="

echo ""
echo "🚀 EXECUTING FINAL SYSTEM CHAIN..."

./scripts/backup-project.sh || true
./scripts/clean-build.sh || true
npm run build
./scripts/system-check.sh || true
./scripts-healthcheck.sh || true
./scripts/live-launch-check.sh || true
./scripts/shop-report.sh || true
./scripts-deploy.sh || true

echo ""
echo "🌍 OPENING SHOP..."
xdg-open https://platypus-shirt-shop.vercel.app || true

echo ""
echo "🛠 OPENING ADMIN..."
xdg-open https://platypus-shirt-shop.vercel.app/admin || true

echo ""
echo "========================================================="
echo "                  APEX MODE COMPLETE"
echo "========================================================="
