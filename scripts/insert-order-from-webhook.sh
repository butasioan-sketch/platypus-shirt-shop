#!/bin/bash
DB_FILE="orders.db"

if [ "$#" -lt 4 ]; then
    echo "Usage: $0 <email> <amount_in_cents> <currency> <session_id>"
    echo "Beispiel: $0 test@test.de 5990 EUR cs_test_12345"
    exit 1
fi

EMAIL="$1"
AMOUNT_CENTS="$2"
CURRENCY="$3"
SESSION_ID="$4"

AMOUNT_EUR=$(echo "scale=2; $AMOUNT_CENTS / 100" | bc)

ORDER_NUMBER="ORD-WH-$(date +%Y%m%d%H%M%S)"

sqlite3 "$DB_FILE" "
INSERT INTO orders (order_number, customer_name, customer_email, items, total_amount, currency, status)
VALUES ('$ORDER_NUMBER', 'Stripe Customer', '$EMAIL', 'Stripe Checkout', $AMOUNT_EUR, '$CURRENCY', 'paid');
"

echo "✅ Order aus Webhook angelegt: $ORDER_NUMBER"
echo "Email: $EMAIL | Betrag: $AMOUNT_EUR $CURRENCY | Status: paid"
