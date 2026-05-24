#!/bin/bash
echo "=========================================="
echo " PLATYPUS ORDERS DOCTOR"
echo "=========================================="
echo ""

echo "1. Prüfe ob sqlite3 installiert ist:"
if command -v sqlite3 &> /dev/null; then
    echo "   ✅ sqlite3 ist installiert: $(sqlite3 --version)"
else
    echo "   ❌ sqlite3 ist NICHT installiert!"
    echo "   Bitte ausführen: sudo apt install -y sqlite3"
    exit 1
fi

echo ""
echo "2. Aktuelles Verzeichnis:"
pwd

echo ""
echo "3. Existiert orders.db?"
if [ -f orders.db ]; then
    echo "   ✅ orders.db existiert"
    echo "   Größe: $(ls -lh orders.db | awk '{print $5}')"
else
    echo "   ❌ orders.db existiert NICHT"
fi

echo ""
echo "4. Letzte 5 Zeilen von orders.db (falls vorhanden):"
if [ -f orders.db ]; then
    sqlite3 orders.db "SELECT id, order_number, status, created_at FROM orders ORDER BY id DESC LIMIT 5;" 2>/dev/null || echo "   (Tabelle noch leer oder Fehler)"
fi

echo ""
echo "5. Prüfe die Skripte:"
for script in orders-db-init.sh orders-add.sh orders-list.sh orders-update-status.sh; do
    if [ -f scripts/$script ]; then
        echo "   ✅ scripts/$script existiert"
    else
        echo "   ❌ scripts/$script fehlt"
    fi
done

echo ""
echo "=========================================="
echo " DIAGNOSE ENDE"
echo "=========================================="
