#!/bin/bash
echo "════════════════════════════════════════════════════════════"
echo " Vercel Projekt Konfiguration"
echo "════════════════════════════════════════════════════════════"
echo ""

if [ -f .vercel/project.json ]; then
    echo "✅ Projekt ist verlinkt:"
    cat .vercel/project.json
else
    echo "❌ Projekt ist nicht verlinkt"
    echo ""
    echo "Projekt linken mit:"
    echo "  vercel link"
fi

echo ""
echo "Aktuelle Projekt-Infos:"
vercel inspect 2>/dev/null || echo "Keine Infos verfügbar (Projekt evtl. nicht verlinkt)"
echo ""
echo "════════════════════════════════════════════════════════════"
