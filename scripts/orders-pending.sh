#!/bin/bash
DB_FILE="orders.db"

echo "=== OFFENE ORDERS (pending) ==="
echo ""

sqlite3 -header -column "$DB_FILE" "
SELECT id, order_number, customer_name, printf('%.2f', total_amount) || ' €' as Betrag, created_at
FROM orders 
WHERE status = 'pending'
ORDER BY id DESC;
"

echo ""
echo "Anzahl pending: $(sqlite3 $DB_FILE "SELECT COUNT(*) FROM orders WHERE status='pending';")"
