#!/bin/bash

echo "=== Aktuellen Stand sichern ==="
git status --short

echo ""
read -p "Commit Nachricht eingeben (oder Enter für Standard): " msg

if [ -z "$msg" ]; then
    msg="update: order tools and project scripts"
fi

git add .
git commit -m "$msg"
echo "✅ Commit erstellt: $msg"

read -p "Jetzt pushen? (j/n): " push
if [ "$push" = "j" ]; then
    git push
    echo "✅ Gepusht"
fi
