#!/bin/bash

set -e

BASE_URL="${NEXT_PUBLIC_SITE_URL:-https://platypus-shirt-shop.vercel.app}"
DESIGN_ID="${1:-DSGN-1784029264490-Q1Z80}"

echo "========================================================="
echo "              OPEN REAL STRIPE CHECKOUT"
echo "========================================================="

RESPONSE=$(curl -s -X POST "$BASE_URL/api/payments/create-checkout" \
  -H "Content-Type: application/json" \
  -d "{
    \"paymentMethod\":\"card\",
    \"reference\":\"OPEN-REAL-STRIPE-CHECKOUT\",
    \"country\":\"DE\",
    \"items\":[
      {
        \"name\":\"AirFit Pro\",
        \"size\":\"M\",
        \"color\":\"Weiß\",
        \"quantity\":1,
        \"designId\":\"$DESIGN_ID\"
      }
    ]
  }")

URL=$(echo "$RESPONSE" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("redirectUrl",""))')

echo "$URL"

if [[ "$URL" == https://checkout.stripe.com/* ]]; then
  xdg-open "$URL" 2>/dev/null || echo "Öffne URL manuell im Browser"
else
  echo "❌ Keine echte Stripe Checkout URL"
  echo "$RESPONSE"
  exit 1
fi