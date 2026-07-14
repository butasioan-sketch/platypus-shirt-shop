#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "                 PLATYPUS SUPREME CORE"
  echo "========================================================="
  echo ""
  echo "1  - Ultimate Command"
  echo "2  - Launch Everything"
  echo "3  - Divine Core"
  echo "4  - Hyper Launch"
  echo "5  - Cosmos Core"
  echo "6  - Final Form"
  echo "7  - Omega Brain"
  echo "8  - Unified Core"
  echo "9  - Genesis"
  echo "10 - Build"
  echo "11 - Deploy"
  echo "12 - Full Launch Sequence"
  echo "13 - Quick Start"
  echo "14 - Localhost"
  echo "15 - Live Shop"
  echo "16 - Admin"
  echo "17 - Shop Report"
  echo "18 - Exit"
  echo ""

  read -p "Select Option: " option

  case $option in
    1)
      ./scripts/ultimate-command.sh
      ;;
    2)
      ./scripts/launch-everything.sh
      ;;
    3)
      ./scripts/divine-core.sh
      ;;
    4)
      ./scripts/hyper-launch.sh
      ;;
    5)
      ./scripts/cosmos-core.sh
      ;;
    6)
      ./scripts/final-form.sh
      ;;
    7)
      ./scripts/omega-brain.sh
      ;;
    8)
      ./scripts/unified-core.sh
      ;;
    9)
      ./scripts/genesis.sh
      ;;
    10)
      npm run build
      ;;
    11)
      ./scripts-deploy.sh
      ;;
    12)
      ./scripts/final-launch-sequence.sh
      ;;
    13)
      ./scripts/quick-start.sh
      ;;
    14)
      xdg-open http://localhost:3000
      ;;
    15)
      xdg-open https://platypus-shirt-shop.vercel.app
      ;;
    16)
      xdg-open https://platypus-shirt-shop.vercel.app/admin
      ;;
    17)
      ./scripts/shop-report.sh
      ;;
    18)
      exit 0
      ;;
    *)
      echo "Invalid option"
      ;;
  esac

  echo ""
  read -p "Press ENTER to continue..."
done
