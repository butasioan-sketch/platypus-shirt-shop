#!/bin/bash

clear

echo "========================================="
echo " PLATYPUS QUICK START"
echo "========================================="

cd ~/Schreibtisch/platypus-shirt-shop

xdg-open http://localhost:3000 || true

npm run dev
