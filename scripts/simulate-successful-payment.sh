#!/bin/bash

echo "=== Simuliere erfolgreiche Stripe Zahlung ==="
echo ""

read -p "Kunden Email: " email
read -p "Betrag in Cent (z.B. 5990 für 59,90€): " amount

if [ -z "$email" ] || [ -z "$amount" ]; then
    echo "Email und Betrag sind erforderlich."
    exit 1
fi

./scripts/create-order-from-payment.sh "$email" "$amount" "EUR"

echo ""
echo "✅ Simulation abgeschlossen. Order wurde als 'paid' angelegt."
