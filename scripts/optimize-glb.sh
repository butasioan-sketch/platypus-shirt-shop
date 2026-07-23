#!/usr/bin/env bash
# PLATYPUS — GLB optimieren für den Shop (weißes Blank + Decals)
# Usage:
#   npm run optimize-glb -- input.glb [output.glb]
#   bash scripts/optimize-glb.sh ~/Downloads/foo.glb public/models/shorts-white-v1.glb
#
# Default: schreibt nach public/models/<basename>-optimized.glb
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v gltf-transform >/dev/null 2>&1; then
  echo "FEHLER: gltf-transform nicht gefunden. Install: npm i -g @gltf-transform/cli"
  exit 1
fi

IN="${1:-}"
if [[ -z "$IN" || ! -f "$IN" ]]; then
  echo "Usage: npm run optimize-glb -- <input.glb> [output.glb]"
  echo "Example: npm run optimize-glb -- ~/Downloads/soccer-shorts.glb public/models/shorts-white-v1.glb"
  exit 1
fi

BASE="$(basename "$IN" .glb)"
OUT="${2:-public/models/${BASE}-optimized.glb}"
mkdir -p "$(dirname "$OUT")"

echo "→ inspect (vorher):"
gltf-transform inspect "$IN" 2>/dev/null | head -40 || true

echo "→ optimize: $IN → $OUT"
# compress false: maximale Kompatibilität mit three.js / useGLTF (kein Draco-Decoder nötig)
# flatten+join: weniger Draw-Calls für Garment-Meshes
gltf-transform optimize "$IN" "$OUT" \
  --compress false \
  --texture-compress false \
  --flatten true \
  --join true

echo "→ inspect (nachher):"
gltf-transform inspect "$OUT" 2>/dev/null | head -40 || true
echo "→ Größe: $(du -h "$OUT" | cut -f1)  ($OUT)"
echo ""
echo "Nächste Schritte (Shop-Pipeline):"
echo "  1) Mesh muss WEISS sein (Decals). Texturen optional vorher strippen (Blender/Python)."
echo "  2) Datei nach public/models/ legen (falls Output woanders)."
echo "  3) app/components/Shirt3D.tsx → MODEL_PATHS['2'] (oder neues productId) anpassen."
echo "  4) useGLTF.preload(...) ergänzen."
echo "  5) getCamera(productId) kalibrieren (siehe public/models/GLB-WORKFLOW.md)."
echo "  6) npm run dev → /product/2 Tab 360° testen."
echo "  7) Erst nach Jonny-OK: commit + deploy."
