#!/bin/bash

set -e

BASE_URL="https://platypus-shirt-shop.vercel.app"

echo "========================================================="
echo "              PLATYPUS ORDERS SYSTEM AUDIT"
echo "========================================================="

echo ""
echo "1. Build"
npm run build

echo ""
echo "2. Admin Orders Route"
curl -I "$BASE_URL/admin/orders"

echo ""
echo "3. Order Components"
find components/admin -type f | grep "Order" | sort

echo ""
echo "4. Order Component Count"
find components/admin -type f | grep "Order" | wc -l

echo ""
echo "5. Stripe Checkout Check"
./scripts/stripe-test-check.sh

echo ""
echo "========================================================="
echo " ORDERS SYSTEM AUDIT COMPLETE"
echo "========================================================="
