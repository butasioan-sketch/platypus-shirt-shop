#!/bin/bash
URL="https://platypus-shirt-shop-c438468q9-butasioan-sketchs-projects.vercel.app"
echo "Öffne: $URL"
open "$URL" 2>/dev/null || xdg-open "$URL" 2>/dev/null || echo "Bitte manuell öffnen: $URL"
