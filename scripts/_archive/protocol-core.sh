#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "                PLATYPUS PROTOCOL CORE"
  echo "========================================================="
  echo ""
  echo "1  - Infinite Ops"
  echo "2  - Alpha Launch"
  echo "3  - Supreme Core"
  echo "4  - One Click Empire"
  echo "5  - Ultimate Command"
  echo "6  - Hyper Launch"
  echo "7  - Final Launch Sequence"
  echo "8  - Build"
  echo "9  - Deploy"
  echo "10 - System Check"
  echo "11 - Healthcheck"
  echo "12 - Shop Report"
  echo "13 - Backup"
  echo "14 - Quick Start"
  echo "15 - Open Localhost"
  echo "16 - Open Live Shop"
  echo "17 - Open Admin"
  echo "18 - Exit"
  echo ""

  read -p "Select Option: " option

  case $option in
    1)
      ./scripts/infinite-ops.sh
      ;;
    2)
      ./scripts/alpha-launch.sh
      ;;
    3)
      ./scripts/supreme-core.sh
      ;;
    4)
      ./scripts/one-click-empire.sh
      ;;
    5)
      ./scripts/ultimate-command.sh
      ;;
    6)
      ./scripts/hyper-launch.sh
      ;;
    7)
      ./scripts/final-launch-sequence.sh
      ;;
    8)
      npm run build
      ;;
    9)
      ./scripts-deploy.sh
      ;;
    10)
      ./scripts/system-check.sh
      ;;
    11)
      ./scripts-healthcheck.sh
      ;;
    12)
      ./scripts/shop-report.sh
      ;;
    13)
      ./scripts/backup-project.sh
      ;;
    14)
      ./scripts/quick-start.sh
      ;;
    15)
      xdg-open http://localhost:3000
      ;;
    16)
      xdg-open https://platypus-shirt-shop.vercel.app
      ;;
    17)
      xdg-open https://platypus-shirt-shop.vercel.app/admin
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
