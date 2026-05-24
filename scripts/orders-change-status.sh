#!/bin/bash
set -e
DB_FILE="orders.db"

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <order_id> <new_status>"
    echo "Mögliche Status: pending | paid | processing | shipped | completed | cancelled"
    exit 1
fi

ID="$1"
STATUS="$2"

sqlite3 "$DB_FILE" "
UPDATE orders 
SET status='$STATUS', updated_at=CURRENT_TIMESTAMP 
WHERE id=$ID;
"

echo "✅ Order #$ID → Status geändert zu: $STATUS"
