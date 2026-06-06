#!/bin/bash
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"
run_deploy() {
  cd "$PROJECT_DIR"
  git add .
  git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" || true
  git push || true
  npx vercel --prod
}
