#!/bin/bash
git add .
git commit -m "update: $(date '+%H:%M')" || true
vercel --prod
