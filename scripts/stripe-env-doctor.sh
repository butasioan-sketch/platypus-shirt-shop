#!/bin/bash

set -e

echo "========================================================="
echo "                 STRIPE ENV DOCTOR"
echo "========================================================="

echo ""
echo "1. Lokale ENV Prüfung"

if [ -f ".env.local" ]; then
  echo "✅ .env.local vorhanden"
else
  echo "⚠️ .env.local fehlt"
fi

echo ""
echo "2. STRIPE_SECRET_KEY Format lokal"

LOCAL_KEY=$(grep "^STRIPE_SECRET_KEY=" .env.local 2>/dev/null | cut -d "=" -f2- || true)

if [[ "$LOCAL_KEY" == sk_test_* || "$LOCAL_KEY" == sk_live_* ]]; then
  echo "✅ Lokaler STRIPE_SECRET_KEY Format korrekt"
else
  echo "⚠️ Lokaler STRIPE_SECRET_KEY fehlt oder falsch"
  echo "Er muss mit sk_test_ oder sk_live_ beginnen"
fi

echo ""
echo "3. NEXT_PUBLIC_SITE_URL lokal"

LOCAL_SITE=$(grep "^NEXT_PUBLIC_SITE_URL=" .env.local 2>/dev/null | cut -d "=" -f2- || true)

if [[ "$LOCAL_SITE" == http* ]]; then
  echo "✅ NEXT_PUBLIC_SITE_URL gesetzt: $LOCAL_SITE"
else
  echo "⚠️ NEXT_PUBLIC_SITE_URL fehlt oder falsch"
fi

echo ""
echo "4. Live API Status"

curl -s https://platypus-shirt-shop.vercel.app/api/payments/create-checkout
echo ""

echo ""
echo "========================================================="
echo " STRIPE ENV DOCTOR COMPLETE"
echo "========================================================="
