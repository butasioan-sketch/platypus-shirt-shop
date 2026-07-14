#!/bin/bash
echo "Aktuelle Production URL:"
vercel inspect --prod 2>/dev/null | grep -o 'https://.*\.vercel\.app' | head -1 || echo "Noch keine URL"
