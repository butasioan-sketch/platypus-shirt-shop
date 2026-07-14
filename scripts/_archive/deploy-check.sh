#!/bin/bash

echo "=== PLATYPUS Deploy Check ==="
echo ""

echo "1. Prüfe wichtige Dateien..."
[ -f app/layout.tsx ] && echo "  ✅ layout.tsx" || echo "  ❌ layout.tsx fehlt"
[ -f app/page.tsx ] && echo "  ✅ homepage" || echo "  ❌ homepage fehlt"
[ -f app/product/\[id\]/page.tsx ] && echo "  ✅ product page" || echo "  ❌ product page fehlt"
[ -f app/cart/page.tsx ] && echo "  ✅ cart page" || echo "  ❌ cart page fehlt"

echo ""
echo "2. Prüfe Viewer..."
if grep -q "takeSnapshot" app/components/Viewer/Viewer.tsx; then
    echo "  ✅ Snapshot Funktion"
else
    echo "  ❌ Snapshot fehlt"
fi

echo ""
echo "3. Prüfe Cart Funktionalität..."
if grep -q "localStorage" app/cart/page.tsx; then
    echo "  ✅ LocalStorage Cart"
else
    echo "  ❌ Cart Problem"
fi

echo ""
echo "=== Check abgeschlossen ==="
