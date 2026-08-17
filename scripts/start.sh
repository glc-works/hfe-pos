#!/usr/bin/env bash
# World.Hfeit Master 1-Click Interactive Launcher
# Standard: POS-ENG-STD-001 & HFE-ECOSYSTEM-STD-001

set -e

BOLD="\033[1m"
CYAN="\033[36m"
GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[34m"
RESET="\033[0m"

clear || true
echo -e "${BOLD}${BLUE}========================================================================${RESET}"
echo -e "${BOLD}${CYAN} 🌐 WORLD.HFEIT — MASTER 1-CLICK INTERACTIVE LAUNCHER${RESET}"
echo -e "${BOLD}${BLUE}========================================================================${RESET}"
echo -e " Pilih mode yang ingin Anda jalankan:"
echo ""
echo -e " ${BOLD}[1] 🎮 Mainkan World.Hfeit di Browser Web (Vite Dev Server)${RESET}"
echo -e "     • Menjalankan web kasir, denah meja, tap kartu NFC, & kanvas kota 60 FPS."
echo ""
echo -e " ${BOLD}[2] 🎭 Tonton Simulasi Roleplay 5 Tahun (Storytelling Drama)${RESET}"
echo -e "     • Cerita Mas Budi dari Day-0 sampai Tahun ke-5 Audit WTP di terminal."
echo ""
echo -e " ${BOLD}[3] 🤖 Jalankan Simulasi Kota Otonom 30 Hari (Headless CLI)${RESET}"
echo -e "     • Mensimulasikan 60 virtual ticks perdagangan & memverifikasi jurnal ganda."
echo ""
echo -e " ${BOLD}[4] 🧪 Jalankan Semua Pengujian & Audit Radar (Full CI/CD Health Check)${RESET}"
echo -e "     • 93 file Vitest frontend, 220 tes Rust backend, & audit 9 pilar."
echo ""
echo -e " ${BOLD}[q] Keluar${RESET}"
echo -e "${BOLD}${BLUE}========================================================================${RESET}"
read -p " Masukkan pilihan [1-4 atau q]: " CHOICE

case "$CHOICE" in
  1)
    echo -e "\n${BOLD}${GREEN}🚀 Menyalakan Server Web World.Hfeit...${RESET}"
    echo -e " Silakan buka browser di: ${BOLD}${CYAN}http://localhost:5173${RESET}\n"
    cd /Users/aldi/claudefiles/hfe-pos
    npm run dev
    ;;
  2)
    echo -e "\n${BOLD}${YELLOW}🎭 Memulai Simulasi Roleplay 5 Tahun...${RESET}\n"
    python3 /Users/aldi/claudefiles/headless-company-books/scripts/roleplay-runner.py --horizon-years 5 --speed fast
    ;;
  3)
    echo -e "\n${BOLD}${CYAN}🤖 Menjalankan Simulasi Kota Otonom 30 Hari...${RESET}\n"
    python3 /Users/aldi/claudefiles/headless-company-books/scripts/hfe.py town sim --days 30
    ;;
  4)
    echo -e "\n${BOLD}${GREEN}🧪 Menjalankan Audit Kesehatan Penuh...${RESET}\n"
    python3 /Users/aldi/claudefiles/headless-company-books/scripts/hfe-rad0.py
    python3 /Users/aldi/claudefiles/hfe-pos/scripts/hfex-rad0.py
    cd /Users/aldi/claudefiles/hfe-pos && npm test -- --run
    ;;
  q|Q)
    echo -e "\nSampai jumpa di World.Hfeit! 👋\n"
    exit 0
    ;;
  *)
    echo -e "\n${YELLOW}Pilihan tidak valid.${RESET}\n"
    exit 1
    ;;
esac
