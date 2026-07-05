#!/bin/bash
echo "========================================"
echo " PLATYPUS LAGEBERICHT — $(date '+%d.%m.%Y %H:%M')"
echo "========================================"

echo ""
echo "## GIT-STAND"
git branch --show-current
git log --oneline -8
echo "-- Uncommitted:"
git status --short || echo "(sauber)"

echo ""
echo "## STRIPE-MODUS (ohne Key anzuzeigen)"
if grep -q "sk_live" .env.local 2>/dev/null; then echo "LIVE-Modus ⚠️"; 
elif grep -q "sk_test" .env.local 2>/dev/null; then echo "TEST-Modus"; 
else echo "Kein Stripe-Key in .env.local gefunden"; fi

echo ""
echo "## E-MAIL-ABSENDER"
grep -rhon "from:.*['\"].*@.*['\"]" app/ lib/ 2>/dev/null | sort -u | head -5

echo ""
echo "## RECHTLICHES — PLATZHALTER-CHECK"
echo "-- Impressum:"
grep -in "platzhalter\|mustermann\|beispiel\|TODO\|\[Name\]\|XXX" app/impressum/page.tsx 2>/dev/null | head -5 || echo "  keine Platzhalter-Marker gefunden"
echo "-- AGB / Widerruf:"
if grep -qi "widerruf" app/agb/page.tsx 2>/dev/null; then 
  echo "  'Widerruf' kommt in AGB vor ($(grep -ci widerruf app/agb/page.tsx)x)"
else echo "  ⚠️ KEIN Widerruf-Text in AGB"; fi
grep -qi "individuell\|angefertigt\|312g" app/agb/page.tsx 2>/dev/null && echo "  Hinweis auf individuelle Anfertigung: JA" || echo "  ⚠️ Kein §312g-Hinweis (individuelle Anfertigung)"

echo ""
echo "## PRODUKT & BILDER"
ls -la public/*.png public/*.jpg 2>/dev/null | awk '{print $5, $9}'
echo "-- Verwendete Shirt-Bilder im Code:"
grep -rhon "airfit-[a-z-]*\.\(png\|jpg\)" app/ | sort -u | head -8

echo ""
echo "## KOMPONENTEN"
ls app/components/ 2>/dev/null

echo ""
echo "## OFFENE TODO/FIXME IM CODE"
grep -rn "TODO\|FIXME\|HACK" app/ lib/ --include="*.tsx" --include="*.ts" 2>/dev/null | head -10 || echo "(keine)"

echo ""
echo "## DB-TABELLEN & SPALTEN (orders)"
DBURL=$(grep DATABASE_URL .env.local | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")
if command -v psql >/dev/null && [ -n "$DBURL" ]; then
  psql "$DBURL" -t -c "SELECT column_name FROM information_schema.columns WHERE table_name='orders' ORDER BY ordinal_position;" 2>/dev/null | tr -d ' ' | grep -v '^$' | tr '\n' ',' | sed 's/,$/\n/'
  psql "$DBURL" -t -c "SELECT count(*) || ' Bestellungen, letzte: ' || COALESCE(max(created_at)::text,'-') FROM orders;" 2>/dev/null
else echo "(psql nicht verfügbar oder keine DATABASE_URL)"; fi

echo ""
echo "## VERSIONEN"
grep '"next"\|"react"\|"stripe"\|"resend"' package.json | tr -d ' ,'

echo ""
echo "========================================"
echo " ENDE LAGEBERICHT"
echo "========================================"
