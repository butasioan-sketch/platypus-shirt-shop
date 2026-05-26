#!/bin/bash

echo "=== PLATYPUS Schnell-Deploy (Vercel CLI) ==="
echo ""

echo "1. Lokale Änderungen committen..."
git add .
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" || echo "Nichts Neues zu committen"

echo ""
echo "2. Auf Vercel deployen..."
vercel --prod

echo ""
echo "✅ Deploy abgeschlossen!"
echo "   Die App auf dem Handy sollte in 30–90 Sekunden aktualisiert sein."
