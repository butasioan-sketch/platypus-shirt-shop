#!/bin/bash

set -e

echo "========================================="
echo " PLATYPUS FIRST SALE MODE"
echo "========================================="

echo ""
echo "1. Build"
npm run build

echo ""
echo "2. Healthcheck"
./scripts-healthcheck.sh || true

echo ""
echo "3. Live Launch Check"
./scripts/live-launch-check.sh || true

echo ""
echo "4. Open Live Shop"
xdg-open https://platypus-shirt-shop.vercel.app

echo ""
echo "5. Open Product 1"
xdg-open https://platypus-shirt-shop.vercel.app/product/1

echo ""
echo "6. Open Cart"
xdg-open https://platypus-shirt-shop.vercel.app/cart

echo ""
echo "7. Open Admin"
xdg-open https://platypus-shirt-shop.vercel.app/admin

echo ""
echo "========================================="
echo " READY FOR FIRST TEST ORDER"
echo "========================================="
