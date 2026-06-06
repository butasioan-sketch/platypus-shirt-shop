#!/bin/bash
# PLATYPUS Backup Module
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"

log() { echo "[BACKUP] $(date +%Y-%m-%d_%H:%M:%S) - $1"; }

run_backup() {
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_dir="$BACKUPPATH/$timestamp"
    mkdir -p "$backup_dir"
    
    echo "📦 Backup wird erstellt in: $backup_dir"
    
    # Wichtige Dateien sichern
    cp "$PROJECT_DIR/.env.local" "$backup_dir/" 2>/dev/null || echo "⚠️  Kein .env.local"
    cp "$PROJECT_DIR/middleware.ts" "$backup_dir/" 2>/dev/null || echo "⚠️  Keine middleware.ts"
    cp "$PROJECT_DIR/platypus_lead.sh" "$backup_dir/" 2>/dev/null || echo "⚠️  Kein platypus_lead.sh"
    cp -r "$PROJECT_DIR/config" "$backup_dir/" 2>/dev/null || echo "⚠️  Kein config/"
    cp -r "$PROJECT_DIR/modules" "$backup_dir/" 2>/dev/null || echo "⚠️  Kein modules/"
    
    echo "✅ Backup abgeschlossen: $backup_dir"
    log "Backup erfolgreich gespeichert."
}

# Wenn das Skript direkt ausgeführt wird
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    run_backup
fi
