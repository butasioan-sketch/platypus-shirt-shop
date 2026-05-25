#!/bin/bash

echo "=== PLATYPUS Test Flow ==="
echo ""

./scripts/quick-order.sh "Test Flow" "flow@test.de" 69.90 "PLATYPUS Shirt + Sticker"
echo ""
echo "Warte 1 Sekunde..."
sleep 1

echo "Markiere letzte Order als bezahlt..."
./scripts/quick-paid.sh
