#!/bin/bash
set -e
DB_FILE="orders.db"

echo "=== Simuliere Stripe Webhook (Payment Succeeded) ==="

read -p "Kundenname: " name
read -p "Email: " email
read -p "Betrag: " amount
read -p "Items: " items

ORDERNUM="ORD-$(date +%Y%m%d%H%M%S)"

sqlite3 "$DB_FILE" "
INSERT INTO orders (order_number, customer_name, customer_email, items, total_amount, status)
VALUES ('$ORDERNUM', '$name', '$email', '$items', $amount, 'paid');
"

echo ""
echo "✅ Webhook simuliert → Order $ORDERNUM wurde als 'paid' angelegt."
echo "Das ist später die Basis für den echten Stripe Webhook."
