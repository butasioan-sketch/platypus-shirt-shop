#!/bin/bash
DB_FILE="orders.db"

NAME="${1:-Test User}"
EMAIL="${2:-test@platypus.local}"
BETRAG="${3:-49.90}"
ITEMS="${4:-PLATYPUS Shirt}"

./scripts/orders-add.sh "$NAME" "$EMAIL" "$BETRAG" "$ITEMS"
./scripts/orders-list.sh
