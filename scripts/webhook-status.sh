#!/bin/bash

echo "=== Stripe Webhook Status ==="
echo ""
echo "✅ Ordner: app/api/webhooks/stripe/"
echo "✅ Route:  app/api/webhooks/stripe/route.ts"
echo "✅ Helper: scripts/insert-order-from-webhook.sh"
echo "✅ Simulation: scripts/simulate-webhook-payment.sh"
echo ""
echo "Nächster logischer Schritt:"
echo "→ Webhook Route erweitern, damit sie bei erfolgreicher Zahlung"
echo "   automatisch eine Order in orders.db anlegt."
echo ""
echo "Aktuell: Daten werden geloggt + manuelle Simulation möglich."
