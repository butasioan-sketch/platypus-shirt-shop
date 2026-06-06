#!/bin/bash
################################################################################
# PLATYPUS - Project Audit
################################################################################
set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

ok()    { echo -e "${GREEN}✅${NC} $1"; }
warn()  { echo -e "${YELLOW}⚠️${NC}  $1"; }
fail()  { echo -e "${RED}❌${NC} $1"; }
info()  { echo -e "${CYAN}→${NC}  $1"; }

echo "=========================================="
echo "   PLATYPUS Project Audit"
echo "=========================================="
echo ""

# Build Check
echo "[1/6] Build Status"
if npm run build > /dev/null 2>&1; then
    ok "Build erfolgreich"
else
    fail "Build fehlgeschlagen"
fi
echo ""

# Critical Files
echo "[2/6] Kritische Dateien"
[ -f "middleware.ts" ] && ok "middleware.ts vorhanden" || fail "middleware.ts fehlt"
[ -f "app/api/webhooks/stripe/route.ts" ] && ok "Stripe Webhook Route vorhanden" || warn "Stripe Webhook Route fehlt"
[ -f "platypus_lead.sh" ] && ok "platypus_lead.sh vorhanden" || fail "platypus_lead.sh fehlt"
echo ""

# Environment Variables
echo "[3/6] Wichtige Environment Variables"
if [ -f ".env.local" ]; then
    grep -q "STRIPE_SECRET_KEY" .env.local && ok "STRIPE_SECRET_KEY gesetzt" || warn "STRIPE_SECRET_KEY fehlt"
    grep -q "ADMIN_PASSWORD" .env.local && ok "ADMIN_PASSWORD gesetzt" || warn "ADMIN_PASSWORD fehlt"
    grep -q "STRIPE_WEBHOOK_SECRET" .env.local && ok "STRIPE_WEBHOOK_SECRET gesetzt" || warn "STRIPE_WEBHOOK_SECRET fehlt (optional für jetzt)"
else
    warn ".env.local nicht gefunden"
fi
echo ""

# Admin Protection
echo "[4/6] Admin Schutz"
if [ -f "middleware.ts" ] && grep -q "/admin" middleware.ts; then
    ok "Admin Routes werden geschützt"
else
    warn "Admin Schutz möglicherweise nicht aktiv"
fi
echo ""

# Scripts
echo "[5/6] Wichtige Scripts"
[ -x "platypus_lead.sh" ] && ok "platypus_lead.sh ausführbar" || warn "platypus_lead.sh nicht ausführbar"
[ -x "scripts/setup-admin-auth.sh" ] && ok "setup-admin-auth.sh vorhanden" || warn "setup-admin-auth.sh fehlt"
[ -x "scripts/stripe-webhook-setup.sh" ] && ok "stripe-webhook-setup.sh vorhanden" || warn "stripe-webhook-setup.sh fehlt"
echo ""

# Vercel
echo "[6/6] Deployment"
if command -v vercel &> /dev/null; then
    ok "Vercel CLI verfügbar"
else
    warn "Vercel CLI nicht installiert"
fi
echo ""

echo "=========================================="
echo " Audit abgeschlossen"
echo "=========================================="
