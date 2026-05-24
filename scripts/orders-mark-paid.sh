#!/bin/bash
set -e
DB_FILE="orders.db"

if [ -z "$1" ]; then
    # Wenn keine ID angegeben → letzte Order nehmen
    ORDER_ID=$(sqlite3 "$DB_FILE" "SELECT id FROM orders ORDER BY id DESC LIMIT 1;")
else
    ORDER_ID="$1"
fi

sqlite3 "$DB_FILE" "UPDATE orders SET status='paid', updated_at=CURRENT_TIMESTAMP WHERE id=$ORDER_ID;"
echo "✅ Order #$ORDER_ID wurde auf PAID gesetzt."
