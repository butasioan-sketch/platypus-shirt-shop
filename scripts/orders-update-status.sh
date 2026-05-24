#!/bin/bash
set -e
DB_FILE="orders.db"

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <order_id> <new_status>"
    echo "Mögliche Status: pending | paid | processing | shipped | completed | cancelled"
    exit 1
fi

ORDER_ID="$1"
NEW_STATUS="$2"

sqlite3 "$DB_FILE" "UPDATE orders SET status='$NEW_STATUS', updated_at=CURRENT_TIMESTAMP WHERE id=$ORDER_ID;"

echo "✅ Order #$ORDER_ID wurde auf Status '$NEW_STATUS' gesetzt."
