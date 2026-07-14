#!/bin/bash

set -e

echo "========================================================="
echo "                 PLATYPUS STABILITY AUDIT"
echo "========================================================="

echo ""
echo "1. Git Status"
git status

echo ""
echo "2. Script Count"
find scripts -type f -name "*.sh" | wc -l

echo ""
echo "3. Executable Scripts"
find scripts -type f -name "*.sh" -perm -111 | wc -l

echo ""
echo "4. Non Executable Scripts"
find scripts -type f -name "*.sh" ! -perm -111 || true

echo ""
echo "5. Build"
npm run build

echo ""
echo "6. Live URL"
echo "https://platypus-shirt-shop.vercel.app"

echo ""
echo "✅ STABILITY AUDIT COMPLETE"
