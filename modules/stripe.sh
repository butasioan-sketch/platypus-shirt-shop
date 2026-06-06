#!/bin/bash
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"
test_connection() {
  RESP=$(curl -s -X POST "$SHOP_URL/api/payments/create-checkout" \
    -H "Content-Type: application/json" \
    -d '{"paymentMethod":"card","reference":"test","shipping":4.99,"total":34.98,"items":[{"name":"Test","size":"M","price":29.99,"quantity":1}]}')
  echo "$RESP" | grep -q "stripe_checkout_created" && echo "OK Stripe aktiv" || echo "FAIL Stripe Problem"
}
webhook_setup() {
  echo "Webhook URL: $SHOP_URL/api/webhooks/stripe"
  echo "Event: checkout.session.completed"
}
