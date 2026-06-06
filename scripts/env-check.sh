#!/bin/bash
################################################################################
# PLATYPUS - Environment Variables Check
################################################################################
set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_var() {
    local var_name=$1
    local required=$2

    if grep -q "^${var_name}=" .env.local 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $var_name"
    else
        if [ "$required" = "true" ]; then
            echo -e "${RED}❌${NC} $var_name (fehlt - benötigt)"
        else
            echo -e "${YELLOW}⚠️${NC}  $var_name (optional)"
        fi
    fi
}

echo "=========================================="
echo "   PLATYPUS Environment Check"
echo "=========================================="
echo ""

if [ ! -f ".env.local" ]; then
    echo "❌ .env.local nicht gefunden!"
    exit 1
fi

echo "Erforderlich:"
check_var "STRIPE_SECRET_KEY" true
check_var "NEXT_PUBLIC_SITE_URL" true
check_var "ADMIN_PASSWORD" true

echo ""
echo "Optional / Für später:"
check_var "STRIPE_WEBHOOK_SECRET" false
check_var "DATABASE_URL" false

echo ""
echo "=========================================="
