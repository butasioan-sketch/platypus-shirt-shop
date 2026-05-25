#!/bin/bash

ALIAS_FILE="$HOME/.zshrc"

echo "" >> "$ALIAS_FILE"
echo "# === PLATYPUS Aliases ===" >> "$ALIAS_FILE"
echo "alias pstatus='./scripts/project.sh check'" >> "$ALIAS_FILE"
echo "alias porders='./scripts/orders-menu.sh'" >> "$ALIAS_FILE"
echo "alias pdashboard='./scripts/dashboard.sh'" >> "$ALIAS_FILE"
echo "alias pstart='./scripts/daily-start.sh'" >> "$ALIAS_FILE"
echo "alias pcheat='./scripts/cheatsheet.sh'" >> "$ALIAS_FILE"
echo "alias psave='./scripts/git/save-work.sh'" >> "$ALIAS_FILE"

echo "✅ Aliases hinzugefügt zu $ALIAS_FILE"
echo "Bitte Terminal neu starten oder 'source ~/.zshrc' ausführen"
