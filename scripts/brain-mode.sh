#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "                    PLATYPUS BRAIN MODE"
  echo "========================================================="
  echo ""
  echo "1  - Infinite Builder"
  echo "2  - Omega Mode"
  echo "3  - God Mode"
  echo "4  - Empire Mode"
  echo "5  - World Domination"
  echo "6  - Auto Pilot"
  echo "7  - Master Control"
  echo "8  - AI Dev Cycle"
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
      ./scripts/infinite-builder.sh
      ;;
    2)
      ./scripts/omega-mode.sh
      ;;
    3)
      ./scripts/god-mode.sh
      ;;
    4)
      ./scripts/empire-mode.sh
      ;;
    5)
      ./scripts/world-domination.sh
      ;;
    6)
      ./scripts/auto-pilot.sh
      ;;
    7)
      ./scripts/master-control.sh
      ;;
    8)
      ./scripts/ai-dev-cycle.sh
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
