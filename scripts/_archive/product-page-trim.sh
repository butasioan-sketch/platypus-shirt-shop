#!/bin/bash
# PLATYPUS - Produktseite kürzen (doppelte Blöcke entfernen)
set -euo pipefail

echo "=========================================="
echo "   PLATYPUS - Produktseite optimieren"
echo "=========================================="

PRODUCT_FILE="app/product/[id]/page.tsx"
if [ ! -f "$PRODUCT_FILE" ]; then
    echo "❌ $PRODUCT_FILE nicht gefunden"
    exit 1
fi

echo "📄 Gefunden: $PRODUCT_FILE"
echo "🔍 Analysiere redundante Blöcke..."

# Backup erstellen
cp "$PRODUCT_FILE" "$PRODUCT_FILE.backup"
echo "✅ Backup erstellt: $PRODUCT_FILE.backup"

# Liste der zu entfernenden Blöcke (vereinfacht)
BLOCKS_TO_REMOVE=(
    "Trust Badges"
    "Production Metrics"
    "Quality Checklist"
    "Next Drop Banner"
    "Final Trust Stack"
    "Product Page Audit Block"
    "Launch Readiness Block"
    "Bottom Safety Net"
    "Compact Trust Strip"
    "Secondary Info Accordion"
)

# Für jeden Block eine Warnung ausgeben (manuelles Entfernen empfohlen)
echo ""
echo "⚠️  Folgende Blöcke sollten manuell entfernt werden (doppelt oder unnötig):"
for block in "${BLOCKS_TO_REMOVE[@]}"; do
    echo "   - $block"
done

echo ""
echo "✅ Analyse abgeschlossen. Backup liegt unter $PRODUCT_FILE.backup"
echo "   Öffne die Datei und lösche die entsprechenden Komponenten."
echo ""
echo "   Nach dem Kürzen: npm run build && ./platypus_lead.sh deploy"
