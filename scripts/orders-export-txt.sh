#!/bin/bash
DB_FILE="orders.db"
OUTPUT="orders_export_$(date +%Y%m%d_%H%M%S).txt"

{
echo "PLATYPUS Orders Export - $(date)"
echo "========================================"
echo ""
sqlite3 "$DB_FILE" "
SELECT 
    'Order: ' || order_number,
    'Kunde: ' || customer_name || ' (' || customer_email || ')',
    'Betrag: ' || printf('%.2f €', total_amount),
    'Status: ' || UPPER(status),
    'Items: ' || items,
    'Erstellt: ' || created_at,
    '---'
FROM orders 
ORDER BY id DESC;
"
} > "$OUTPUT"

echo "✅ Exportiert nach: $OUTPUT"
echo "Anzahl Orders: $(sqlite3 $DB_FILE 'SELECT COUNT(*) FROM orders;')"
