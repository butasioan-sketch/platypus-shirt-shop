#!/bin/bash
echo "════════════════════════════════════════════════════════════"
echo " PLATYPUS Git & Vercel Diagnose"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "1. Remote URL:"
git remote -v

echo ""
echo "2. Aktueller Branch:"
git branch --show-current

echo ""
echo "3. Letzter Commit:"
git log -1 --oneline

echo ""
echo "4. Push Test:"
git push --dry-run 2>&1 | head -5

echo ""
echo "════════════════════════════════════════════════════════════"
