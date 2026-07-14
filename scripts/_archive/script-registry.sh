#!/bin/bash

set -e

REGISTRY="SCRIPT-REGISTRY.md"

echo "# PLATYPUS Script Registry" > "$REGISTRY"
echo "" >> "$REGISTRY"
echo "Automatisch generierte Übersicht aller Bash-Scripte." >> "$REGISTRY"
echo "" >> "$REGISTRY"
echo "## Scripts" >> "$REGISTRY"
echo "" >> "$REGISTRY"

find scripts -type f -name "*.sh" | sort | while read script; do
  echo "- \`$script\`" >> "$REGISTRY"
done

echo "" >> "$REGISTRY"
echo "## Startpunkte" >> "$REGISTRY"
echo "" >> "$REGISTRY"
echo "- \`./scripts/stable-core.sh\`" >> "$REGISTRY"
echo "- \`./scripts/supreme-core.sh\`" >> "$REGISTRY"
echo "- \`./scripts/ultimate-command.sh\`" >> "$REGISTRY"
echo "- \`./scripts/zero-to-launch.sh\`" >> "$REGISTRY"
echo "- \`./scripts/first-sale-mode.sh\`" >> "$REGISTRY"
echo "" >> "$REGISTRY"

cat "$REGISTRY"

echo ""
echo "✅ Registry erstellt: $REGISTRY"
