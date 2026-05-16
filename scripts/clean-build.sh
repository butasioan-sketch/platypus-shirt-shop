#!/bin/bash

set -e

echo "========================================="
echo " CLEAN BUILD"
echo "========================================="

rm -rf .next
rm -rf node_modules/.cache || true

npm install
npm run build

echo ""
echo "✅ CLEAN BUILD COMPLETE"
