#!/bin/bash
echo "Neue Environment Variable hinzufügen"
echo ""
read -p "Name der Variable: " VAR_NAME
vercel env add "$VAR_NAME"
