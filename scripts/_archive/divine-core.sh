#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "                  PLATYPUS DIVINE CORE"
  echo "========================================================="
  echo ""
  echo "1  - Cosmos Core"
  echo "2  - Final Form"
  echo "3  - Omega Brain"
  echo "4  - Unified Core"
  echo "5  - Ultimate Singularity"
  echo "6  - Absolute Core"
  echo "7  - Eternity Mode"
  echo "8  - Genesis"
  echo "9  - Infinity Core"
  echo "10 - Build"
  echo "11 - Deploy"
  echo "12 - Quick Start"
  echo "13 - Localhost"
  echo "14 - Live Shop"
  echo "15 - Admin"
  echo "16 - Full Launch"
  echo "17 - Exit"
  echo ""

  read -p "Select Option: " option

  case $option in
    1)
      ./scripts/cosmos-core.sh
      ;;
    2)
      ./scripts/final-form.sh
      ;;
    3)
      ./scripts/omega-brain.sh
      ;;
    4)
      ./scripts/unified-core.sh
      ;;
    5)
      ./scripts/ultimate-singularity.sh
      ;;
    6)
      ./scripts/absolute-core.sh
      ;;
    7)
      ./scripts/eternity-mode.sh
      ;;
    8)
      ./scripts/genesis.sh
      ;;
    9)
      ./scripts/infinity-core.sh
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
      ./scripts/final-launch-sequence.sh
      ;;
    17)
      exit 0
      ;;
    *)
      echo "Invalid option"
      ;;
  esac

  echo ""
  read -p "Press ENTER to continue..."
done
