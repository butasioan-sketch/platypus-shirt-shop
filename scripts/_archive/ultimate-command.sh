#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "               PLATYPUS ULTIMATE COMMAND"
  echo "========================================================="
  echo ""
  echo "1  - Divine Core"
  echo "2  - Hyper Launch"
  echo "3  - Cosmos Core"
  echo "4  - Final Form"
  echo "5  - Omega Brain"
  echo "6  - Unified Core"
  echo "7  - Genesis"
  echo "8  - Infinity Core"
  echo "9  - Build"
  echo "10 - Deploy"
  echo "11 - Full Launch Sequence"
  echo "12 - Quick Start"
  echo "13 - Localhost"
  echo "14 - Live Shop"
  echo "15 - Admin"
  echo "16 - Shop Report"
  echo "17 - Exit"
  echo ""

  read -p "Select Option: " option

  case $option in
    1)
      ./scripts/divine-core.sh
      ;;
    2)
      ./scripts/hyper-launch.sh
      ;;
    3)
      ./scripts/cosmos-core.sh
      ;;
    4)
      ./scripts/final-form.sh
      ;;
    5)
      ./scripts/omega-brain.sh
      ;;
    6)
      ./scripts/unified-core.sh
      ;;
    7)
      ./scripts/genesis.sh
      ;;
    8)
      ./scripts/infinity-core.sh
      ;;
    9)
      npm run build
      ;;
    10)
      ./scripts-deploy.sh
      ;;
    11)
      ./scripts/final-launch-sequence.sh
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
      ./scripts/shop-report.sh
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
