#!/bin/bash
################################################################################
# PLATYPUS - Orders Helper (für aktuelles LocalStorage System)
################################################################################
set -euo pipefail

echo "=========================================="
echo "   PLATYPUS Orders Helper"
echo "=========================================="
echo ""
echo "Aktuell werden Orders nur im Browser (LocalStorage) gespeichert."
echo ""
echo "Mögliche Aktionen:"
echo ""
echo "1. Orders manuell zurücksetzen (im Browser)"
echo "   → Im Admin unter /admin/orders → 'Data Reset Panel' nutzen"
echo ""
echo "2. Orders exportieren"
echo "   → Im Admin → 'Order Export' Button"
echo ""
echo "3. Testbestellung simulieren"
echo "   → Über Stripe Test Checkout laufen lassen"
echo ""
echo "=========================================="
echo " Empfehlung: Später auf echte Datenbank (Supabase/Prisma) umstellen"
echo "=========================================="
