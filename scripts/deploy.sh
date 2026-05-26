#!/bin/bash

echo "=== PLATYPUS Deploy ==="
echo ""

echo "1. Git Status checken..."
git status --short

echo ""
echo "2. Alles committen..."
git add .
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" || echo "Nichts Neues zu committen"

echo ""
echo "3. Pushen..."
git push

echo ""
echo "✅ Fertig. Vercel sollte jetzt automatisch deployen."
echo "   Warte 30–60 Sekunden und lade die Seite neu."
