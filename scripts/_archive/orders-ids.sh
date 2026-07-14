#!/bin/bash
DB_FILE="orders.db"
echo "Verfügbare Order IDs:"
sqlite3 "$DB_FILE" "SELECT id || ' → ' || order_number || ' (' || status || ')' FROM orders ORDER BY id DESC;"
