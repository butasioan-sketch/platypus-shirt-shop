#!/bin/bash
DB_FILE="orders.db"
OUTPUT="orders_$(date +%Y%m%d_%H%M%S).json"

sqlite3 "$DB_FILE" -json "
SELECT * FROM orders ORDER BY id DESC
" > "$OUTPUT"

echo "✅ JSON Export: $OUTPUT"
echo "Anzahl Orders: $(jq length $OUTPUT 2>/dev/null || echo 'jq nicht installiert')"
