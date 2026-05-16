#!/bin/bash

set -e

echo "========================================================="
echo "                    PLATYPUS SHOP DOCTOR"
echo "========================================================="

ERRORS=0

check_file() {
  if [ -f "$1" ]; then
    echo "✅ $1"
  else
    echo "❌ FEHLT: $1"
    ERRORS=$((ERRORS+1))
  fi
}

echo ""
echo "1. Core Files"
check_file "app/page.tsx"
check_file "app/layout.tsx"
check_file "components/HeroSection.tsx"
check_file "components/ProductCard.tsx"
check_file "components/Shirt360.tsx"
check_file "components/Checkout.tsx"
check_file "components/BrandLogo.tsx"
check_file "public/brand/logo.jpeg"

echo ""
echo "2. Data Files"
check_file "data/products.ts"
check_file "data/payments.ts"
check_file "data/shipping.ts"

echo ""
echo "3. Stores"
check_file "store/cart.ts"
check_file "store/orders.ts"
check_file "store/inventory.ts"
check_file "store/tests.ts"

echo ""
echo "4. Scripts"
check_file "scripts-deploy.sh"
check_file "scripts-healthcheck.sh"
check_file "scripts/system-check.sh"
check_file "scripts/backup-project.sh"
check_file "scripts/ecosystem-report.sh"

echo ""
echo "5. Build"
npm run build

echo ""
echo "6. Git"
git status

echo ""
if [ "$ERRORS" -eq 0 ]; then
  echo "✅ SHOP DOCTOR: SYSTEM OK"
else
  echo "❌ SHOP DOCTOR: $ERRORS PROBLEME GEFUNDEN"
  exit 1
fi
