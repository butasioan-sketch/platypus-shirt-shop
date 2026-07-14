#!/bin/bash
set -e

echo "════════════════════════════════════════════════════════════"
echo " PLATYPUS Deploy"
echo "════════════════════════════════════════════════════════════"

echo ""
echo "📦 Änderungen committen..."
git add .

if git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')"; then
    echo "✅ Commit erstellt"
else
    echo "ℹ️  Keine neuen Änderungen zum Committen"
fi

echo ""
echo "🚀 Deploy auf Vercel..."
if vercel --prod; then
    echo ""
    echo "✅ Deploy erfolgreich abgeschlossen"
else
    echo ""
    echo "❌ Deploy fehlgeschlagen"
    exit 1
fi

echo "════════════════════════════════════════════════════════════"
