#!/bin/bash
echo "════════════════════════════════════════════════════════════"
echo " PLATYPUS Deploy"
echo "════════════════════════════════════════════════════════════"

git add .
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" || echo "Keine neuen Änderungen"

echo ""
vercel --prod

echo ""
echo "✅ Deploy abgeschlossen"
echo "════════════════════════════════════════════════════════════"
