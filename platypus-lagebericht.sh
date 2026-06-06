#!/bin/bash
set -euo pipefail
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

ok() { echo -e "${GREEN}✅${NC} $1"; }
warn() { echo -e "${YELLOW}⚠️${NC}  $1"; }
err() { echo -e "${RED}❌${NC} $1"; }
info() { echo -e "${CYAN}ℹ️${NC}  $1"; }

echo "=========================================================="
echo "   PLATYPUS LAGEBERICHT (Stand: $(date +%Y-%m-%d_%H:%M:%S))"
echo "=========================================================="

info "PROJEKT-KERN"
echo "   URL: https://platypus-shirt-shop.vercel.app"
echo "   Status: PRE-LAUNCH READY"

info "DATEIEN & STRUKTUR"
[ -f "platypus_lead.sh" ] && ok "platypus_lead.sh" || err "platypus_lead.sh fehlt"
[ -f "middleware.ts" ] && ok "middleware.ts" || warn "middleware.ts fehlt"
[ -d "config" ] && ok "config/" || warn "config/ fehlt"
[ -d "modules" ] && ok "modules/" || warn "modules/ fehlt"
[ -f ".env.local" ] && ok ".env.local" || warn ".env.local fehlt"
[ -f "app/product/[id]/page.tsx" ] && ok "Produktseite (app/product/[id]/page.tsx)" || warn "Produktseite fehlt"
[ -f "app/api/webhooks/stripe/route.ts" ] && ok "Stripe Webhook Route" || warn "Stripe Webhook Route fehlt"

echo ""
info "NÄCHSTE SCHRITTE"
echo "   1. Deploy: ./platypus_lead.sh deploy"
echo "   2. Nach Deploy: Webhook-Test mit ./modules/webhook-test.sh"
echo "   3. Webhook Secret setzen und deployen"
echo "   4. Produktseite weiter optimieren"
echo ""
echo "=========================================================="
