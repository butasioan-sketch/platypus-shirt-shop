#!/bin/bash

set -e

BASE_URL="https://platypus-shirt-shop.vercel.app"

echo "========================================="
echo " PLATYPUS LIVE LAUNCH CHECK"
echo "========================================="

echo ""
echo "1. Homepage"
curl -I "$BASE_URL"

echo ""
echo "2. Product Pages"
curl -I "$BASE_URL/product/1"
curl -I "$BASE_URL/product/2"

echo ""
echo "3. Cart"
curl -I "$BASE_URL/cart"

echo ""
echo "4. Admin"
curl -I "$BASE_URL/admin"

echo ""
echo "5. Newsletter"
curl -I "$BASE_URL/admin/newsletter"

echo ""
echo "6. Versand"
curl -I "$BASE_URL/versand"

echo ""
echo "7. Datenschutz"
curl -I "$BASE_URL/datenschutz"

echo ""
echo "8. Impressum"
curl -I "$BASE_URL/impressum"

echo ""
echo "9. AGB"
curl -I "$BASE_URL/agb"

echo ""
echo "10. Payment API"
curl -X POST "$BASE_URL/api/payments/create-checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod":"card",
    "reference":"LIVE-LAUNCH-CHECK",
    "shipping":4.99,
    "total":34.98,
    "items":[
      {
        "name":"Essential Shirt White",
        "size":"M",
        "price":29.99,
        "quantity":1
      }
    ]
  }'

echo ""
echo ""
echo "========================================="
echo " LIVE CHECK COMPLETE"
echo "========================================="
