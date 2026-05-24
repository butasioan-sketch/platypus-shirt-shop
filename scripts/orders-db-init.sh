#!/bin/bash
set -e
DB_FILE="orders.db"

sqlite3 "$DB_FILE" <<SQL
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE,
    customer_name TEXT,
    customer_email TEXT,
    items TEXT,
    total_amount REAL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_status ON orders(status);
SQL

echo "✅ Datenbank + Tabelle sind sauber."
