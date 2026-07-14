#!/bin/bash
DB_FILE="orders.db"
OUTPUT="orders_export_$(date +%Y%m%d_%H%M%S).csv"

echo "Exportiere nach: $OUTPUT"

sqlite3 -header -csv "$DB_FILE" "
SELECT 
    id,
    order_number,
    customer_name,
    customer_email,
    total_amount,
    currency,
    status,
    created_at
FROM orders
ORDER BY id DESC;
" > "$OUTPUT"

echo "✅ Export fertig: $OUTPUT"
echo "Anzahl exportierter Orders: $(wc -l < $OUTPUT)"
