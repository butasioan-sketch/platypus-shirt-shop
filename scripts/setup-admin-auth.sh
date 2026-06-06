#!/bin/bash
################################################################################
# PLATYPUS - Admin Authentication Setup
################################################################################
set -euo pipefail

echo "=========================================="
echo "   PLATYPUS Admin Authentication Setup"
echo "=========================================="
echo ""

if [ ! -f "middleware.ts" ]; then
    echo "❌ middleware.ts nicht gefunden!"
    echo "Bitte zuerst die Middleware anlegen."
    exit 1
fi

echo "✅ middleware.ts gefunden"

# Prüfe ob ADMIN_PASSWORD schon gesetzt ist
if grep -q "ADMIN_PASSWORD" .env.local 2>/dev/null; then
    echo "✅ ADMIN_PASSWORD ist bereits in .env.local gesetzt"
else
    echo ""
    read -sp "Admin Passwort festlegen: " ADMIN_PASS
    echo ""
    
    if [ -z "$ADMIN_PASS" ]; then
        echo "❌ Passwort darf nicht leer sein"
        exit 1
    fi

    echo "ADMIN_PASSWORD=$ADMIN_PASS" >> .env.local
    echo "✅ Passwort wurde in .env.local gespeichert"
fi

echo ""
echo "Nächste Schritte:"
echo "1. Das Passwort auch in Vercel setzen:"
echo "   npx vercel env add ADMIN_PASSWORD"
echo ""
echo "2. Danach neu deployen:"
echo "   ./platypus_lead.sh deploy"
echo ""
echo "=========================================="
echo " Admin Auth Setup abgeschlossen"
echo "=========================================="
