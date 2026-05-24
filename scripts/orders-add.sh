#!/bin/bash
set -e
DB_FILE="orders.db"

if [ "$#" -lt 4 ]; then
    echo "Usage: $0 <Name> <Email> <Betrag> <Items>"
    echo "Beispiel: $0 \"Max\" max@test.de 59.90 \"PLATYPUS Shirt L\""
    exit 1
fi

NAME="$1"
EMAIL="$2"
BETRAG="$3"
ITEMS="$4"
ORDERNUM="ORD-$(date +%Y%m%d%H%M%S)"

sqlite3 "$DB_FILE" "INSERT INTO orders 
(order_number, customer_name, customer_email, items, total_amount, status)
VALUES ('$ORDERNUM', '$NAME', '$EMAIL', '$ITEMS', $BETRAG, 'pending');"

echo "✅ Order $ORDERNUM angelegt"
