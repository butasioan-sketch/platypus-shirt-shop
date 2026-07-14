#!/bin/bash

set -e

while true; do
  clear

  echo "================================================="
  echo "              PLATYPUS MASTER CONTROL"
  echo "================================================="
  echo ""
  echo " 1  - Dev Mode"
  echo " 2  - Production Mode"
  echo " 3  - First Sale Mode"
  echo " 4  - Ship Mode"
  echo " 5  - AI Dev Cycle"
  echo " 6  - Final Launch Sequence"
  echo " 7  - System Check"
  echo " 8  - Healthcheck"
  echo " 9  - Live Launch Check"
  echo "10  - Backup Project"
  echo "11  - Clean Build"
  echo "12  - Open All Pages"
  echo "13  - Git Status"
  echo "14  - Git Log"
  echo "15  - Local Dev Server"
  echo "16  - Open Live Shop"
  echo "17  - Open Admin"
  echo "18  - Build"
  echo "19  - Deploy"
  echo "20  - Exit"
  echo ""

  read -p "Select Option: " option

  case $option in
    1)
      ./scripts/dev-mode.sh
      ;;
    2)
      ./scripts/production-mode.sh
      ;;
    3)
      ./scripts/first-sale-mode.sh
      ;;
    4)
      ./scripts/ship-mode.sh
      ;;
    5)
      ./scripts/ai-dev-cycle.sh
      ;;
    6)
      ./scripts/final-launch-sequence.sh
      ;;
    7)
      ./scripts/system-check.sh
      ;;
    8)
      ./scripts-healthcheck.sh
      ;;
    9)
      ./scripts/live-launch-check.sh
      ;;
    10)
      ./scripts/backup-project.sh
      ;;
    11)
      ./scripts/clean-build.sh
      ;;
    12)
      ./scripts/open-all.sh
      ;;
    13)
      git status
      ;;
    14)
      git log --oneline -10
      ;;
    15)
      npm run dev
      ;;
    16)
      xdg-open https://platypus-shirt-shop.vercel.app
      ;;
    17)
      xdg-open https://platypus-shirt-shop.vercel.app/admin
      ;;
    18)
      npm run build
      ;;
    19)
      ./scripts-deploy.sh
      ;;
    20)
      exit 0
      ;;
    *)
      echo "Invalid option"
      ;;
  esac

  echo ""
  read -p "Press ENTER to continue..."
done
