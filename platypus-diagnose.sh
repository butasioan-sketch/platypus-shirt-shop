#!/bin/bash
set -euo pipefail

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()   { echo -e "${GREEN}[OK]${NC}    $1"; }
fail() { echo -e "${RED}[FAIL]${NC}  $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC}  $1"; }
info() { echo -e "${CYAN}[INFO]${NC}  $1"; }
sep()  { echo ""; echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"; echo "$1"; echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"; }

REPORT="PLATYPUS-LAGEBERICHT.md"
echo "# PLATYPUS Lagebericht" > "$REPORT"
echo "Erstellt: $(date)" >> "$REPORT"
echo "" >> "$REPORT"

log() {
    echo "$1" >> "$REPORT"
}

sep "1. SYSTEM"
info "Node: $(node -v 2>/dev/null || echo 'nicht gefunden')"
info "NPM:  $(npm -v 2>/dev/null || echo 'nicht gefunden')"
info "Git:  $(git --version 2>/dev/null || echo 'nicht gefunden')"
info "Vercel CLI: $(npx vercel --version 2>/dev/null | head -n1 || echo 'nicht gefunden')"
log "## System"
log "- Node: $(node -v 2>/dev/null || echo 'fehlt')"
log "- NPM: $(npm -v 2>/dev/null || echo 'fehlt')"
log "- Git: $(git --version 2>/dev/null || echo 'fehlt')"
log ""

sep "2. PROJEKT STRUKTUR"
PFLICHT=(
    "app/page.tsx"
    "app/layout.tsx"
    "app/product/[id]/page.tsx"
    "app/cart/page.tsx"
    "app/admin/page.tsx"
    "app/admin/orders/page.tsx"
    "app/admin/inventory/page.tsx"
    "app/admin/viewer-notes/page.tsx"
    "app/api/payments/create-checkout/route.ts"
    "app/api/webhooks/stripe/route.ts"
    "middleware.ts"
    "app/lib/products.ts"
    "app/components/Viewer/Viewer.tsx"
    "app/components/Footer.tsx"
    "app/impressum/page.tsx"
    "app/agb/page.tsx"
    "app/datenschutz/page.tsx"
    "app/versand/page.tsx"
)

log "## Projekt Struktur"
for f in "${PFLICHT[@]}"; do
    if [ -f "$f" ]; then
        ok "$f"
        log "- [OK] $f"
    else
        fail "$f FEHLT"
        log "- [FEHLT] $f"
    fi
done
log ""

sep "3. ENVIRONMENT VARIABLEN"
log "## Environment"
if [ -f ".env.local" ]; then
    ok ".env.local vorhanden"
    for VAR in STRIPE_SECRET_KEY NEXT_PUBLIC_SITE_URL ADMIN_PASSWORD STRIPE_WEBHOOK_SECRET NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY; do
        if grep -q "^${VAR}=" .env.local 2>/dev/null; then
            VALUE=$(grep "^${VAR}=" .env.local | cut -d= -f2)
            if [ -n "$VALUE" ] && [ "$VALUE" != "sk_test_..." ] && [ "$VALUE" != "deine-supabase-url" ] && [ "$VALUE" != "dein-supabase-anon-key" ]; then
                ok "$VAR gesetzt"
                log "- [OK] $VAR"
            else
                warn "$VAR ist Platzhalter oder leer"
                log "- [PLATZHALTER] $VAR"
            fi
        else
            warn "$VAR nicht gesetzt"
            log "- [FEHLT] $VAR"
        fi
    done
else
    fail ".env.local fehlt komplett"
    log "- [FAIL] .env.local fehlt"
fi
log ""

sep "4. BUILD TEST"
log "## Build"
if npm run build > /tmp/platypus-build.log 2>&1; then
    ok "Build erfolgreich"
    log "- [OK] Build erfolgreich"
else
    fail "Build fehlgeschlagen"
    log "- [FAIL] Build fehlgeschlagen"
    echo ""
    echo "Build Fehler (letzte 30 Zeilen):"
    tail -30 /tmp/platypus-build.log
    log ""
    log "### Build Fehler"
    log '```'
    tail -30 /tmp/platypus-build.log >> "$REPORT"
    log '```'
fi
log ""

sep "5. LIVE SHOP CHECK"
BASE_URL="https://platypus-shirt-shop.vercel.app"
log "## Live Shop"
log "Base URL: $BASE_URL"
log ""

