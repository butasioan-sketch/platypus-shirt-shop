#!/bin/bash
DB_FILE="orders.db"

if [ -z "$1" ]; then
    echo "Usage: $0 <status>"
    echo "Beispiel: $0 paid   oder   $0 pending"
    exit 1
fi

STATUS="$1"

echo "=== Orders mit Status: $STATUS ==="
sqlite3 -header -column "$DB_FILE" "
SELECT id, order_number, customer_name, printf('%.2f €', total_amount) as Betrag, created_at
FROM orders 
WHERE status = '$STATUS'
ORDER BY id DESC;
"

echo ""
echo "Anzahl: $(sqlite3 $DB_FILE "SELECT COUNT(*) FROM orders WHERE status='$STATUS';")"
