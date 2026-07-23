#!/usr/bin/env bash
# PLATYPUS — komplette Kette: 3D-Input → weißes Blender-GLB → gltf-transform → Shop-Pfad
#
# Usage:
#   npm run make-shop-glb -- <input.obj|glb|fbx> [output.glb]
#
# Default output: public/models/shorts-white-v1.glb
# Example (OBJ das wir schon haben):
#   npm run make-shop-glb -- .tmp-shorts-sport/extracted/Shorts-Sport/obj/objShorts.obj public/models/shorts-white-v1.glb
set -euo pipefail
cd "$(dirname "$0")/.."

IN="${1:-}"
OUT="${2:-public/models/shorts-white-v1.glb}"

if [[ -z "$IN" || ! -f "$IN" ]]; then
  echo "Usage: npm run make-shop-glb -- <input.obj|glb|fbx> [output.glb]"
  echo ""
  echo "Beispiel (Shorts aus früherem Extract):"
  echo "  npm run make-shop-glb -- .tmp-shorts-sport/extracted/Shorts-Sport/obj/objShorts.obj public/models/shorts-white-v1.glb"
  echo ""
  echo "Beispiel (neues Mesh aus Downloads):"
  echo "  npm run make-shop-glb -- ~/Downloads/meine_hose.glb public/models/shorts-white-v1.glb"
  exit 1
fi

if ! command -v blender >/dev/null 2>&1; then
  echo "FEHLER: blender nicht gefunden"
  exit 1
fi
if ! command -v gltf-transform >/dev/null 2>&1; then
  echo "FEHLER: gltf-transform nicht gefunden (npm i -g @gltf-transform/cli)"
  exit 1
fi

TMPDIR_WORK="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_WORK"' EXIT
WHITE="$TMPDIR_WORK/white.glb"
OPT="$TMPDIR_WORK/opt.glb"

echo "=== 1/3 Blender: import → weiß → GLB ==="
blender --background --python scripts/export_glb.py -- "$IN" "$WHITE"
ls -lah "$WHITE"

echo "=== 2/3 gltf-transform optimize (OHNE simplify — Detail behalten) ==="
# WICHTIG: simplify false — sonst fliegt Detail vom teuren Mesh weg
gltf-transform optimize "$WHITE" "$OPT" \
  --compress false \
  --texture-compress false \
  --simplify false \
  --flatten true \
  --join true
ls -lah "$OPT"
gltf-transform inspect "$OPT" 2>/dev/null | head -35 || true

echo "=== 3/3 nach Shop-Pfad kopieren ==="
mkdir -p "$(dirname "$OUT")"
# Backup falls Ziel schon existiert
if [[ -f "$OUT" ]]; then
  BAK="public/models/library/inactive/$(basename "$OUT" .glb)-backup-$(date +%Y%m%d-%H%M%S).glb"
  mkdir -p public/models/library/inactive
  cp -f "$OUT" "$BAK"
  echo "Backup: $BAK"
fi
cp -f "$OPT" "$OUT"
ls -lah "$OUT"
echo ""
echo "FERTIG: $OUT"
echo "Nächste Schritte:"
echo "  1) npm run dev → http://localhost:3000/product/2 → Tab 360°"
echo "  2) Claude: Kamera getCamera('2') an bbox anpassen falls nötig"
echo "  3) Jonny: deploy"
