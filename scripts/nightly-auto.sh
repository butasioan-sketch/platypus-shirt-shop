#!/bin/bash

set -e

echo "========================================="
echo " NIGHTLY AUTO MAINTENANCE"
echo "========================================="

./scripts/backup-project.sh || true
./scripts/clean-build.sh || true
./scripts/system-check.sh || true
./scripts-healthcheck.sh || true

git add .
git commit -m "nightly automatic maintenance" || true

echo ""
echo "✅ NIGHTLY MAINTENANCE COMPLETE"
