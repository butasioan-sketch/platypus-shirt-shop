#!/bin/bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/config/settings.cfg"

CYAN='\033[0;36m'
GREEN='\033[0;32m'
NC='\033[0m'
log() { echo -e "${CYAN}[PLATYPUS]${NC} $1"; }

case "${1:-help}" in
    status)    npm run build ;;
    deploy)    log "Deploy wird gestartet..." && npx vercel --prod ;;
    health)    echo "Healthcheck läuft..." ;;
    *)         echo "Verwendung: status | deploy | health" ;;
esac
