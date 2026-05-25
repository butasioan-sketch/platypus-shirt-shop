#!/bin/bash
DB_FILE="orders.db"

LATEST_ID=$(sqlite3 "$DB_FILE" "SELECT id FROM orders ORDER BY id DESC LIMIT 1;")

if [ -z "$LATEST_ID" ]; then
    echo "Keine Orders vorhanden."
    exit 1
fi

./scripts/orders-update-status.sh "$LATEST_ID" paid
./scripts/orders-show.sh "$LATEST_ID"
