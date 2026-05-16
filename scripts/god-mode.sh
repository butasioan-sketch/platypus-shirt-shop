#!/bin/bash

set -e

while true; do
  clear

  echo "======================================================"
  echo "                 PLATYPUS GOD MODE"
  echo "======================================================"
  echo ""
  echo " 1  - Auto Pilot"
  echo " 2  - Master Control"
  echo " 3  - AI Dev Cycle"
  echo " 4  - Ship Mode"
  echo " 5  - First Sale Mode"
  echo " 6  - Final Launch Sequence"
  echo " 7  - Full Reset Check"
  echo " 8  - Live Launch Check"
  echo " 9  - Clean Build"
  echo "10  - Backup Project"
  echo "11  - Open All Shop Pages"
  echo "12  - Run Local Dev Server"
  echo "13  - Build"
  echo "14  - Deploy"
  echo "15  - Shop Report"
  echo "16  - Git Status"
  echo "17  - Git Log"
  echo "18  - Exit"
  echo ""

  read -p "Select Option: " option

  case $option in
    1)
      ./scripts/auto-pilot.sh
      ;;
    2)
      ./scripts/master-control.sh
      ;;
    3)
      ./scripts/ai-dev-cycle.sh
      ;;
    4)
      ./scripts/ship-mode.sh
      ;;
    5)
      ./scripts/first-sale-mode.sh
      ;;
    6)
      ./scripts/final-launch-sequence.sh
      ;;
    7)
      ./scripts/full-reset-check.sh
      ;;
    8)
      ./scripts/live-launch-check.sh
      ;;
    9)
      ./scripts/clean-build.sh
      ;;
    10)
      ./scripts/backup-project.sh
      ;;
    11)
      ./scripts/open-all.sh
      ;;
    12)
      npm run dev
      ;;
    13)
      npm run build
      ;;
    14)
      ./scripts-deploy.sh
      ;;
    15)
      ./scripts/shop-report.sh
      ;;
    16)
      git status
      ;;
    17)
      git log --oneline -20
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
