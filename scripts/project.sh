#!/bin/bash

case "$1" in
    status) git status --short ;;
    orders) ./scripts/orders-menu.sh ;;
    dev) npm run dev ;;
    build) npm run build ;;
    install) npm install ;;
    update) npm update ;;
    git-push) git add . && git commit -m "${2:-update}" && git push ;;
    clean) rm -rf node_modules .next package-lock.json && echo "Cleaned" ;;
    check)
        echo "Node: $(node -v)"
        echo "npm: $(npm -v)"
        echo "Orders DB: $([ -f orders.db ] && echo yes || echo no)"
        echo "Uncommitted: $(git status --porcelain | wc -l)"
        ;;
    urls)
        echo "Live: https://platypus-shirt-shop.vercel.app"
        echo "Admin: https://platypus-shirt-shop.vercel.app/admin"
        ;;
    *)
        echo "Befehle: status | orders | dev | build | install | check | urls | clean"
        ;;
esac
