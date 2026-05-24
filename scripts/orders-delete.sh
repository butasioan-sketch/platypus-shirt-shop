#!/bin/bash
set -e
DB_FILE="orders.db"

if [ -z "$1" ]; then
    echo "Usage: $0 <order_id>"
    exit 1
fi

ID="$1"

echo "Order #$ID wird gelöscht..."
sqlite3 "$DB_FILE" "DELETE FROM orders WHERE id = $ID;"

echo "✅ Order #$ID wurde gelöscht."
