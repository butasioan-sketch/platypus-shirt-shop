#!/bin/bash

set -e

echo "========================================="
echo " PLATYPUS AI DEV CYCLE"
echo "========================================="

echo ""
echo "1. Saving Current State"
git status

echo ""
echo "2. Creating Backup"
./scripts/backup-project.sh || true

echo ""
echo "3. Installing Dependencies"
npm install

echo ""
echo "4. Running Build"
npm run build

echo ""
echo "5. Running Healthcheck"
./scripts-healthcheck.sh || true

echo ""
echo "6. Running System Check"
./scripts/system-check.sh || true

echo ""
echo "7. Git Auto Commit"
git add .
git commit -m "automatic ai dev cycle update" || true

echo ""
echo "8. Production Deploy"
./scripts-deploy.sh

echo ""
echo "========================================="
echo " AI DEV CYCLE COMPLETE"
echo "========================================="
