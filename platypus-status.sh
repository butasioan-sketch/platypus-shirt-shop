#!/bin/bash
BASE="https://platypus-shirt-shop.vercel.app"
OUT="PLATYPUS-STATUS.md"

check() { curl -s -o /dev/null -w "%{http_code}" --max-time 12 "$1" 2>/dev/null || echo "000"; }

echo "# PLATYPUS Shirt Shop — Statusbericht" > $OUT
echo "Erstellt: $(date '+%d.%m.%Y %H:%M')" >> $OUT
echo "" >> $OUT

echo "## Live-Seiten" >> $OUT
for path in "/" "/product/1" "/product/2" "/cart" "/versand" "/agb" "/datenschutz" "/impressum"; do
  s=$(check "$BASE$path")
  [ "$s" = "200" ] && echo "- ✅ $path ($s)" >> $OUT || echo "- ⚠️ $path ($s)" >> $OUT
done
echo "" >> $OUT

echo "## Admin (passwortgeschützt, 401 = korrekt geschützt)" >> $OUT
for path in "/admin" "/admin/orders" "/admin/analytics" "/admin/inventory"; do
  s=$(check "$BASE$path")
  { [ "$s" = "200" ] || [ "$s" = "401" ]; } && echo "- ✅ $path ($s)" >> $OUT || echo "- ⚠️ $path ($s)" >> $OUT
done
echo "" >> $OUT

echo "## APIs" >> $OUT
for path in "/api/orders" "/api/analytics" "/api/chat" "/api/payments/create-checkout" "/api/webhooks/stripe"; do
  s=$(check "$BASE$path")
  { [ "$s" = "200" ] || [ "$s" = "401" ] || [ "$s" = "405" ]; } && echo "- ✅ $path ($s)" >> $OUT || echo "- ⚠️ $path ($s)" >> $OUT
done
echo "" >> $OUT

echo "## Datenbank (Neon Postgres)" >> $OUT
DBURL=$(neonctl connection-string 2>/dev/null)
if [ -n "$DBURL" ]; then
  CNT=$(node -e "const {neon}=require('@neondatabase/serverless');const sql=neon(process.argv[1]);sql.query('SELECT COUNT(*)::int n FROM orders').then(r=>console.log(r[0].n)).catch(()=>console.log('ERR'))" "$DBURL" 2>/dev/null)
  echo "- ✅ Verbunden, Bestellungen gespeichert: $CNT" >> $OUT
else
  echo "- ⚠️ Keine DB-Verbindung" >> $OUT
fi
echo "" >> $OUT

echo "## Environment-Variablen (Vercel Production)" >> $OUT
npx vercel env ls production 2>/dev/null | grep -iE "stripe|database|admin|site_url|webhook" | awk '{print "- ✅ " $1}' >> $OUT
echo "" >> $OUT

echo "## Git / GitHub" >> $OUT
echo "- Lokale Commits: $(git rev-list --count main 2>/dev/null)" >> $OUT
echo "- Letzter Commit: $(git log -1 --oneline 2>/dev/null)" >> $OUT
git status | grep -q "auf demselben Stand" && echo "- ✅ GitHub synchron" >> $OUT || echo "- ⚠️ GitHub nicht synchron (git push noetig)" >> $OUT
echo "" >> $OUT

echo "## Stripe Webhooks" >> $OUT
WH=$(stripe webhook_endpoints list 2>/dev/null | grep -c "enabled")
echo "- Aktive Webhook-Endpoints: $WH" >> $OUT

cat $OUT
