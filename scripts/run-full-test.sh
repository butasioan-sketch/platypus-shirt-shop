#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "           PLATYPUS - FULL TEST FLOW"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "1. Projekt Health Check..."
./scripts/project-health.sh

echo ""
echo "2. Simuliere erfolgreiche Zahlung..."
./scripts/simulate-successful-payment.sh

echo ""
echo "3. Aktueller Order Status..."
./scripts/dashboard.sh

echo ""
echo "✅ Full Test Flow abgeschlossen"
echo "════════════════════════════════════════════════════════════"
