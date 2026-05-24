#!/bin/bash

while true; do
    clear
    echo "══════════════════════════════════════════════"
    echo "     PLATYPUS ORDERS - TERMINAL ADMIN"
    echo "══════════════════════════════════════════════"
    echo ""
    echo "  1) Alle Orders          10) JSON Export"
    echo "  2) Pending Orders       11) Backup"
    echo "  3) Nach Status filtern  12) Neue Order anlegen"
    echo "  4) Letzte Orders        13) Webhook simulieren"
    echo "  5) Order suchen         14) Testdaten generieren"
    echo "  6) Order Details        15) Datenbank zurücksetzen"
    echo "  7) Status ändern        16) Heutiger Umsatz"
    echo "  8) Stats                17) Hilfe"
    echo "  9) CSV Export"
    echo ""
    echo "  0) Beenden"
    echo ""
    read -p "Auswahl: " choice

    case $choice in
        1) ./scripts/orders-list.sh ;;
        2) ./scripts/orders-pending.sh ;;
        3) read -p "Status: " st && ./scripts/orders-by-status.sh "$st" ;;
        4) ./scripts/orders-recent.sh ;;
        5) read -p "Suchbegriff: " s && ./scripts/orders-search.sh "$s" ;;
        6) read -p "Order ID: " id && ./scripts/orders-show.sh "$id" ;;
        7) read -p "Order ID: " id; read -p "Neuer Status: " st && ./scripts/orders-change-status.sh "$id" "$st" ;;
        8) ./scripts/orders-stats.sh ;;
        9) ./scripts/orders-export-csv.sh ;;
        10) ./scripts/orders-to-json.sh ;;
        11) ./scripts/orders-backup.sh ;;
        12)
            read -p "Name: " n; read -p "Email: " e
            read -p "Betrag: " b; read -p "Items: " i
            ./scripts/orders-add.sh "$n" "$e" "$b" "$i"
            ;;
        13) ./scripts/simulate-stripe-webhook.sh ;;
        14) ./scripts/orders-seed.sh ;;
        15) ./scripts/orders-reset.sh ;;
        16) ./scripts/orders-today.sh ;;
        17) ./scripts/orders-help.sh ;;
        0) echo "Tschüss."; exit 0 ;;
        *) echo "Ungültig." ;;
    esac

    echo ""
    read -p "Enter drücken..."
done
