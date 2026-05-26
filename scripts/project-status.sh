#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "           PLATYPUS - PROJECT STATUS"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "📦 Bash Tooling"
./scripts/p health 2>/dev/null | head -8

echo ""
echo "🛍️  Frontend"
echo "  Viewer:       app/components/Viewer/Viewer.tsx"
echo "  Product:      app/product/[id]/page.tsx"
echo "  Cart:         app/cart/page.tsx"
echo "  Navigation:   app/layout.tsx"

echo ""
echo "📁 Wichtige Dateien"
ls -1 app/components/Viewer/*.tsx 2>/dev/null | wc -l | xargs echo "  Viewer Components:"
echo "  Product Page:     $([ -f app/product/\[id\]/page.tsx ] && echo '✅' || echo '❌')"
echo "  Cart Page:        $([ -f app/cart/page.tsx ] && echo '✅' || echo '❌')"

echo ""
echo "════════════════════════════════════════════════════════════"
