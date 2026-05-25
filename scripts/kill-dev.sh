#!/bin/bash

echo "Suche nach laufenden Next.js / npm dev Prozessen..."

pkill -f "next dev" 2>/dev/null && echo "✅ next dev gestoppt"
pkill -f "npm run dev" 2>/dev/null && echo "✅ npm run dev gestoppt"

echo "Fertig."
