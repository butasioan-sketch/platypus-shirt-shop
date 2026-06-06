#!/bin/bash
echo "════════════════════════════════════════════════════════════"
echo " Git Hooks Setup"
echo "════════════════════════════════════════════════════════════"
echo ""

mkdir -p .git/hooks

# Pre-commit Hook
cat > .git/hooks/pre-commit << 'HOOK'
#!/bin/bash
echo "🔍 Pre-Commit Check..."
./scripts/status.sh 2>/dev/null || true
echo "✅ Pre-Commit Check abgeschlossen"
HOOK

chmod +x .git/hooks/pre-commit

echo "✅ Pre-Commit Hook installiert"
echo ""
echo "Der Hook läuft automatisch vor jedem Commit."
echo "════════════════════════════════════════════════════════════"
