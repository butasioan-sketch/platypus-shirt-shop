#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "                 PLATYPUS RELEASE CORE"
  echo "========================================================="
  echo ""
  echo "1  - Protocol Core"
  echo "2  - Beta Launch"
  echo "3  - Infinite Ops"
  echo "4  - Supreme Core"
  echo "5  - One Click Empire"
  echo "6  - Ultimate Command"
  echo "7  - Hyper Launch"
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
      ./scripts/protocol-core.sh
      ;;
    2)
      ./scripts/beta-launch.sh
      ;;
    3)
      ./scripts/infinite-ops.sh
      ;;
    4)
      ./scripts/supreme-core.sh
      ;;
    5)
      ./scripts/one-click-empire.sh
      ;;
    6)
      ./scripts/ultimate-command.sh
      ;;
    7)
      ./scripts/hyper-launch.sh
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
