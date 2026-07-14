#!/bin/bash
echo "════════════════════════════════════════════════════════════"
echo " Vercel Project Konfiguration"
echo "════════════════════════════════════════════════════════════"
echo ""

if [ -f .vercel/project.json ]; then
    echo "✅ Projekt ist verlinkt:"
    cat .vercel/project.json
else
    echo "❌ Keine .vercel/project.json gefunden"
    echo ""
    echo "Projekt linken mit:"
    echo "  vercel link"
fi

echo ""
echo "Aktuelle Vercel Einstellungen:"
vercel inspect 2>/dev/null | head -20 || echo "Keine Projekt-Infos verfügbar"
echo ""
echo "════════════════════════════════════════════════════════════"
