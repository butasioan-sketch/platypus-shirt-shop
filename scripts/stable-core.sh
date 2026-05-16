#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "                  PLATYPUS STABLE CORE"
  echo "========================================================="
  echo ""
  echo "1  - Release Core"
  echo "2  - Gamma Launch"
  echo "3  - Protocol Core"
  echo "4  - Beta Launch"
  echo "5  - Infinite Ops"
  echo "6  - Supreme Core"
  echo "7  - Ultimate Command"
  echo "8  - Final Launch Sequence"
  echo "9  - Build"
  echo "10 - Deploy"
  echo "11 - System Check"
  echo "12 - Healthcheck"
  echo "13 - Shop Report"
  echo "14 - Backup"
  echo "15 - Quick Start"
  echo "16 - Open Localhost"
  echo "17 - Open Live Shop"
  echo "18 - Open Admin"
  echo "19 - Exit"
  echo ""

  read -p "Select Option: " option

  case $option in
    1)
      ./scripts/release-core.sh
      ;;
    2)
      ./scripts/gamma-launch.sh
      ;;
    3)
      ./scripts/protocol-core.sh
      ;;
    4)
      ./scripts/beta-launch.sh
      ;;
    5)
      ./scripts/infinite-ops.sh
      ;;
    6)
      ./scripts/supreme-core.sh
      ;;
    7)
      ./scripts/ultimate-command.sh
      ;;
    8)
      ./scripts/final-launch-sequence.sh
      ;;
    9)
      npm run build
      ;;
    10)
      ./scripts-deploy.sh
      ;;
    11)
      ./scripts/system-check.sh
      ;;
    12)
      ./scripts-healthcheck.sh
      ;;
    13)
      ./scripts/shop-report.sh
      ;;
    14)
      ./scripts/backup-project.sh
      ;;
    15)
      ./scripts/quick-start.sh
      ;;
    16)
      xdg-open http://localhost:3000
      ;;
    17)
      xdg-open https://platypus-shirt-shop.vercel.app
      ;;
    18)
      xdg-open https://platypus-shirt-shop.vercel.app/admin
      ;;
    19)
      exit 0
      ;;
    *)
      echo "Invalid option"
      ;;
  esac

  echo ""
  read -p "Press ENTER to continue..."
done
