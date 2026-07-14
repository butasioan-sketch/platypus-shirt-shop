#!/bin/bash

BACKUP_DIR="backups/scripts_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

cp -r scripts/ "$BACKUP_DIR/"
echo "✅ Skripte gesichert nach: $BACKUP_DIR"
