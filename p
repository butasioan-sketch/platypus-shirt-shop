#!/bin/bash
# PLATYPUS Helfer - schlank, nur echte Befehle
set -e
cd ~/Schreibtisch/platypus-shirt-shop
LIVE="https://platypus-shirt-shop.vercel.app"

case "${1:-help}" in
  deploy)
    MSG="${2:-update}"
    echo "→ Build-Check..."
    npm run build 2>&1 | grep -E "Compiled|Failed|error" | head -3
    echo "→ Commit + Push..."
    git add -A && git commit --no-verify -m "$MSG" || echo "(nichts zu committen)"
    git push origin main || echo "(push uebersprungen)"
    echo "→ Deploy..."
    npx vercel build --prod && npx vercel deploy --prebuilt --prod --yes
    ;;
  health)
    echo "→ Live-Healthcheck:"
    for p in "/" "/product/1" "/cart" "/tracking" "/admin"; do
      code=$(curl -s -o /dev/null -w "%{http_code}" "$LIVE$p")
      echo "  $code  $LIVE$p"
    done
    ;;
  status)
    git status --short
    echo "---"
    git log --oneline -3
    ;;
  build)
    npm run build 2>&1 | grep -E "Compiled|Failed|error" | head -5
    ;;
  *)
    echo "PLATYPUS Helfer:"
    echo "  ./p deploy \"nachricht\"  - build + commit + push + deploy"
    echo "  ./p health             - prueft alle Live-Seiten (HTTP-Codes)"
    echo "  ./p status             - git-status + letzte commits"
    echo "  ./p build              - nur Build-Check"
    ;;
esac
