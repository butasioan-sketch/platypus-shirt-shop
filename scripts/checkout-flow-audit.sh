#!/bin/bash

set -e

BASE_URL="https://platypus-shirt-shop.vercel.app"

echo "========================================================="
echo "              PLATYPUS CHECKOUT FLOW AUDIT"
echo "========================================================="

echo ""
echo "1. Build prüfen"
npm run build

echo ""
echo "2. Cart Route prüfen"
curl -I "$BASE_URL/cart"

echo ""
echo "3. Payment API Status"
curl -s "$BASE_URL/api/payments/create-checkout"
echo ""

echo ""
echo "4. Stripe Checkout Session prüfen"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/payments/create-checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod":"card",
    "reference":"CHECKOUT-FLOW-AUDIT",
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

echo ""
echo "5. Ergebnis"

if echo "$RESPONSE" | grep -q "stripe_checkout_created"; then
  echo "✅ Stripe Checkout Session erstellt"
else
  echo "❌ Stripe Checkout Session fehlt"
  exit 1
fi

if echo "$RESPONSE" | grep -q "checkout.stripe.com"; then
  echo "✅ Stripe Redirect URL vorhanden"
else
  echo "❌ Stripe Redirect URL fehlt"
  exit 1
fi

echo ""
echo "========================================================="
echo " CHECKOUT FLOW AUDIT COMPLETE"
echo "========================================================="
