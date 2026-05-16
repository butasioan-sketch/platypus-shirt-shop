#!/bin/bash

set -e

echo "========================================="
echo " PLATYPUS PRODUCTION MODE"
echo "========================================="

echo ""
echo "1. Build"
npm run build

echo ""
echo "2. Deploy"
./scripts-deploy.sh

echo ""
echo "3. Live URL"
echo "https://platypus-shirt-shop.vercel.app"
