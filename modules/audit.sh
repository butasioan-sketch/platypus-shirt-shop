#!/bin/bash
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"
run_audit() {
  npm run build > /dev/null 2>&1 && echo "OK Build" || echo "FAIL Build"
  [ -f "$PROJECT_DIR/middleware.ts" ] && echo "OK middleware" || echo "FEHLT middleware"
  curl -s -o /dev/null -w "Live: %{http_code}" "$SHOP_URL"
  echo ""
}
