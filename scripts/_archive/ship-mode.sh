#!/bin/bash

set -e

echo "========================================="
echo "        PLATYPUS SHIP MODE"
echo "========================================="

echo ""
echo "1. Backup"
./scripts/backup-project.sh || true

echo ""
echo "2. Clean Build"
./scripts/clean-build.sh

echo ""
echo "3. System Check"
./scripts/system-check.sh || true

echo ""
echo "4. Healthcheck"
./scripts-healthcheck.sh || true

echo ""
echo "5. AI Dev Cycle"
./scripts/ai-dev-cycle.sh || true

echo ""
echo "6. Final Deploy"
./scripts-deploy.sh

echo ""
echo "7. Open Live Shop"
xdg-open https://platypus-shirt-shop.vercel.app

echo ""
echo "========================================="
echo " SHOP IS SHIPPED"
echo "========================================="
