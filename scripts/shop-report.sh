#!/bin/bash

echo "========================================="
echo " PLATYPUS SHOP REPORT"
echo "========================================="

echo ""
echo "PROJECT:"
pwd

echo ""
echo "LAST COMMITS:"
git log --oneline -5

echo ""
echo "BUILD STATUS:"
npm run build >/dev/null && echo "✅ BUILD OK"

echo ""
echo "LIVE URL:"
echo "https://platypus-shirt-shop.vercel.app"

echo ""
echo "ADMIN:"
echo "https://platypus-shirt-shop.vercel.app/admin"

echo ""
echo "PRODUCTS:"
echo "https://platypus-shirt-shop.vercel.app/product/1"
echo "https://platypus-shirt-shop.vercel.app/product/2"

echo ""
echo "========================================="
echo " REPORT COMPLETE"
echo "========================================="
