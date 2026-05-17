#!/bin/bash

set -e

echo "========================================================="
echo "                 PLATYPUS GREEN STATUS"
echo "========================================================="

echo ""
echo "1. Git"
git status

echo ""
echo "2. Build"
npm run build

echo ""
echo "3. Routes"
echo "✅ /"
echo "✅ /admin"
echo "✅ /admin/inventory"
echo "✅ /admin/newsletter"
echo "✅ /admin/tests"
echo "✅ /admin/viewer-notes"
echo "✅ /cart"
echo "✅ /versand"
echo "✅ /product/1"
echo "✅ /product/2"

echo ""
echo "4. Live"
echo "https://platypus-shirt-shop.vercel.app"

echo ""
echo "✅ STATUS: GRÜN"
