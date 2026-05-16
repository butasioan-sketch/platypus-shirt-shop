#!/bin/bash

while true; do
  clear

  echo "========================================================="
  echo "                PLATYPUS INFINITE OPS"
  echo "========================================================="
  echo ""
  echo "1  - Supreme Core"
  echo "2  - One Click Empire"
  echo "3  - Ultimate Command"
  echo "4  - Hyper Launch"
  echo "5  - Final Launch Sequence"
  echo "6  - Build"
  echo "7  - Deploy"
  echo "8  - System Check"
  echo "9  - Healthcheck"
  echo "10 - Shop Report"
  echo "11 - Backup"
  echo "12 - Quick Start"
  echo "13 - Open Localhost"
  echo "14 - Open Live Shop"
  echo "15 - Open Admin"
  echo "16 - Exit"
  echo ""

  read -p "Select Option: " option

  case $option in
    1)
      ./scripts/supreme-core.sh
      ;;
    2)
      ./scripts/one-click-empire.sh
      ;;
    3)
      ./scripts/ultimate-command.sh
      ;;
    4)
      ./scripts/hyper-launch.sh
      ;;
    5)
      ./scripts/final-launch-sequence.sh
      ;;
    6)
      npm run build
      ;;
    7)
      ./scripts-deploy.sh
      ;;
    8)
      ./scripts/system-check.sh
      ;;
    9)
      ./scripts-healthcheck.sh
      ;;
    10)
      ./scripts/shop-report.sh
      ;;
    11)
      ./scripts/backup-project.sh
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
