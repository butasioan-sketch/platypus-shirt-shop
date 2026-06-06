#!/bin/bash
cd ~/Schreibtisch/platypus-shirt-shop
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{
    "id": "evt_test_123",
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_123",
        "customer_email": "test@platypus.de",
        "amount_total": 2999
      }
    }
  }'
