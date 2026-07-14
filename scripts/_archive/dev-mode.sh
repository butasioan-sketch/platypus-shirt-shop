#!/bin/bash

set -e

echo "========================================="
echo " PLATYPUS DEV MODE"
echo "========================================="

echo ""
echo "1. Git Status"
git status

echo ""
echo "2. Installing Dependencies"
npm install

echo ""
echo "3. Starting Local Dev Server"
echo "URL: http://localhost:3000"
echo ""

npm run dev
