#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "                  PLATYPUS FINAL CORE"
  echo "========================================================="
  echo ""
  echo "1  - Overmind"
  echo "2  - Omniscience Mode"
  echo "3  - Hive Mind"
  echo "4  - Transcendence Mode"
  echo "5  - Core AI"
  echo "6  - Ascension Mode"
  echo "7  - Neural Core"
  echo "8  - Singularity Mode"
  echo "9  - Omega Mode"
  echo "10 - Infinite Builder"
  echo "11 - Build"
  echo "12 - Deploy"
  echo "13 - Localhost"
  echo "14 - Live Shop"
  echo "15 - Admin"
  echo "16 - Exit"
  echo ""

  read -p "Select Option: " option

  case $option in
    1)
      ./scripts/overmind.sh
      ;;
    2)
      ./scripts/omniscience-mode.sh
      ;;
    3)
      ./scripts/hive-mind.sh
      ;;
    4)
      ./scripts/transcendence-mode.sh
      ;;
    5)
      ./scripts/core-ai.sh
      ;;
    6)
      ./scripts/ascension-mode.sh
      ;;
    7)
      ./scripts/neural-core.sh
      ;;
    8)
      ./scripts/singularity-mode.sh
      ;;
    9)
      ./scripts/omega-mode.sh
      ;;
    10)
      ./scripts/infinite-builder.sh
      ;;
    11)
      npm run build
      ;;
    12)
      ./scripts-deploy.sh
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
