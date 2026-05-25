#!/bin/bash
echo "=== PLATYPUS Eigene Bash-Skripte ==="
echo ""
echo "Order System:"
ls scripts/orders-*.sh scripts/simulate-*.sh 2>/dev/null | sort

echo ""
echo "Git Helper:"
ls scripts/git/*.sh 2>/dev/null | sort

echo ""
echo "Project Control:"
ls scripts/project.sh scripts/list-scripts.sh 2>/dev/null
