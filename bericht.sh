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
echo "## E-MAIL-ABSENDER"
grep -rhon "from:.*['\"].*@.*['\"]" app/ lib/ 2>/dev/null | sort -u | head -5
echo ""
echo "## RECHTLICHES"
grep -qi "musterstadt\|musterstraße" app/impressum/page.tsx && echo "⚠️ Impressum: noch PLATZHALTER" || echo "Impressum: keine Muster-Platzhalter"
w=$(grep -ci widerruf app/agb/page.tsx 2>/dev/null); echo "AGB: 'Widerruf' kommt ${w}x vor"
echo ""
echo "## PRODUKT & BILDER"
ls -la public/*.png public/*.jpg 2>/dev/null | awk '{print $5, $9}'
echo ""
echo "## OFFENE TODO/FIXME IM CODE"
grep -rn "TODO\|FIXME\|HACK" app/ lib/ --include="*.tsx" --include="*.ts" 2>/dev/null | head -10 || echo "(keine)"
echo ""
echo "## DB (orders) — via Node"
node scripts/db-check.mjs 2>/dev/null || echo "(DB-Check fehlgeschlagen)"
echo ""
echo "## VERSIONEN"
grep '"next"\|"react"\|"stripe"\|"resend"\|"@neondatabase"' package.json | tr -d ' ,'
echo ""
echo "========================================"
echo " ENDE LAGEBERICHT"
echo "========================================"
