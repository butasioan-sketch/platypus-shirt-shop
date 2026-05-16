#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "                  PLATYPUS COSMOS CORE"
  echo "========================================================="
  echo ""
  echo "1  - Omega Brain"
  echo "2  - Final Form"
  echo "3  - Unified Core"
  echo "4  - Ultimate Singularity"
  echo "5  - Absolute Core"
  echo "6  - Eternity Mode"
  echo "7  - Genesis"
  echo "8  - Infinity Core"
  echo "9  - Final Core"
  echo "10 - Build"
  echo "11 - Deploy"
  echo "12 - Quick Start"
  echo "13 - Localhost"
  echo "14 - Live Shop"
  echo "15 - Admin"
  echo "16 - Exit"
  echo ""

  read -p "Select Option: " option

  case $option in
    1)
      ./scripts/omega-brain.sh
      ;;
    2)
      ./scripts/final-form.sh
      ;;
    3)
      ./scripts/unified-core.sh
      ;;
    4)
      ./scripts/ultimate-singularity.sh
      ;;
    5)
      ./scripts/absolute-core.sh
      ;;
    6)
      ./scripts/eternity-mode.sh
      ;;
    7)
      ./scripts/genesis.sh
      ;;
    8)
      ./scripts/infinity-core.sh
      ;;
    9)
      ./scripts/final-core.sh
      ;;
    10)
      npm run build
      ;;
    11)
      ./scripts-deploy.sh
      ;;
    12)
      ./scripts/quick-start.sh
      ;;
    13)
      xdg-open http://localhost:3000
      ;;
    14)
      xdg-open https://platypus-shirt-shop.vercel.app
      ;;
    15)
      xdg-open https://platypus-shirt-shop.vercel.app/admin
      ;;
    16)
      exit 0
      ;;
    *)
      echo "Invalid option"
      ;;
  esac

  echo ""
  read -p "Press ENTER to continue..."
done
