#!/bin/bash
DB_FILE="orders.db"

if [ -z "$1" ]; then
    echo "Usage: $0 <order_id>"
    exit 1
fi

ID="$1"

echo "════════════════════════════════════════════════════════════"
sqlite3 "$DB_FILE" "
SELECT 
    'Order ID     : ' || id,
    'Order Number : ' || order_number,
    'Kunde        : ' || customer_name,
    'Email        : ' || customer_email,
    'Betrag       : ' || printf('%.2f', total_amount) || ' ' || currency,
    'Status       : ' || UPPER(status),
    'Erstellt     : ' || created_at,
    'Aktualisiert : ' || updated_at,
    'Items        : ' || items
FROM orders 
WHERE id = $ID;
"
echo "════════════════════════════════════════════════════════════"
