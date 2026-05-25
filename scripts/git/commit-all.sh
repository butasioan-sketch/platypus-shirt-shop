#!/bin/bash
git add .
git commit -m "${1:-update order tools}"
git push
echo "✅ Alles committed und gepusht"
