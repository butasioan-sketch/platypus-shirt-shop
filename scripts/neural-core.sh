#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "                  PLATYPUS NEURAL CORE"
  echo "========================================================="
  echo ""
  echo "1  - Brain Mode"
  echo "2  - Omega Mode"
  echo "3  - Singularity Mode"
  echo "4  - Infinite Builder"
  echo "5  - God Mode"
  echo "6  - Empire Mode"
  echo "7  - World Domination"
  echo "8  - Auto Pilot"
  echo "9  - Build"
  echo "10 - Deploy"
  echo "11 - Localhost"
  echo "12 - Live Shop"
  echo "13 - Admin"
  echo "14 - Exit"
  echo ""

  read -p "Select Option: " option

  case $option in
    1)
      ./scripts/brain-mode.sh
      ;;
    2)
      ./scripts/omega-mode.sh
      ;;
    3)
      ./scripts/singularity-mode.sh
      ;;
    4)
      ./scripts/infinite-builder.sh
      ;;
    5)
      ./scripts/god-mode.sh
      ;;
    6)
      ./scripts/empire-mode.sh
      ;;
    7)
      ./scripts/world-domination.sh
      ;;
    8)
      ./scripts/auto-pilot.sh
      ;;
    9)
      npm run build
      ;;
    10)
      ./scripts-deploy.sh
      ;;
    11)
      xdg-open http://localhost:3000
      ;;
    12)
      xdg-open https://platypus-shirt-shop.vercel.app
      ;;
    13)
      xdg-open https://platypus-shirt-shop.vercel.app/admin
      ;;
    14)
      exit 0
      ;;
    *)
      echo "Invalid option"
      ;;
  esac

  echo ""
  read -p "Press ENTER to continue..."
done
