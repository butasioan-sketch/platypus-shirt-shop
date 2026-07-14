#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "           PLATYPUS - GESAMT STATUS"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "📁 PROJECT"
./scripts/project.sh check
echo ""

echo "📦 ORDERS"
./scripts/dashboard.sh
echo ""

echo "════════════════════════════════════════════════════════════"
