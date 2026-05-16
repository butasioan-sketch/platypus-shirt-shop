#!/bin/bash

set -e

clear

echo "======================================================"
echo "                 PLATYPUS EMPIRE MODE"
echo "======================================================"

echo ""
echo "1. Backup"
./scripts/backup-project.sh || true

echo ""
echo "2. Clean Build"
./scripts/clean-build.sh

echo ""
echo "3. Full Reset Check"
./scripts/full-reset-check.sh || true

echo ""
echo "4. AI Dev Cycle"
./scripts/ai-dev-cycle.sh || true

echo ""
echo "5. Final Launch Sequence"
./scripts/final-launch-sequence.sh || true

echo ""
echo "6. Shop Report"
./scripts/shop-report.sh || true

echo ""
echo "7. Open Live Shop"
xdg-open https://platypus-shirt-shop.vercel.app

echo ""
echo "8. Open Admin"
xdg-open https://platypus-shirt-shop.vercel.app/admin

echo ""
echo "======================================================"
echo "               PLATYPUS EMPIRE ACTIVE"
echo "======================================================"
