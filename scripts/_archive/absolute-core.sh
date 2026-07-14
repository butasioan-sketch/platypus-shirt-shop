#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "                PLATYPUS ABSOLUTE CORE"
  echo "========================================================="
  echo ""
  echo "1  - Genesis"
  echo "2  - Infinity Core"
  echo "3  - Final Core"
  echo "4  - Overmind"
  echo "5  - Hive Mind"
  echo "6  - Transcendence Mode"
  echo "7  - Omniscience Mode"
  echo "8  - Omega Mode"
  echo "9  - Neural Core"
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
      ./scripts/genesis.sh
      ;;
    2)
      ./scripts/infinity-core.sh
      ;;
    3)
      ./scripts/final-core.sh
      ;;
    4)
      ./scripts/overmind.sh
      ;;
    5)
      ./scripts/hive-mind.sh
      ;;
    6)
      ./scripts/transcendence-mode.sh
      ;;
    7)
      ./scripts/omniscience-mode.sh
      ;;
    8)
      ./scripts/omega-mode.sh
      ;;
    9)
      ./scripts/neural-core.sh
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
