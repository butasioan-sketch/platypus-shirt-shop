#!/bin/bash
# P2 Verifikation: Stripe, Admin-Alert-Env, Health
set -euo pipefail
cd ~/Schreibtisch/platypus-shirt-shop

BASE="${NEXT_PUBLIC_SITE_URL:-https://platypus-shirt-shop.vercel.app}"
DESIGN_ID="${1:-}"

echo "=== P2 VERIFY — $BASE ==="
echo ""

echo "→ Health"
for p in "/" "/product/1" "/cart" "/api/payments/create-checkout"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$p")
  echo "  $code  $p"
done

echo ""
echo "→ Stripe Key Status"
curl -sL "$BASE/api/payments/create-checkout" | python3 -c "
import sys,json
d=json.load(sys.stdin)
ok=d.get('stripeKeyConfigured',False)
print('  stripeKeyConfigured:', ok)
sys.exit(0 if ok else 1)
" && echo "  ✅ Stripe Key auf Vercel" || echo "  ❌ Stripe Key fehlt"

if [ -z "$DESIGN_ID" ] && [ -f .env.local ]; then
  export $(grep -E '^DATABASE_URL=' .env.local | xargs) 2>/dev/null || true
  if [ -n "${DATABASE_URL:-}" ]; then
    DESIGN_ID=$(node -e "
      const {neon}=require('@neondatabase/serverless');
      const sql=neon(process.env.DATABASE_URL);
      sql\`SELECT id FROM designs ORDER BY created_at DESC LIMIT 1\`.then(r=>console.log(r[0]?.id||'')).catch(()=>{});
    " 2>/dev/null || true)
  fi
fi

if [ -n "$DESIGN_ID" ]; then
  echo ""
  echo "→ Stripe Checkout (designId=$DESIGN_ID)"
  RESP=$(curl -sL -X POST "$BASE/api/payments/create-checkout" \
    -H "Content-Type: application/json" \
    -d "{\"paymentMethod\":\"card\",\"country\":\"DE\",\"items\":[{\"name\":\"AirFit Pro\",\"size\":\"M\",\"quantity\":1,\"designId\":\"$DESIGN_ID\"}]}")
  echo "$RESP" | python3 -c "
import sys,json
d=json.load(sys.stdin)
st=d.get('status','')
url=d.get('redirectUrl','')
if st=='stripe_checkout_created' and url.startswith('https://checkout.stripe.com'):
  print('  ✅ Echte Stripe Checkout URL')
  print(' ',url[:80]+'...')
else:
  print('  ❌', d.get('error') or st or d)
  sys.exit(1)
"
else
  echo ""
  echo "  ⚠ Kein designId — Stripe POST Test übersprungen"
fi

echo ""
echo "→ Checkout ohne Motiv (muss 400)"
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/payments/create-checkout" \
  -H "Content-Type: application/json" \
  -d '{"paymentMethod":"card","items":[{"name":"Test","size":"M","quantity":1}]}')
[ "$CODE" = "400" ] && echo "  ✅ Blockiert ($CODE)" || echo "  ❌ Erwartet 400, bekam $CODE"

echo ""
echo "→ Env lokal"
for v in ADMIN_ALERT_EMAIL NEXT_PUBLIC_SITE_URL DATABASE_URL STRIPE_SECRET_KEY; do
  grep -q "^${v}=" .env.local 2>/dev/null && echo "  ✅ $v" || echo "  ⚠ $v fehlt lokal"
done

echo ""
echo "=== P2 VERIFY DONE ==="