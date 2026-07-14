#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "                  PLATYPUS OVERMIND"
  echo "========================================================="
  echo ""
  echo "1  - Hive Mind"
  echo "2  - Transcendence Mode"
  echo "3  - Core AI"
  echo "4  - Ascension Mode"
  echo "5  - Neural Core"
  echo "6  - Singularity Mode"
  echo "7  - Omega Mode"
  echo "8  - Infinite Builder"
  echo "9  - God Mode"
  echo "10 - Empire Mode"
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
      ./scripts/hive-mind.sh
      ;;
    2)
      ./scripts/transcendence-mode.sh
      ;;
    3)
      ./scripts/core-ai.sh
      ;;
    4)
      ./scripts/ascension-mode.sh
      ;;
    5)
      ./scripts/neural-core.sh
      ;;
    6)
      ./scripts/singularity-mode.sh
      ;;
    7)
      ./scripts/omega-mode.sh
      ;;
    8)
      ./scripts/infinite-builder.sh
      ;;
    9)
      ./scripts/god-mode.sh
      ;;
    10)
      ./scripts/empire-mode.sh
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
