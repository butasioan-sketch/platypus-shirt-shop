#!/bin/bash

set -e

BASE_URL="https://platypus-shirt-shop.vercel.app"

echo "========================================================="
echo "                 ADMIN ORDERS AUDIT"
echo "========================================================="

echo ""
echo "1. Build"
npm run build

echo ""
echo "2. Admin Routes"
curl -I "$BASE_URL/admin"
curl -I "$BASE_URL/admin/orders"
curl -I "$BASE_URL/admin/inventory"

echo ""
echo "3. Stripe Checkout Test"
./scripts/stripe-test-check.sh

echo ""
echo "✅ ADMIN ORDERS AUDIT COMPLETE"
