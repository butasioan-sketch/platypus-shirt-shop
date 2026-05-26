#!/bin/bash
echo "════════════════════════════════════════════════════════════"
echo " Vercel CLI Installation"
echo "════════════════════════════════════════════════════════════"
echo ""

if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI ist bereits installiert"
    echo "   Version: $(vercel --version)"
    echo ""
    echo "Falls du updaten möchtest:"
    echo "  npm install -g vercel@latest"
else
    echo "Vercel CLI wird installiert..."
    npm install -g vercel
fi

echo ""
echo "Login Status prüfen:"
vercel whoami 2>/dev/null || echo "→ Bitte einloggen mit: vercel login"
echo ""
echo "════════════════════════════════════════════════════════════"
