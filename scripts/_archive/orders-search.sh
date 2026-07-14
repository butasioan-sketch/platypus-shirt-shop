#!/bin/bash
DB_FILE="orders.db"

if [ -z "$1" ]; then
    echo "Usage: $0 <suchbegriff>"
    echo "Beispiel: $0 Max   oder   $0 @test.de"
    exit 1
fi

SEARCH="$1"

echo "=== Suchergebnisse für: $SEARCH ==="
sqlite3 -header -column "$DB_FILE" "
SELECT id, order_number, customer_name, customer_email, printf('%.2f €', total_amount) as Betrag, status
FROM orders 
WHERE customer_name LIKE '%$SEARCH%' OR customer_email LIKE '%$SEARCH%'
ORDER BY id DESC;
"
