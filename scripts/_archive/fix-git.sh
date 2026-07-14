#!/bin/bash

echo "=== PLATYPUS Git Fix ==="
echo ""

echo "1. Aktueller Remote:"
git remote -v

echo ""
echo "2. Versuche Upstream zu setzen..."
git branch --set-upstream-to=origin/main main 2>/dev/null || echo "Upstream konnte nicht gesetzt werden"

echo ""
echo "3. Push versuchen..."
git push -u origin main || echo "Push fehlgeschlagen. Prüfe Remote URL und Berechtigungen."

echo ""
echo "Fertig."
