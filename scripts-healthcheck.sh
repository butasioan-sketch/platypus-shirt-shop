#!/bin/bash

set -e

BASE_URL="https://platypus-shirt-shop.vercel.app"

echo "🔍 PLATYPUS Healthcheck startet..."
echo "URL: $BASE_URL"
echo ""

echo "1/6 Build prüfen..."
npm run build

echo ""
echo "2/6 Live-Routen prüfen..."

ROUTES=(
  "/"
  "/admin"
  "/admin/inventory"
  "/admin/newsletter"
  "/admin/tests"
  "/cart"
  "/versand"
  "/impressum"
  "/datenschutz"
  "/agb"
  "/product/1"
  "/product/2"
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
echo "3/6 Payment API prüfen..."

PAYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/payments/create-checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod":"card",
    "reference":"HEALTHCHECK-001",
    "shipping":3.99,
    "total":33.98,
    "items":[
      {
        "name":"Essential Shirt Weiß",
        "size":"M",
        "price":29.99,
        "quantity":1
      }
    ]
  }')

echo "$PAYMENT_RESPONSE"

if echo "$PAYMENT_RESPONSE" | grep -q "provider"; then
  echo "✅ Payment API antwortet"
else
  echo "❌ Payment API Problem"
  exit 1
fi

echo ""
echo "4/6 Wichtige Dateien prüfen..."

FILES=(
  "app/page.tsx"
  "app/admin/page.tsx"
  "components/ProductCard.tsx"
  "components/Checkout.tsx"
  "components/Shirt360.tsx"
  "components/PaymentMethods.tsx"
  "components/ShippingOptions.tsx"
  "store/cart.ts"
  "store/orders.ts"
  "store/inventory.ts"
  "store/tests.ts"
  "data/products.ts"
  "data/payments.ts"
  "data/shipping.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ fehlt: $file"
    exit 1
  fi
done

echo ""
echo "5/6 Buttons und Links grob prüfen..."

grep -R "In den Warenkorb" components app >/dev/null && echo "✅ Warenkorb Button gefunden" || echo "❌ Warenkorb Button fehlt"
grep -R "Checkout" components app >/dev/null && echo "✅ Checkout gefunden" || echo "❌ Checkout fehlt"
grep -R "Versand" components app >/dev/null && echo "✅ Versand gefunden" || echo "❌ Versand fehlt"
grep -R "Zahlungsmethode" components app >/dev/null && echo "✅ Zahlungsmethoden gefunden" || echo "❌ Zahlungsmethoden fehlen"
grep -R "Produktionsschein" components app >/dev/null && echo "✅ Produktionsschein gefunden" || echo "❌ Produktionsschein fehlt"
grep -R "Newsletter" components app >/dev/null && echo "✅ Newsletter gefunden" || echo "❌ Newsletter fehlt"
grep -R "360" components app >/dev/null && echo "✅ 360 Viewer gefunden" || echo "❌ 360 Viewer fehlt"

echo ""
echo "6/6 Git Status prüfen..."
git status

echo ""
echo "✅ HEALTHCHECK FERTIG"
echo "✅ Shop-Infrastruktur wirkt stabil"
