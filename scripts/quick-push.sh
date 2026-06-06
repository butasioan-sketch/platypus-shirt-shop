#!/bin/bash
git add .
git commit -m "update: $(date '+%H:%M')" || true
git push 2>&1 || echo "Push fehlgeschlagen (normal bei aktuellem Git-Problem)"
