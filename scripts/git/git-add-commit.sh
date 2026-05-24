#!/bin/bash
if [ -z "$1" ]; then
    echo "Usage: $0 \"Commit Nachricht\""
    exit 1
fi
git add .
git commit -m "$1"
echo "✅ Commit erstellt: $1"
