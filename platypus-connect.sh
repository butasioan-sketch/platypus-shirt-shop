#!/bin/bash
set -uo pipefail
GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
info() { echo -e "${CYAN}[->]${NC} $1"; }
warn() { echo -e "${YELLOW}[!!]${NC} $1"; }
fail() { echo -e "${RED}[FAIL]${NC} $1"; }

# ============================================================
# 0. INTERNET STABIL? (Voraussetzung)
# ============================================================
info "Internet wird getestet..."
if ping -c 5 github.com > /tmp/ping.log 2>&1; then
  LOSS=$(grep -oP '\d+(?=% packet loss)' /tmp/ping.log)
  if [ "${LOSS:-100}" -le 20 ]; then
    ok "Internet stabil (${LOSS}% Verlust)"
  else
    fail "Internet zu instabil (${LOSS}% Verlust) — bitte warten und nochmal"
    exit 1
  fi
else
  fail "Kein Internet — bitte Verbindung prüfen"
  exit 1
fi

# ============================================================
# 1. GitHub Auth prüfen (frisch)
# ============================================================
info "GitHub Login wird geprüft..."
if gh auth status > /tmp/gh.log 2>&1; then
  ok "Bei GitHub eingeloggt"
else
  fail "Nicht eingeloggt — führe aus: gh auth login"
  exit 1
fi

# ============================================================
# 2. Repo ÖFFENTLICH machen (damit Vercel Zugriff hat)
# ============================================================
info "Repo wird auf öffentlich gestellt (nötig für Vercel-Zugriff)..."
if gh repo edit butasioan-sketch/platypus-shirt-shop --visibility public 2>/tmp/vis.log; then
  ok "Repo ist jetzt öffentlich"
else
  warn "Sichtbarkeit ändern fehlgeschlagen:"
  cat /tmp/vis.log
  warn "Versuche Bestätigungs-Variante..."
  echo "y" | gh repo edit butasioan-sketch/platypus-shirt-shop --visibility public 2>/tmp/vis2.log || {
    fail "Konnte Repo nicht öffentlich machen. Inhalt:"
    cat /tmp/vis2.log
    warn "Das ist meist ein kurzer Verbindungs-Aussetzer. Script in 1 Min nochmal starten."
    exit 1
  }
  ok "Repo ist jetzt öffentlich"
fi

# Kurz warten, damit GitHub die Änderung verarbeitet
sleep 3

# ============================================================
# 3. Vercel mit GitHub verbinden
# ============================================================
info "Vercel wird mit GitHub verbunden..."
if npx vercel git connect 2>/tmp/connect.log; then
  ok "VERCEL MIT GITHUB VERBUNDEN"
else
  warn "Verbindung fehlgeschlagen:"
  cat /tmp/connect.log
  warn "Falls 'access' Fehler: kurz warten, Script nochmal starten"
  exit 1
fi

# ============================================================
# 4. Deploy von GitHub auslösen
# ============================================================
info "Production Deploy wird ausgelöst..."
npx vercel --prod --yes 2>/tmp/deploy.log | tee /tmp/deploy-full.log
ok "Deploy-Befehl gesendet"

# ============================================================
# 5. Warten & prüfen
# ============================================================
info "Warte 40 Sekunden auf den Build..."
sleep 40

info "Live-Check..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 https://platypus-shirt-shop.vercel.app/admin/orders 2>/dev/null || echo "000")

echo ""
echo "=================================================="
if [[ "$STATUS" == "200" || "$STATUS" == "401" ]]; then
  echo -e "${GREEN}  ERFOLG — SHOP IST LIVE MIT NEUER VERSION${NC}"
  echo "  /admin/orders → $STATUS (war vorher 404)"
else
  echo -e "${YELLOW}  Deploy läuft noch (Status: $STATUS)${NC}"
  echo "  Vercel baut auf seinen Servern. In 2-3 Min nochmal prüfen:"
  echo "  curl -s -o /dev/null -w '%{http_code}' https://platypus-shirt-shop.vercel.app/admin/orders"
fi
echo "=================================================="
echo ""
echo "  Dein Handy zeigt nach dem Build die neue Version:"
echo "  https://platypus-shirt-shop.vercel.app"

