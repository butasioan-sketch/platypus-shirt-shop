#!/bin/bash
# ======================================================
# PLATYPUS Projekt-Steuerungsskript
# Zentrale Befehle für tägliche Arbeit
# ======================================================

case "$1" in
    status)
        git status --short
        ;;
    orders)
        ./scripts/orders-menu.sh
        ;;
    dev)
        npm run dev
        ;;
    build)
        npm run build
        ;;
    install)
        npm install
        ;;
    update)
        npm update
        ;;
    git-push)
        git add .
        git commit -m "${2:-update}" || true
        git push
        ;;
    clean)
        rm -rf node_modules .next package-lock.json
        echo "node_modules und .next entfernt"
        ;;
    check)
        echo "=== Projekt-Check ==="
        echo "Node: $(node -v 2>/dev/null || echo 'nicht gefunden')"
        echo "npm:  $(npm -v 2>/dev/null || echo 'nicht gefunden')"
        echo "Orders DB vorhanden: $([ -f orders.db ] && echo 'ja' || echo 'nein')"
        echo "Uncommitted Änderungen: $(git status --porcelain | wc -l)"
        ;;
    git-log)
        git log --oneline -10
        ;;
    code)
        code .
        ;;
    urls)
        echo "Live Shop: https://platypus-shirt-shop.vercel.app"
        echo "Admin:     https://platypus-shirt-shop.vercel.app/admin"
        ;;
    scripts)
        ./scripts/list-scripts.sh
        ;;
    start)
        ./scripts/project.sh check
        echo ""
        npm run dev
        ;;
    *)
        echo "Verfügbare Befehle:"
        echo "  status   | orders | dev | build | install | update"
        echo "  git-push | clean  | check | git-log | code | urls"
        echo "  scripts  | start"
        ;;
esac
