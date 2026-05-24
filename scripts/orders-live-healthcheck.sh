#!/bin/bash

set -e

BASE_URL="https://platypus-shirt-shop.vercel.app"

echo "========================================================="
echo "              PLATYPUS ORDERS LIVE HEALTHCHECK"
echo "========================================================="

echo ""
echo "1. Build"
npm run build

echo ""
echo "2. Live Routes"

ROUTES=(
  "/admin/orders"
  "/admin"
  "/admin/inventory"
  "/cart"
  "/api/payments/create-checkout"
)

for route in "${ROUTES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")

  if [[ "$STATUS" == "200" || "$STATUS" == "405" ]]; then
    echo "✅ $route -> $STATUS"
  else
    echo "❌ $route -> $STATUS"
    exit 1
  fi
done

echo ""
echo "3. Stripe Checkout"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/payments/create-checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod":"card",
    "reference":"ORDERS-LIVE-HEALTHCHECK",
    "shipping":4.99,
    "total":34.98,
    "items":[
      {
        "name":"Essential Shirt Weiß",
        "size":"M",
        "price":29.99,
        "quantity":1
      }
    ]
  }')

echo "$RESPONSE"

if echo "$RESPONSE" | grep -q "stripe_checkout_created"; then
  echo "✅ Stripe Checkout aktiv"
else
  echo "❌ Stripe Checkout Problem"
  exit 1
fi

echo ""
echo "========================================================="
echo " ORDERS LIVE HEALTHCHECK COMPLETE"
echo "========================================================="
