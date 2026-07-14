#!/bin/bash

set -e

BASE_URL="https://platypus-shirt-shop.vercel.app"

echo "========================================================="
echo "                 PLATYPUS STRIPE TEST CHECK"
echo "========================================================="

echo ""
echo "1. Build"
npm run build

echo ""
echo "2. GET API Status"
curl -i "$BASE_URL/api/payments/create-checkout"

echo ""
echo "3. POST Payment API Test"

curl -i -X POST "$BASE_URL/api/payments/create-checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod":"card",
    "reference":"STRIPE-TEST-CHECK",
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
  }'

echo ""
echo "========================================================="
echo " STRIPE TEST CHECK COMPLETE"
echo "========================================================="
