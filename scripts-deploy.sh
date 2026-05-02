#!/bin/bash

echo "🚀 PLATYPUS Deploy startet..."

npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build Fehler. Deploy gestoppt."
  exit 1
fi

git add .
git commit -m "production update"

npx vercel --prod

echo "✅ Deploy fertig:"
echo "https://platypus-shirt-shop.vercel.app"
