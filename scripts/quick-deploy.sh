#!/bin/bash
git add .
git commit -m "deploy: $(date '+%H:%M')" || true
vercel --prod
