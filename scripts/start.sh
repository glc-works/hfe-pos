#!/usr/bin/env bash
# World.Hfeit Master 1-Click Interactive Launcher
# Standard: POS-ENG-STD-001 & HFE-ECOSYSTEM-STD-001

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

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
echo -e " ${BOLD}[3] 🧪 Jalankan Semua Pengujian & Audit Radar (Full CI/CD Health Check)${RESET}"
echo -e "     • Vitest frontend suite & audit pilar radar."
echo ""
echo -e " ${BOLD}[q] Keluar${RESET}"
echo -e "${BOLD}${BLUE}========================================================================${RESET}"
read -p " Masukkan pilihan [1-3 atau q]: " CHOICE

case "$CHOICE" in
  1)
    echo -e "\n${BOLD}${GREEN}🚀 Menyalakan Server Web World.Hfeit...${RESET}"
    echo -e " Silakan buka browser di: ${BOLD}${CYAN}http://localhost:5173${RESET}\n"
    cd "$REPO_ROOT"
    npm run dev
    ;;
  2)
    echo -e "\n${BOLD}${YELLOW}🎭 Memulai Simulasi Roleplay 5 Tahun...${RESET}\n"
    python3 "$SCRIPT_DIR/roleplay-runner.py" --horizon-years 5 --speed fast
    ;;
  3)
    echo -e "\n${BOLD}${GREEN}🧪 Menjalankan Audit Kesehatan Penuh...${RESET}\n"
    python3 "$SCRIPT_DIR/hfex-rad0.py"
    cd "$REPO_ROOT" && npm test -- --run
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
