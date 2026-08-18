---
name: roastery-mfg
description: "Manufaktur & Roasting Biji Kopi: Perakitan Bill of Materials (BOM), kalkulasi susut kelembaban oven 15%, dan pembebanan COGM."
---

# ☕ Roastery Manufacturing & BOM Assembly Skill

Skill ini membekali agent untuk mengelola pabrik pengolahan biji kopi, kalkulasi susut sangrai, dan akuntansi harga pokok manufaktur (COGM).

## 🎯 Kapabilitas Utama
1. **Bill of Materials (BOM) & Multi-Ingredient Assembly**:
   - Resep standar: 100kg Green Beans Arabica Gayo + 85 pcs Packaging Valve Bag.
2. **Kalkulasi Susut Kelembaban Oven (15% Shrinkage)**:
   - Input: 100kg Green Beans ➔ Output: 85kg Roasted Beans matang.
   - Mengalokasikan biaya gas oven & upah roaster langsung ke nilai persediaan akhir.
3. **Posting Akuntansi COGM**:
   - `Debit 1220 (Persediaan Biji Kopi Sangrai)`: Rp 10.000.000 (85kg @ Rp 117.647/kg)
   - `Credit 1210 (Persediaan Green Beans)`: Rp 9.000.000
   - `Credit 5120 (Overhead Utilitas Gas)`: Rp 500.000
   - `Credit 2120 (Hutang Upah Tenaga Kerja)`: Rp 500.000

## 🚀 Perintah Cepat
```bash
# Cari endpoint dan skema roasting/BOM di Engine API
python3 scripts/hfex.py search "roasting"

# ⚠️ Engine-only: E2E scenario tests membutuhkan
# headless-company-books/scripts/e2e-master-runner.py
# Contoh: python3 scripts/e2e-master-runner.py --scenario 01-02-01
```
