#!/bin/bash

echo "=== Uncommitted eigene Skripte ==="
echo ""

git status --porcelain | grep "^??" | grep "scripts/" | while read status file; do
    echo "$file"
done

echo ""
echo "Tipp: ./scripts/git/save-work.sh um alles zu committen"
