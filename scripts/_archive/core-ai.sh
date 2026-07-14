#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "                    PLATYPUS CORE AI"
  echo "========================================================="
  echo ""
  echo "1  - Neural Core"
  echo "2  - Ascension Mode"
  echo "3  - Singularity Mode"
  echo "4  - Omega Mode"
  echo "5  - Infinite Builder"
  echo "6  - God Mode"
  echo "7  - Empire Mode"
  echo "8  - World Domination"
  echo "9  - Auto Pilot"
  echo "10 - Build"
  echo "11 - Deploy"
  echo "12 - Localhost"
  echo "13 - Live Shop"
  echo "14 - Admin"
  echo "15 - Exit"
  echo ""

  read -p "Select Option: " option

  case $option in
    1)
      ./scripts/neural-core.sh
      ;;
    2)
      ./scripts/ascension-mode.sh
      ;;
    3)
      ./scripts/singularity-mode.sh
      ;;
    4)
      ./scripts/omega-mode.sh
      ;;
    5)
      ./scripts/infinite-builder.sh
      ;;
    6)
      ./scripts/god-mode.sh
      ;;
    7)
      ./scripts/empire-mode.sh
      ;;
    8)
      ./scripts/world-domination.sh
      ;;
    9)
      ./scripts/auto-pilot.sh
      ;;
    10)
      npm run build
      ;;
    11)
      ./scripts-deploy.sh
      ;;
    12)
      xdg-open http://localhost:3000
      ;;
    13)
      xdg-open https://platypus-shirt-shop.vercel.app
      ;;
    14)
      xdg-open https://platypus-shirt-shop.vercel.app/admin
      ;;
    15)
      exit 0
      ;;
    *)
      echo "Invalid option"
      ;;
  esac

  echo ""
  read -p "Press ENTER to continue..."
done
