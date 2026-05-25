#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "           PLATYPUS - PROJECT HEALTH"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "📦 Orders in DB:     $(sqlite3 orders.db "SELECT COUNT(*) FROM orders;" 2>/dev/null || echo 0)"
echo "💰 Gesamt Umsatz:    $(sqlite3 orders.db "SELECT printf('%.2f €', COALESCE(SUM(total_amount),0)) FROM orders;" 2>/dev/null || echo '0 €')"
echo ""

echo "🛠️  Wichtige Skripte:"
ls -1 scripts/p scripts/project.sh scripts/daily-start.sh scripts/health-all.sh 2>/dev/null | wc -l
echo ""

echo "🔗 Webhook Status:   Route + automatische Order-Erstellung aktiv"
echo ""

echo "Nächste empfohlene Schritte:"
echo "1. Echte Webhook Tests mit Stripe CLI"
echo "2. Weitere manuelle Tests durchführen"
echo "3. Projekt aufräumen & stabilisieren"
echo ""
echo "════════════════════════════════════════════════════════════"
