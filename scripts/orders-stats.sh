#!/bin/bash
DB_FILE="orders.db"

echo "=== PLATYPUS Order Statistik ==="
echo ""
echo "Gesamt Orders:     $(sqlite3 $DB_FILE "SELECT COUNT(*) FROM orders;")"
echo "Pending:           $(sqlite3 $DB_FILE "SELECT COUNT(*) FROM orders WHERE status='pending';")"
echo "Paid:              $(sqlite3 $DB_FILE "SELECT COUNT(*) FROM orders WHERE status='paid';")"
echo "Processing:        $(sqlite3 $DB_FILE "SELECT COUNT(*) FROM orders WHERE status='processing';")"
echo "Shipped:           $(sqlite3 $DB_FILE "SELECT COUNT(*) FROM orders WHERE status='shipped';")"
echo ""
echo "Gesamt Umsatz:     $(sqlite3 $DB_FILE "SELECT printf('%.2f', SUM(total_amount)) FROM orders WHERE status IN ('paid','processing','shipped','completed');") €"
