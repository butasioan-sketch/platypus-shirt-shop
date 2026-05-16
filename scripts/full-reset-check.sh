#!/bin/bash

set -e

echo "========================================="
echo " PLATYPUS FULL RESET CHECK"
echo "========================================="

echo ""
echo "1. Git"
git status

echo ""
echo "2. Build"
npm run build

echo ""
echo "3. Healthcheck"
./scripts-healthcheck.sh || true

echo ""
echo "4. Systemcheck"
./scripts/system-check.sh || true

echo ""
echo "5. Backup"
./scripts/backup-project.sh || true

echo ""
echo "6. Deployment Ready"
echo "✅ Shop bereit für nächsten Deploy"

echo ""
echo "========================================="
echo " SYSTEM STABIL"
echo "========================================="
