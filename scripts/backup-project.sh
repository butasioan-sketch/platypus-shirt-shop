#!/bin/bash

set -e

PROJECT_DIR="$HOME/Schreibtisch/platypus-shirt-shop"
BACKUP_DIR="$HOME/Schreibtisch/platypus-backups"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/platypus-shirt-shop_$DATE.tar.gz"

mkdir -p "$BACKUP_DIR"

cd "$PROJECT_DIR"

tar \
  --exclude="node_modules" \
  --exclude=".next" \
  --exclude=".vercel" \
  --exclude=".git" \
  -czf "$BACKUP_FILE" .

echo "✅ Backup erstellt:"
echo "$BACKUP_FILE"
