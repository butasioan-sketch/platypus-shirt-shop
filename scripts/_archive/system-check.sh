#!/bin/bash

set -e

echo "============================================"
echo " PLATYPUS SYSTEM CHECK"
echo "============================================"

echo ""
echo "1. Projektpfad"
pwd

echo ""
echo "2. Git Status"
git status

echo ""
echo "3. Node Version"
node -v

echo ""
echo "4. NPM Version"
npm -v

echo ""
echo "5. Build"
npm run build

echo ""
echo "6. Wichtige Dateien"
test -f package.json && echo "✅ package.json"
test -f app/page.tsx && echo "✅ app/page.tsx"
test -f components/Shirt360.tsx && echo "✅ Shirt360.tsx"
test -f components/Checkout.tsx && echo "✅ Checkout.tsx"
test -f app/admin/page.tsx && echo "✅ admin page"
test -f scripts-deploy.sh && echo "✅ deploy script"

echo ""
echo "7. Live URL"
echo "https://platypus-shirt-shop.vercel.app"

echo ""
echo "✅ SYSTEM CHECK FERTIG"
