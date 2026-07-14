#!/bin/bash
DB_FILE="orders.db"

echo "=== LETZTE 10 ORDERS ==="
sqlite3 -header -column "$DB_FILE" "
SELECT id, order_number, customer_name, printf('%.2f €', total_amount) as Betrag, status, created_at
FROM orders 
ORDER BY id DESC 
LIMIT 10;
"
