#!/bin/bash

echo "=== Zuletzt geänderte eigene Skripte ==="
echo ""

ls -lt scripts/*.sh scripts/p scripts/git/*.sh 2>/dev/null | head -20
