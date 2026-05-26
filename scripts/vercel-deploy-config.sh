#!/bin/bash
echo "════════════════════════════════════════════════════════════"
echo " Vercel Deployment Konfiguration"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "1. Projekt-Info:"
vercel inspect 2>/dev/null | head -15 || echo "Kein Projekt verlinkt"

echo ""
echo "2. vercel.json (falls vorhanden):"
if [ -f vercel.json ]; then
    cat vercel.json
else
    echo "Keine vercel.json gefunden (Standard-Konfiguration wird verwendet)"
fi

echo ""
echo "3. Framework Detection:"
echo "   Next.js Projekt erkannt → Automatische Konfiguration"
echo ""
echo "════════════════════════════════════════════════════════════"
