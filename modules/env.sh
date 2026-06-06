#!/bin/bash
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"
check_environment() {
  for VAR in STRIPE_SECRET_KEY NEXT_PUBLIC_SITE_URL ADMIN_PASSWORD STRIPE_WEBHOOK_SECRET; do
    grep -q "^${VAR}=" "$PROJECT_DIR/.env.local" 2>/dev/null && echo "OK $VAR" || echo "FEHLT $VAR"
  done
}
