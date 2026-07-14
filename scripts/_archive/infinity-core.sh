#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "                 PLATYPUS INFINITY CORE"
  echo "========================================================="
  echo ""
  echo "1  - Final Core"
  echo "2  - Omniscience Mode"
  echo "3  - Overmind"
  echo "4  - Hive Mind"
  echo "5  - Transcendence Mode"
  echo "6  - Core AI"
  echo "7  - Ascension Mode"
  echo "8  - Neural Core"
  echo "9  - Singularity Mode"
  echo "10 - Omega Mode"
  echo "11 - Build"
  echo "12 - Deploy"
  echo "13 - Quick Start"
  echo "14 - Localhost"
  echo "15 - Live Shop"
  echo "16 - Admin"
  echo "17 - Exit"
  echo ""

  read -p "Select Option: " option

  case $option in
    1)
      ./scripts/final-core.sh
      ;;
    2)
      ./scripts/omniscience-mode.sh
      ;;
    3)
      ./scripts/overmind.sh
      ;;
    4)
      ./scripts/hive-mind.sh
      ;;
    5)
      ./scripts/transcendence-mode.sh
      ;;
    6)
      ./scripts/core-ai.sh
      ;;
    7)
      ./scripts/ascension-mode.sh
      ;;
    8)
      ./scripts/neural-core.sh
      ;;
    9)
      ./scripts/singularity-mode.sh
      ;;
    10)
      ./scripts/omega-mode.sh
      ;;
    11)
      npm run build
      ;;
    12)
      ./scripts-deploy.sh
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
      exit 0
      ;;
    *)
      echo "Invalid option"
      ;;
  esac

  echo ""
  read -p "Press ENTER to continue..."
done
