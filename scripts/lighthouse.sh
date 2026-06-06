#!/bin/bash

JSON_ONLY=false

if [[ "$1" == "--json" ]]; then
    JSON_ONLY=true
fi

echo "════════════════════════════════════════════════════════════"
echo " Lighthouse Audit"
echo "════════════════════════════════════════════════════════════"
echo ""

if ! command -v lighthouse &> /dev/null; then
    npm install -g lighthouse
fi

read -p "URL eingeben: " URL

if [ "$JSON_ONLY" = true ]; then
    lighthouse "$URL" --output json --output-path ./lighthouse-report.json
    echo "✅ JSON Report erstellt: lighthouse-report.json"
else
    lighthouse "$URL" --output json --output html \
        --output-path ./lighthouse-report
    echo "✅ Reports erstellt:"
    echo "   - lighthouse-report.json"
    echo "   - lighthouse-report.html"
fi

echo "════════════════════════════════════════════════════════════"
