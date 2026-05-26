#!/bin/bash
echo "════════════════════════════════════════════════════════════"
echo " PLATYPUS Deploy (mit Logs)"
echo "════════════════════════════════════════════════════════════"

git add .
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" || echo "Keine neuen Änderungen"

echo ""
echo "Starte Deploy mit detaillierten Logs..."
vercel --prod

echo ""
echo "✅ Deploy beendet"
echo "════════════════════════════════════════════════════════════"
