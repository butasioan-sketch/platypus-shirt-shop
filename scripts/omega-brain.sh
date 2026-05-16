#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "                 PLATYPUS OMEGA BRAIN"
  echo "========================================================="
  echo ""
  echo "1  - Unified Core"
  echo "2  - Ultimate Singularity"
  echo "3  - Absolute Core"
  echo "4  - Eternity Mode"
  echo "5  - Genesis"
  echo "6  - Infinity Core"
  echo "7  - Final Core"
  echo "8  - Overmind"
  echo "9  - Hive Mind"
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
      ./scripts/unified-core.sh
      ;;
    2)
      ./scripts/ultimate-singularity.sh
      ;;
    3)
      ./scripts/absolute-core.sh
      ;;
    4)
      ./scripts/eternity-mode.sh
      ;;
    5)
      ./scripts/genesis.sh
      ;;
    6)
      ./scripts/infinity-core.sh
      ;;
    7)
      ./scripts/final-core.sh
      ;;
    8)
      ./scripts/overmind.sh
      ;;
    9)
      ./scripts/hive-mind.sh
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
