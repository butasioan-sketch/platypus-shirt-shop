#!/bin/bash
DB_FILE="orders.db"
BACKUP_DIR="backups"
mkdir -p "$BACKUP_DIR"

BACKUP_FILE="$BACKUP_DIR/orders_$(date +%Y%m%d_%H%M%S).db"

cp "$DB_FILE" "$BACKUP_FILE"
echo "✅ Backup erstellt: $BACKUP_FILE"