ROUTES=(
    "/"
    "/product/1"
    "/product/2"
    "/cart"
    "/admin"
    "/admin/orders"
    "/admin/inventory"
    "/admin/viewer-notes"
    "/impressum"
    "/agb"
    "/datenschutz"
    "/versand"
)

for route in "${ROUTES[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$BASE_URL$route" 2>/dev/null || echo "000")
    if [[ "$STATUS" == "200" ]]; then
        ok "$route → $STATUS"
        log "- [OK] $route → $STATUS"
    elif [[ "$STATUS" == "401" ]]; then
        warn "$route → $STATUS (Auth erforderlich)"
        log "- [AUTH] $route → $STATUS"
    elif [[ "$STATUS" == "000" ]]; then
        warn "$route → Timeout/keine Verbindung"
        log "- [TIMEOUT] $route"
    else
        fail "$route → $STATUS"
        log "- [FAIL] $route → $STATUS"
    fi
done
log ""

sep "6. STRIPE API CHECK"
log "## Stripe API"
STRIPE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/payments/create-checkout" \
    -H "Content-Type: application/json" \
    --max-time 15 \
    -d '{
        "paymentMethod":"card",
        "reference":"DIAGNOSE-TEST",
        "shipping":4.99,
        "total":34.98,
        "items":[{"name":"Essential Shirt Weiß","size":"M","price":29.99,"quantity":1}]
    }' 2>/dev/null || echo '{"error":"keine verbindung"}')

echo "API Antwort: $STRIPE_RESPONSE"
log "API Antwort: $STRIPE_RESPONSE"

if echo "$STRIPE_RESPONSE" | grep -q "stripe_checkout_created"; then
    ok "Stripe Checkout funktioniert"
    log "- [OK] Stripe Checkout aktiv"
    REDIRECT=$(echo "$STRIPE_RESPONSE" | grep -o '"redirectUrl":"[^"]*"' | cut -d'"' -f4 || echo "")
    if [ -n "$REDIRECT" ]; then
        info "Checkout URL: $REDIRECT"
        log "- Checkout URL: $REDIRECT"
    fi
elif echo "$STRIPE_RESPONSE" | grep -q "demo"; then
    warn "Stripe im Demo-Modus (kein echter Key)"
    log "- [DEMO] Stripe Demo-Modus aktiv"
else
    fail "Stripe Checkout Problem"
    log "- [FAIL] Stripe Checkout"
fi
log ""

sep "7. SCRIPTS CHECK"
log "## Scripts"
SCRIPTS=(
    "platypus_lead.sh"
    "scripts-deploy.sh"
    "scripts/orders-final-report.sh"
    "scripts/orders-live-healthcheck.sh"
    "scripts/project-audit.sh"
    "scripts/env-check.sh"
    "scripts/stripe-webhook-setup.sh"
    "modules/admin.sh"
    "modules/stripe.sh"
    "modules/deploy.sh"
    "modules/audit.sh"
    "modules/backup.sh"
    "modules/health.sh"
    "modules/env.sh"
    "modules/orders.sh"
    "config/settings.cfg"
)

for s in "${SCRIPTS[@]}"; do
    if [ -f "$s" ]; then
        if [ -x "$s" ]; then
            ok "$s (ausführbar)"
            log "- [OK] $s"
        else
            warn "$s (nicht ausführbar)"
            log "- [WARN] $s nicht ausführbar"
        fi
    else
        fail "$s fehlt"
        log "- [FEHLT] $s"
    fi
done
log ""

sep "8. VERCEL STATUS"
log "## Vercel"
VERCEL_LIST=$(npx vercel list 2>/dev/null | head -20 || echo "Vercel nicht verfügbar")
echo "$VERCEL_LIST"
log '```'
echo "$VERCEL_LIST" >> "$REPORT"
log '```'
log ""

sep "9. GIT STATUS"
log "## Git"
GIT_STATUS=$(git log --oneline -5 2>/dev/null || echo "kein git")
GIT_BRANCH=$(git branch --show-current 2>/dev/null || echo "?")
info "Branch: $GIT_BRANCH"
info "Letzte Commits:"
echo "$GIT_STATUS"
log "- Branch: $GIT_BRANCH"
log '```'
echo "$GIT_STATUS" >> "$REPORT"
log '```'
log ""

sep "ZUSAMMENFASSUNG"
log "## Zusammenfassung"
log "Report gespeichert in: $REPORT"
info "Lagebericht gespeichert: $REPORT"
echo ""
echo "Schick mir den Inhalt von: $REPORT"

