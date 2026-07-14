#!/bin/bash

set -e

while true; do
  clear

  echo "================================================="
  echo "              PLATYPUS AUTO PILOT"
  echo "================================================="
  echo ""
  echo "1  - Full AI Cycle"
  echo "2  - Full Launch Cycle"
  echo "3  - Full System Audit"
  echo "4  - Backup + Deploy"
  echo "5  - Open All Shop Pages"
  echo "6  - Local Development"
  echo "7  - Production Deploy"
  echo "8  - Emergency Clean Build"
  echo "9  - Exit"
  echo ""

  read -p "Select Option: " option

  case $option in
    1)
      ./scripts/ai-dev-cycle.sh
      ;;
    2)
      ./scripts/final-launch-sequence.sh
      ;;
    3)
      ./scripts/system-check.sh
      ./scripts-healthcheck.sh || true
      ./scripts/live-launch-check.sh || true
      ;;
    4)
      ./scripts/backup-project.sh
      ./scripts-deploy.sh
      ;;
    5)
      ./scripts/open-all.sh
      ;;
    6)
      npm run dev
      ;;
    7)
      ./scripts/production-mode.sh
      ;;
    8)
      ./scripts/clean-build.sh
      ;;
    9)
      exit 0
      ;;
    *)
      echo "Invalid option"
      ;;
  esac

  echo ""
  read -p "Press ENTER to continue..."
done
