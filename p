#!/bin/bash
# PLATYPUS Helfer — Pflicht-Toolchain
set -e
cd ~/Schreibtisch/platypus-shirt-shop
LIVE="https://platypus-shirt-shop.vercel.app"

case "${1:-help}" in
  deploy)
    MSG="${2:-update}"
    echo "→ Toolchain..."
    bash scripts/tools-check.sh || exit 1
    echo "→ Build-Check..."
    npm run build 2>&1 | grep -E "Compiled|Failed|error|Type error" | head -5
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
  tools)
    bash scripts/tools-check.sh
    ;;
  webhook)
    if ! command -v stripe &>/dev/null; then
      echo "Stripe CLI nicht installiert. Optional: https://stripe.com/docs/stripe-cli"
      exit 1
    fi
    echo "→ Stripe Webhook Forward (Ctrl+C zum Beenden):"
    stripe listen --forward-to localhost:3000/api/webhooks/stripe
    ;;
  gh)
    if ! command -v gh &>/dev/null; then
      echo "gh nicht installiert."
      exit 1
    fi
    gh auth status
    echo "---"
    gh repo view --web 2>/dev/null || gh repo view
    ;;
  status)
    git status --short
    echo "---"
    git log --oneline -3
    ;;
  build)
    npm run build 2>&1 | grep -E "Compiled|Failed|error|Type error" | head -8
    ;;
  scripts)
    echo "=== Aktive Platypus-Scripts ==="
    grep -v '^#' scripts/ACTIVE_SCRIPTS.txt | grep -v '^$'
    ;;
  p2)
    bash scripts/p2-verify.sh "${2:-}"
    ;;
  *)
    echo "PLATYPUS Helfer:"
    echo "  ./p tools              - Pflicht/Nice-to-have Toolchain pruefen"
    echo "  ./p build              - Build-Check"
    echo "  ./p deploy \"msg\"       - tools + build + commit + deploy"
    echo "  ./p health             - Live HTTP-Check"
    echo "  ./p webhook            - Stripe CLI lokal (nice-to-have)"
    echo "  ./p gh                 - GitHub Status (nice-to-have)"
    echo "  ./p scripts            - Liste aktiver Scripts"
    echo "  ./p status             - git status"
    echo "  ./p p2 [designId]      - P2 Verify (Stripe, Env)"
    ;;
esac