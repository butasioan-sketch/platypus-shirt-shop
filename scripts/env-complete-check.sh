#!/bin/bash
cd ~/Schreibtisch/platypus-shirt-shop

echo "=========================================="
echo "   PLATYPUS Environment Complete Check"
echo "=========================================="

[ -f ".env.local" ] && echo "✅ .env.local vorhanden" || echo "❌ .env.local fehlt"
[ -f "proxy.ts" ] && echo "✅ proxy.ts vorhanden" || echo "❌ proxy.ts fehlt"
[ -f "app/lib/products.ts" ] && echo "✅ app/lib/products.ts vorhanden" || echo "❌ app/lib/products.ts fehlt"
[ -f "app/api/webhooks/stripe/route.ts" ] && echo "✅ Stripe Webhook Route vorhanden" || echo "❌ Stripe Webhook Route fehlt"

if [ -f ".env.local" ]; then
  grep -q "ADMIN_PASSWORD" .env.local && echo "✅ ADMIN_PASSWORD gesetzt" || echo "❌ ADMIN_PASSWORD fehlt"
  grep -q "STRIPE_SECRET_KEY" .env.local && echo "✅ STRIPE_SECRET_KEY gesetzt" || echo "❌ STRIPE_SECRET_KEY fehlt"
  grep -q "STRIPE_WEBHOOK_SECRET" .env.local && echo "✅ STRIPE_WEBHOOK_SECRET gesetzt" || echo "❌ STRIPE_WEBHOOK_SECRET fehlt"
  grep -q "NEXT_PUBLIC_SITE_URL" .env.local && echo "✅ NEXT_PUBLIC_SITE_URL gesetzt" || echo "❌ NEXT_PUBLIC_SITE_URL fehlt"
fi
echo "=========================================="
