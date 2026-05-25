#!/bin/bash

echo "=== Simuliere erfolgreichen Webhook (Payment) ==="
echo ""

read -p "Kunden Email: " email
read -p "Betrag in Cent (z.B. 5990): " amount
read -p "Währung (EUR): " currency

if [ -z "$currency" ]; then
    currency="EUR"
fi

SESSION_ID="sim_$(date +%s)"

./scripts/insert-order-from-webhook.sh "$email" "$amount" "$currency" "$SESSION_ID"

echo ""
echo "✅ Webhook Simulation abgeschlossen"
echo "Order wurde als 'paid' in orders.db angelegt."
