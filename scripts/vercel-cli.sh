#!/bin/bash
echo "════════════════════════════════════════════════════════════"
echo " Vercel CLI Status"
echo "════════════════════════════════════════════════════════════"
echo ""

if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI installiert"
    echo "   Version: $(vercel --version 2>/dev/null)"
else
    echo "❌ Vercel CLI nicht gefunden"
    echo ""
    read -p "Jetzt installieren? (y/n): " answer
    if [[ "$answer" == "y" ]]; then
        npm install -g vercel
    fi
fi

echo ""
echo "Login Status:"
vercel whoami 2>/dev/null || echo "Nicht eingeloggt → vercel login"

echo ""
echo "════════════════════════════════════════════════════════════"
