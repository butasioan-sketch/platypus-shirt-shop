#!/bin/bash
set -euo pipefail

GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
info() { echo -e "${CYAN}[->]${NC} $1"; }
warn() { echo -e "${YELLOW}[!!]${NC} $1"; }
fail() { echo -e "${RED}[FAIL]${NC} $1"; }

# ============================================================
# 1. NOCHMAL BUILD ZUR SICHERHEIT
# ============================================================
info "Build zur Sicherheit nochmal..."
if npm run build > /tmp/deploy-build.log 2>&1; then
  ok "Build grün"
else
  fail "Build doch nicht grün — STOPP"
  tail -20 /tmp/deploy-build.log
  exit 1
fi

# ============================================================
# 2. COMMIT & DEPLOY
# ============================================================
info "Commit..."
git add .
git commit -m "fix: proxy migration + viewer repair — build wieder gruen, phase 1-3 live" || warn "nichts zu committen"

info "Deploy zu Vercel (kann 1-3 Min dauern)..."
DEPLOY_OUTPUT=$(npx vercel --prod 2>&1)
echo "$DEPLOY_OUTPUT"

# Production URL aus Output ziehen
PROD_URL=$(echo "$DEPLOY_OUTPUT" | grep -oE 'https://[a-z0-9-]+\.vercel\.app' | tail -1)
ok "Deploy abgeschickt"

# ============================================================
# 3. WARTEN BIS LIVE
# ============================================================
info "Warte 30 Sekunden bis Deploy propagiert..."
sleep 30

# ============================================================
# 4. LIVE VERIFICATION — die entscheidende Prüfung
# ============================================================
BASE="https://platypus-shirt-shop.vercel.app"
echo ""
echo "================================================"
echo "  LIVE CHECK — sind die neuen Seiten da?"
echo "================================================"

ROUTES=(
  "/"
  "/product/1"
  "/cart"
  "/admin"
  "/admin/orders"
  "/admin/analytics"
  "/admin/tests"
  "/api/chat"
  "/api/orders"
  "/api/analytics"
)

ALL_OK=true
for route in "${ROUTES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$BASE$route" 2>/dev/null || echo "000")
  if [[ "$STATUS" == "200" || "$STATUS" == "401" || "$STATUS" == "405" ]]; then
    ok "$route → $STATUS"
  else
    warn "$route → $STATUS"
    ALL_OK=false
  fi
done

echo ""
# ============================================================
# 5. KI CHAT LIVE TESTEN
# ============================================================
info "KI Chat wird getestet..."
CHAT_RESPONSE=$(curl -s -X POST "$BASE/api/chat" \
  -H "Content-Type: application/json" \
  --max-time 20 \
  -d '{"message":"Welche Größen gibt es?","locale":"de"}' 2>/dev/null || echo '{"error":"timeout"}')
echo "Chat Antwort: $CHAT_RESPONSE"

if echo "$CHAT_RESPONSE" | grep -q "reply"; then
  ok "KI Chat antwortet"
else
  warn "KI Chat Problem"
fi

echo ""
echo "================================================"
if [ "$ALL_OK" = true ]; then
  echo -e "${GREEN}  ALLES LIVE — /admin/orders war 404, jetzt da${NC}"
else
  echo -e "${YELLOW}  Fast — einige Routen brauchen evtl. mehr Zeit${NC}"
  echo -e "${YELLOW}  In 1 Min nochmal: ./platypus-diagnose.sh${NC}"
fi
echo "================================================"
echo ""
echo "Jetzt selbst ansehen:"
echo "  Shop:      $BASE"
echo "  Analytics: $BASE/admin/analytics"
echo "  Orders:    $BASE/admin/orders"

