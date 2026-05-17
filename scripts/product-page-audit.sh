#!/bin/bash

set -e

echo "========================================================="
echo "               PLATYPUS PRODUCT PAGE AUDIT"
echo "========================================================="

echo ""
echo "1. Produkt-Komponenten"

find components/product -type f | sort

echo ""
echo "2. Anzahl Produkt-Komponenten"

find components/product -type f | wc -l

echo ""
echo "3. Produktseite Imports"

grep -n "components/product" app/product/\[id\]/page.tsx || true

echo ""
echo "4. Build"

npm run build

echo ""
echo "5. Live Produktseiten"

curl -I https://platypus-shirt-shop.vercel.app/product/1
curl -I https://platypus-shirt-shop.vercel.app/product/2

echo ""
echo "✅ PRODUCT PAGE AUDIT COMPLETE"
