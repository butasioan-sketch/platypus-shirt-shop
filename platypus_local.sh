#!/bin/bash
cd ~/Schreibtisch/platypus-shirt-shop

case "$1" in
  start)
    echo "🚀 Starte lokalen Dev-Server..."
    npm run dev
    ;;
  build)
    echo "🔨 Lokaler Build..."
    npm run build
    ;;
  test-webhook)
    echo "🧪 Teste Webhook lokal..."
    ./scripts/local-webhook-test.sh
    ;;
  env)
    echo "📊 Environment prüfen..."
    ./scripts/env-complete-check.sh
    ;;
  *)
    echo "Verwendung: ./platypus_local.sh [start|build|test-webhook|env]"
    ;;
esac
