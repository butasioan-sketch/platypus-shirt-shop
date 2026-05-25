#!/bin/bash
DB_FILE="orders.db"

EMAIL="$1"
AMOUNT_CENTS="$2"
CURRENCY="${3:-EUR}"
SESSION_ID="${4:-manual_$(date +%s)}"

if [ -z "$EMAIL" ] || [ -z "$AMOUNT_CENTS" ]; then
    echo "Usage: $0 <email> <amount_in_cents> [currency] [session_id]"
    exit 1
fi

AMOUNT=$(echo "scale=2; $AMOUNT_CENTS / 100" | bc)
ORDER_NUMBER="ORD-$(date +%Y%m%d%H%M%S)"

sqlite3 "$DB_FILE" "
INSERT INTO orders 
(order_number, customer_name, customer_email, items, total_amount, currency, status)
VALUES 
('$ORDER_NUMBER', 'Online Customer', '$EMAIL', 'Stripe Checkout Order', $AMOUNT, '$CURRENCY', 'paid');
"

echo "✅ Order erstellt: $ORDER_NUMBER"
echo "Email: $EMAIL | Betrag: $AMOUNT $CURRENCY | Status: paid"
