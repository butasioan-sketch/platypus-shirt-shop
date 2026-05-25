#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "           PLATYPUS HEALTH CHECK"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "🔧 PROJECT"
./scripts/project.sh check
echo ""

echo "📦 ORDERS"
./scripts/dashboard.sh | head -10
echo ""

echo "📁 GIT"
./scripts/git/overview.sh
echo ""

echo "════════════════════════════════════════════════════════════"
echo "✅ Health Check abgeschlossen"
echo "════════════════════════════════════════════════════════════"
