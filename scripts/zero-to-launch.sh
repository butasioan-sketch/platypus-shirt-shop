#!/bin/bash

set -e

echo "========================================================="
echo "               PLATYPUS ZERO TO LAUNCH"
echo "========================================================="

echo ""
echo "1. Backup"
./scripts/backup-project.sh || true

echo ""
echo "2. Clean Build"
./scripts/clean-build.sh || true

echo ""
echo "3. Build"
npm run build

echo ""
echo "4. Healthcheck"
./scripts-healthcheck.sh || true

echo ""
echo "5. Live Launch Check"
./scripts/live-launch-check.sh || true

echo ""
echo "6. Deploy"
./scripts-deploy.sh || true

echo ""
echo "7. Open Live Shop"
xdg-open https://platypus-shirt-shop.vercel.app || true

echo ""
echo "========================================================="
echo "                SHOP READY FOR TESTS"
echo "========================================================="
