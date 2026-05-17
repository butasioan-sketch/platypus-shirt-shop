#!/bin/bash

set -e

BASE_URL="https://platypus-shirt-shop.vercel.app"

echo "========================================================="
echo "              OPEN REAL STRIPE CHECKOUT"
echo "========================================================="

RESPONSE=$(curl -s -X POST "$BASE_URL/api/payments/create-checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod":"card",
    "reference":"OPEN-REAL-STRIPE-CHECKOUT",
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

URL=$(echo "$RESPONSE" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("redirectUrl",""))')

echo "$URL"

if [[ "$URL" == https://checkout.stripe.com/* ]]; then
  xdg-open "$URL"
else
  echo "❌ Keine echte Stripe Checkout URL"
  echo "$RESPONSE"
  exit 1
fi
