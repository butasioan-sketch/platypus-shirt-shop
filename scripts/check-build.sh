#!/bin/bash
echo "=== Vercel Build Status ==="
ps aux | grep -E 'vercel' | grep -v grep || echo "Kein aktiver Build-Prozess"
