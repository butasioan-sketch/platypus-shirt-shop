#!/bin/bash
echo "=== GIT STATUS ==="
git status
echo ""
echo "=== LETZTE 5 COMMITS ==="
git log --oneline -5
