#!/bin/bash
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"
run_healthcheck() {
  for route in "/" "/product/1" "/cart" "/admin" "/admin/orders"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$SHOP_URL$route")
    echo "$STATUS $route"
  done
}
