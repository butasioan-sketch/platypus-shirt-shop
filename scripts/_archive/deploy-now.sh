#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "           PLATYPUS Deploy"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "📦 Änderungen committen..."
git add .
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" || echo "Nichts Neues"

echo ""
echo "🚀 Vercel Deploy startet..."
vercel --prod

echo ""
echo "✅ Deploy abgeschlossen"
echo "════════════════════════════════════════════════════════════"
