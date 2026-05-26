#!/bin/bash
echo "=== PLATYPUS Status ==="
echo ""
echo "Git:"
git status --short
echo ""
echo "Letzter Commit:"
git log -1 --oneline
echo ""
echo "Vercel Prozess läuft:"
ps aux | grep vercel | grep -v grep || echo "Kein Vercel Prozess aktiv"
