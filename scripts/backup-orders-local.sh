#!/bin/bash
echo "Backup der LocalStorage-Orders wird erstellt..."
cp .env.local .env.local.backup
echo "Env-Backup erstellt: .env.local.backup"
echo "Zum Export der LocalStorage-Orders:"
echo "Öffne /admin/orders und drücke F12 -> Console:"
echo "const orders = JSON.parse(localStorage.getItem('platypus_orders'));"
echo "console.log(JSON.stringify(orders, null, 2));"
