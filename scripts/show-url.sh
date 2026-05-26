#!/bin/bash
echo "Letzte Production URL:"
grep -o 'https://.*\.vercel\.app' ~/.vercel/project.json 2>/dev/null || echo "Noch keine URL gefunden"
