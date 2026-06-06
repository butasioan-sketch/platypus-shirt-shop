#!/bin/bash
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/settings.cfg"
report() {
  echo "Orders Admin: $SHOP_URL/admin/orders"
  echo "Persistenz: LocalStorage (Supabase geplant)"
}
