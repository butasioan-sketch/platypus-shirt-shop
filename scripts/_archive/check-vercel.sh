#!/bin/bash
echo "════════════════════════════════════════════════════════════"
echo " Vercel CLI Check"
echo "════════════════════════════════════════════════════════════"
echo ""

if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI ist installiert"
    echo "   Version: $(vercel --version)"
else
    echo "❌ Vercel CLI ist NICHT installiert"
    echo "   Installiere mit: npm install -g vercel"
    exit 1
fi

echo ""
echo "Login Status:"
vercel whoami 2>/dev/null || echo "❌ Nicht eingeloggt (vercel login)"

echo ""
echo "Projekt Link:"
if [ -f .vercel/project.json ]; then
    echo "✅ Projekt ist verlinkt"
    cat .vercel/project.json
else
    echo "⚠️  Projekt ist noch nicht verlinkt"
    echo "   Führe 'vercel' aus, um zu linken"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
