#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "           PLATYPUS - STATUS"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "Orders:     $(sqlite3 orders.db "SELECT COUNT(*) FROM orders;" 2>/dev/null || echo 0)"
echo "Umsatz:     $(sqlite3 orders.db "SELECT printf('%.2f €', COALESCE(SUM(total_amount),0)) FROM orders;" 2>/dev/null || echo '0 €')"
echo ""

echo "Wichtige Befehle:"
echo "  ./scripts/p health     → Full Health Check"
echo "  ./scripts/p orders     → Order Menu"
echo "  ./scripts/p start      → Dev Server starten"
echo "  ./scripts/p save       → Commit + Push"
echo ""

echo "════════════════════════════════════════════════════════════"
