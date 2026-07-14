#!/bin/bash
DB_FILE="orders.db"

echo "══════════════════════════════════════════════"
echo "           PLATYPUS DASHBOARD"
echo "══════════════════════════════════════════════"
echo ""

echo "📦 Orders gesamt:     $(sqlite3 $DB_FILE "SELECT COUNT(*) FROM orders;")"
echo "⏳ Pending:           $(sqlite3 $DB_FILE "SELECT COUNT(*) FROM orders WHERE status='pending';")"
echo "✅ Paid:              $(sqlite3 $DB_FILE "SELECT COUNT(*) FROM orders WHERE status='paid';")"
echo ""

echo "💰 Gesamt Umsatz:     $(sqlite3 $DB_FILE "SELECT printf('%.2f €', COALESCE(SUM(total_amount),0)) FROM orders;")"
echo ""

echo "🕒 Letzte 3 Orders:"
sqlite3 -header -column "$DB_FILE" "
SELECT id, order_number, customer_name, printf('%.2f €', total_amount) as Betrag, status
FROM orders ORDER BY id DESC LIMIT 3;
"

echo ""
echo "══════════════════════════════════════════════"
