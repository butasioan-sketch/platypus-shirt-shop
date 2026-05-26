#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "           PLATYPUS - LAGEBERICHT"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "📁 Projekt-Ordner:"
pwd
echo ""

echo "📦 Git Status:"
git status --short
echo ""
echo "Letzte 5 Commits:"
git log --oneline -5
echo ""

echo "🛠️  Bash Tooling:"
[ -f scripts/p ] && echo "  ✅ scripts/p existiert" || echo "  ❌ scripts/p fehlt"
[ -f scripts/project.sh ] && echo "  ✅ scripts/project.sh existiert" || echo "  ❌ scripts/project.sh fehlt"
echo ""

echo "🖥️  Frontend:"
echo "  Viewer Komponenten: $(ls app/components/Viewer/*.tsx 2>/dev/null | wc -l)"
[ -f app/page.tsx ] && echo "  ✅ Homepage" || echo "  ❌ Homepage fehlt"
[ -f app/product/\[id\]/page.tsx ] && echo "  ✅ Product Page" || echo "  ❌ Product Page fehlt"
[ -f app/cart/page.tsx ] && echo "  ✅ Cart Page" || echo "  ❌ Cart Page fehlt"
[ -f app/layout.tsx ] && echo "  ✅ Layout" || echo "  ❌ Layout fehlt"
echo ""

echo "📦 Viewer Features:"
grep -q "takeSnapshot" app/components/Viewer/Viewer.tsx 2>/dev/null && echo "  ✅ Snapshot" || echo "  ❌ Snapshot fehlt"
grep -q "autoRotate" app/components/Viewer/Viewer.tsx 2>/dev/null && echo "  ✅ Auto Rotate" || echo "  ❌ Auto Rotate fehlt"
grep -q "zoom" app/components/Viewer/Viewer.tsx 2>/dev/null && echo "  ✅ Zoom" || echo "  ❌ Zoom fehlt"
grep -q "ColorPicker" app/components/Viewer/Viewer.tsx 2>/dev/null && echo "  ✅ ColorPicker" || echo "  ❌ ColorPicker fehlt"
echo ""

echo "════════════════════════════════════════════════════════════"
echo "Lagebericht abgeschlossen."
echo "════════════════════════════════════════════════════════════"
