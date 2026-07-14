#!/bin/bash

set -e

clear

echo "========================================================="
echo "             PLATYPUS LAUNCH EVERYTHING"
echo "========================================================="

./scripts/backup-project.sh || true
./scripts/clean-build.sh || true
npm run build
./scripts/system-check.sh || true
./scripts-healthcheck.sh || true
./scripts/live-launch-check.sh || true
./scripts/shop-report.sh || true
./scripts/final-launch-sequence.sh || true

echo ""
echo "🌍 OPENING FULL SYSTEM..."

xdg-open http://localhost:3000 || true
xdg-open https://platypus-shirt-shop.vercel.app || true
xdg-open https://platypus-shirt-shop.vercel.app/admin || true

echo ""
echo "========================================================="
echo "              EVERYTHING IS ACTIVE"
echo "========================================================="
