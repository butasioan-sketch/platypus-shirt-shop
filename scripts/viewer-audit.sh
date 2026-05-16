#!/bin/bash

set -e

echo "========================================================="
echo "                PLATYPUS VIEWER AUDIT"
echo "========================================================="

echo ""
echo "1. Viewer Dateien"

FILES=(
  "components/Shirt360.tsx"
  "components/Shirt360Controls.tsx"
  "components/ShirtStudioFrame.tsx"
  "components/ShirtViewerTips.tsx"
  "components/ShirtFabricOverlay.tsx"
  "components/ShirtDepthShadow.tsx"
  "components/ShirtLightingFX.tsx"
  "components/ShirtRotationMeter.tsx"
  "components/ShirtViewerBadge.tsx"
  "components/ShirtViewerHelp.tsx"
  "components/ShirtViewerStatus.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ fehlt: $file"
  fi
done

echo ""
echo "2. Viewer Imports"
grep -n "ShirtViewer\|ShirtRotation\|ShirtLighting\|ShirtDepth\|ShirtFabric\|Shirt360Controls" components/Shirt360.tsx || true

echo ""
echo "3. Build"
npm run build

echo ""
echo "✅ VIEWER AUDIT COMPLETE"
