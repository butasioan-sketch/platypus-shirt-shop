#!/bin/bash

echo "=== Stripe Webhook Helper ==="
echo ""
echo "1. Stelle sicher, dass STRIPE_WEBHOOK_SECRET in .env.local steht"
echo "2. Für lokale Tests Stripe CLI nutzen:"
echo "   stripe listen --forward-to localhost:3000/api/webhooks/stripe"
echo ""
echo "3. Aktuelle Webhook Route: app/api/webhooks/stripe/route.ts"
echo ""
echo "Nächster Schritt: Order-Erstellung nach erfolgreicher Zahlung implementieren"
