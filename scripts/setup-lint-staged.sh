#!/bin/bash
echo "════════════════════════════════════════════════════════════"
echo " Lint-Staged + Husky Setup"
echo "════════════════════════════════════════════════════════════"
echo ""

# Dependencies installieren
npm install husky lint-staged --save-dev

# Husky initialisieren
npx husky init

# lint-staged Konfiguration in package.json hinzufügen
npx json -I -f package.json -e '
  this["lint-staged"] = {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
'

echo ""
echo "✅ lint-staged + Husky eingerichtet"
echo ""
echo "Hooks befinden sich jetzt in .husky/"
echo "Beispiel: .husky/pre-commit mit npx lint-staged"
echo "════════════════════════════════════════════════════════════"
