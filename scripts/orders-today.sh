#!/bin/bash
DB_FILE="orders.db"
TODAY=$(date +%Y-%m-%d)

echo "=== UMSATZ HEUTE ($TODAY) ==="

sqlite3 "$DB_FILE" <<SQL
SELECT 
    'Gesamt Umsatz heute: ' || printf('%.2f €', COALESCE(SUM(total_amount), 0)),
    'Anzahl Bestellungen: ' || COUNT(*),
    'Bezahlt heute: ' || printf('%.2f €', COALESCE(SUM(CASE WHEN status IN ('paid','processing','shipped','completed') THEN total_amount ELSE 0 END), 0))
FROM orders 
WHERE date(created_at) = '$TODAY';
SQL
