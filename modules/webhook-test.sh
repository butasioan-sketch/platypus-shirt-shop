#!/bin/bash
# PLATYPUS - Stripe Webhook Test Module
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"

log() { echo "[WEBHOOK] $(date +%Y-%m-%d_%H:%M:%S) - $1"; }

test_webhook() {
    log "Teste Stripe Webhook Endpoint..."
    
    # Simuliere ein Stripe Event (checkout.session.completed)
    local webhook_url="${SHOP_URL}/api/webhooks/stripe"
    local payload='{
        "id": "evt_test_123",
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "id": "cs_test_123",
                "customer_email": "test@example.com",
                "amount_total": 2999,
                "metadata": {
                    "order_id": "test_order_1"
                }
            }
        }
    }'

    echo "📤 Sende Test-Webhook an: $webhook_url"
    
    local response=$(curl -s -X POST "$webhook_url" \
        -H "Content-Type: application/json" \
        -d "$payload")

    if echo "$response" | grep -q "received"; then
        echo "✅ Webhook-Endpoint antwortet korrekt"
        log "Webhook-Test erfolgreich"
    else
        echo "❌ Webhook-Endpoint antwortet nicht korrekt"
        echo "Antwort: $response"
        log "Webhook-Test fehlgeschlagen"
        return 1
    fi
}

# Exportiere Funktion für das Hauptskript
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    test_webhook
fi
