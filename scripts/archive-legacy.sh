#!/bin/bash
# Verschiebt inaktive Script-Experimente nach scripts/_archive/
set -euo pipefail
cd "$(dirname "$0")"
ARCHIVE="_archive"
mkdir -p "$ARCHIVE"

ACTIVE_FILE="ACTIVE_SCRIPTS.txt"
mapfile -t ACTIVE < <(grep -v '^#' "$ACTIVE_FILE" | grep -v '^$' | sed 's/\r$//')

is_active() {
  local base="$1"
  for a in "${ACTIVE[@]}"; do
    [ "$base" = "$a" ] && return 0
  done
  return 1
}

MOVED=0
for f in *.sh; do
  [ -f "$f" ] || continue
  is_active "$f" && continue
  mv "$f" "$ARCHIVE/"
  MOVED=$((MOVED + 1))
done

echo ">>> $MOVED Scripts nach scripts/_archive/ verschoben"
echo ">>> Aktiv: $(wc -l < <(grep -v '^#' "$ACTIVE_FILE" | grep -v '^$')) Scripts"