#!/bin/bash

set -e

BASE_URL="https://platypus-shirt-shop.vercel.app"

echo "========================================================="
echo "                 PLATYPUS REAL CHECKOUT TEST"
echo "========================================================="

echo ""
echo "1. Checkout Session erzeugen..."

RESPONSE=$(curl -s -X POST "$BASE_URL/api/payments/create-checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod":"card",
    "reference":"REAL-CHECKOUT-TEST",
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

REDIRECT_URL=$(echo "$RESPONSE" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("redirectUrl",""))')

echo ""
echo "2. Redirect URL:"
echo "$REDIRECT_URL"

if [[ "$REDIRECT_URL" == https://checkout.stripe.com/* ]]; then
  echo ""
  echo "✅ Echte Stripe Checkout URL erzeugt"
  echo "🌍 Öffne Checkout im Browser..."
  xdg-open "$REDIRECT_URL"
else
  echo ""
  echo "❌ Keine echte Stripe Checkout URL"
  exit 1
fi

echo ""
echo "========================================================="
echo " REAL CHECKOUT TEST READY"
echo "========================================================="
