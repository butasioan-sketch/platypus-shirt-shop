#!/bin/bash
# Platypus Toolchain-Check — Pflicht + Nice-to-have
set -euo pipefail
cd "$(dirname "$0")/.."

PASS=0
WARN=0
FAIL=0

check() {
  local level="$1" name="$2" cmd="$3"
  if eval "$cmd" &>/dev/null; then
    echo "  OK   $name"
    PASS=$((PASS + 1))
  else
    if [ "$level" = "pflicht" ]; then
      echo "  FAIL $name"
      FAIL=$((FAIL + 1))
    else
      echo "  WARN $name (optional)"
      WARN=$((WARN + 1))
    fi
  fi
}

echo "=== PLATYPUS TOOLCHAIN ==="
echo ""
echo "Pflicht:"
check pflicht "Node.js"        "node --version"
check pflicht "npm"            "npm --version"
check pflicht "git"            "git --version"
check pflicht "python3"        "python3 --version"
check pflicht "Vercel CLI"     "vercel --version"
check pflicht "Projekt-Build"  "test -f package.json"
check pflicht "./p Helfer"     "test -x ./p"

echo ""
echo "Nice-to-have:"
check optional "GitHub CLI (gh)" "gh --version"
check optional "Stripe CLI"    "stripe --version"
check optional "VS Code"       "code --version"
check optional "Claude Code"   "claude --version"
check optional "Grok CLI"      "grok --version"

echo ""
echo "Nicht fuer Platypus (ignorieren):"
for skip in flutter docker pm2; do
  if command -v "$skip" &>/dev/null; then
    echo "  INFO $skip installiert — andere Projekte"
  fi
done

echo ""
echo "Env (.env.local):"
for key in DATABASE_URL STRIPE_SECRET_KEY INTERNAL_API_KEY; do
  if grep -q "^${key}=" .env.local 2>/dev/null; then
    echo "  OK   $key"
  else
    echo "  WARN $key fehlt"
    WARN=$((WARN + 1))
  fi
done

echo ""
echo "--- Ergebnis: $PASS OK | $WARN Warn | $FAIL Fail ---"
[ "$FAIL" -eq 0 ] || exit 1