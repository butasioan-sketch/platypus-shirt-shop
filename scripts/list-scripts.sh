#!/bin/bash
echo "=== PLATYPUS — Aktive Scripts ==="
echo "(Vollstaendige Liste: scripts/ACTIVE_SCRIPTS.txt)"
echo ""
while IFS= read -r line; do
  [[ "$line" =~ ^# ]] && continue
  [[ -z "$line" ]] && continue
  if [ -f "scripts/$line" ] || [ -f "scripts/${line%.mjs}.mjs" ]; then
    echo "  scripts/$line"
  fi
done < scripts/ACTIVE_SCRIPTS.txt
echo ""
ARCHIVED=$(find scripts/_archive -maxdepth 1 -name '*.sh' 2>/dev/null | wc -l)
echo "Archiviert: $ARCHIVED Scripts in scripts/_archive/"