#!/bin/bash
# PLATYPUS - Stripe Webhook Setup Helper
set -euo pipefail

echo "=========================================="
echo "   Stripe Webhook Setup für PLATYPUS"
echo "=========================================="
echo ""

echo "1. Webhook Secret in .env.local setzen:"
echo ""
echo "   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx"
echo ""
echo "2. In Vercel setzen:"
echo "   npx vercel env add STRIPE_WEBHOOK_SECRET"
echo ""
echo "3. Webhook-URL im Stripe Dashboard eintragen:"
echo "   https://platypus-shirt-shop.vercel.app/api/webhooks/stripe"
echo ""
echo "4. Nach Deploy testen:"
echo "   ./modules/webhook-test.sh"
echo ""
echo "=========================================="
