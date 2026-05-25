#!/bin/bash

clear
echo "════════════════════════════════════════════════════════════"
echo "           PLATYPUS - DEV START"
echo "════════════════════════════════════════════════════════════"
echo ""

./scripts/health-all.sh

echo ""
echo "Starte Dev Server in 3 Sekunden..."
sleep 3

npm run dev
