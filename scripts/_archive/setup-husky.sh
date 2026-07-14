#!/bin/bash
echo "════════════════════════════════════════════════════════════"
echo " Husky Setup (Git Hooks für Node.js)"
echo "════════════════════════════════════════════════════════════"
echo ""

# Husky installieren
npm install husky --save-dev

# Husky initialisieren
npx husky init

echo ""
echo "✅ Husky wurde eingerichtet"
echo ""
echo "Du kannst jetzt Hooks in .husky/ Ordner erstellen"
echo "Beispiel: .husky/pre-commit"
echo "════════════════════════════════════════════════════════════"
