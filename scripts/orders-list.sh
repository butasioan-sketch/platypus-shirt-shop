#!/bin/bash
DB_FILE="orders.db"

echo "════════════════════════════════════════════════════════════"
echo "                    PLATYPUS ORDERS"
echo "════════════════════════════════════════════════════════════"
echo ""

sqlite3 -header -column "$DB_FILE" "
SELECT 
    id,
    order_number,
    customer_name,
    printf('%.2f', total_amount) || ' ' || currency as Betrag,
    UPPER(status) as Status,
    created_at
FROM orders 
ORDER BY id DESC 
LIMIT 30;
"

echo ""
echo "Anzahl Orders: $(sqlite3 $DB_FILE "SELECT COUNT(*) FROM orders;")"
