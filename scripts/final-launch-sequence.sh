#!/bin/bash

set -e

echo "========================================="
echo " PLATYPUS FINAL LAUNCH SEQUENCE"
echo "========================================="

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
echo "5. Live Launch Check"
./scripts/live-launch-check.sh || true

echo ""
echo "6. Git Status"
git status

echo ""
echo "7. Production Deploy"
./scripts-deploy.sh

echo ""
echo "========================================="
echo " PLATYPUS IS LIVE"
echo "========================================="

echo ""
echo "🌍 URL:"
echo "https://platypus-shirt-shop.vercel.app"
