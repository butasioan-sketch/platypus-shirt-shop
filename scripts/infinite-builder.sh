#!/bin/bash

set -e

while true; do
  clear

  echo "========================================================="
  echo "                PLATYPUS INFINITE BUILDER"
  echo "========================================================="
  echo ""
  echo "1  - God Mode"
  echo "2  - Empire Mode"
  echo "3  - World Domination"
  echo "4  - Auto Pilot"
  echo "5  - Master Control"
  echo "6  - Ship Mode"
  echo "7  - First Sale Mode"
  echo "8  - AI Dev Cycle"
  echo "9  - Final Launch Sequence"
  echo "10 - Full Reset Check"
  echo "11 - System Check"
  echo "12 - Healthcheck"
  echo "13 - Live Launch Check"
  echo "14 - Backup"
  echo "15 - Clean Build"
  echo "16 - Shop Report"
  echo "17 - Open All Pages"
  echo "18 - Start Localhost"
  echo "19 - Build"
  echo "20 - Deploy"
  echo "21 - Git Status"
  echo "22 - Git Log"
  echo "23 - Exit"
  echo ""

  read -p "Select Option: " option

  case $option in
    1)
      ./scripts/god-mode.sh
      ;;
    2)
      ./scripts/empire-mode.sh
      ;;
    3)
      ./scripts/world-domination.sh
      ;;
    4)
      ./scripts/auto-pilot.sh
      ;;
    5)
      ./scripts/master-control.sh
      ;;
    6)
      ./scripts/ship-mode.sh
      ;;
    7)
      ./scripts/first-sale-mode.sh
      ;;
    8)
      ./scripts/ai-dev-cycle.sh
      ;;
    9)
      ./scripts/final-launch-sequence.sh
      ;;
    10)
      ./scripts/full-reset-check.sh
      ;;
    11)
      ./scripts/system-check.sh
      ;;
    12)
      ./scripts-healthcheck.sh
      ;;
    13)
      ./scripts/live-launch-check.sh
      ;;
    14)
      ./scripts/backup-project.sh
      ;;
    15)
      ./scripts/clean-build.sh
      ;;
    16)
      ./scripts/shop-report.sh
      ;;
    17)
      ./scripts/open-all.sh
      ;;
    18)
      ./scripts/quick-start.sh
      ;;
    19)
      npm run build
      ;;
    20)
      ./scripts-deploy.sh
      ;;
    21)
      git status
      ;;
    22)
      git log --oneline -20
      ;;
    23)
      exit 0
      ;;
    *)
      echo "Invalid option"
      ;;
  esac

  echo ""
  read -p "Press ENTER to continue..."
done
