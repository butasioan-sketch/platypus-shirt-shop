#!/bin/bash
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"
log() { echo "[ADMIN] $1"; }
check_status() {
  [ -f "$PROJECT_DIR/middleware.ts" ] && echo "OK middleware.ts" || echo "FEHLT middleware.ts"
  grep -q "ADMIN_PASSWORD" "$PROJECT_DIR/.env.local" 2>/dev/null && echo "OK ADMIN_PASSWORD" || echo "FEHLT ADMIN_PASSWORD"
}
setup_password() {
  read -sp "Admin Passwort: " pw; echo ""
  echo "ADMIN_PASSWORD=$pw" >> "$PROJECT_DIR/.env.local"
  echo "OK Passwort gespeichert"
}
