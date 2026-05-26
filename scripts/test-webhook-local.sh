#!/bin/bash

echo "=== Lokaler Webhook Test ==="
echo ""
echo "Voraussetzungen:"
echo "1. Dev Server läuft (./scripts/p start)"
echo "2. Stripe CLI installiert (optional aber empfohlen)"
echo ""
echo "Mit Stripe CLI testen:"
echo "  stripe listen --forward-to localhost:3000/api/webhooks/stripe"
echo ""
echo "Oder manuell simulieren:"
echo "  ./scripts/simulate-successful-payment.sh"
echo ""
echo "Aktueller Status:"
./scripts/webhook-status.sh
