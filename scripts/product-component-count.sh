#!/bin/bash

set -e

echo "========================================================="
echo "              PRODUCT COMPONENT COUNT"
echo "========================================================="

echo ""
echo "Produkt-Komponenten:"
find components/product -type f | wc -l

echo ""
echo "Letzte Produkt-Komponenten:"
find components/product -type f | sort | tail -20

echo ""
echo "Produktseite Build:"
npm run build

echo ""
echo "✅ PRODUCT COMPONENT COUNT COMPLETE"
