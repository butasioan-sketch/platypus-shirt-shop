#!/bin/bash

echo "=== PLATYPUS Projektgröße ==="
echo ""
du -sh . 2>/dev/null
echo ""
echo "node_modules: $(du -sh node_modules 2>/dev/null || echo 'nicht vorhanden')"
echo ".next:        $(du -sh .next 2>/dev/null || echo 'nicht vorhanden')"
echo ""
echo "Tipp: ./scripts/project.sh clean  → um node_modules + .next zu löschen"
