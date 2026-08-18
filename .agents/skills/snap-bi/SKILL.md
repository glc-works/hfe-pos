---
name: snap-bi
description: "Standar Nasional Open API Pembayaran (SNAP BI): Rekonsiliasi mutasi rekening koran BCA/Mandiri/BRI dan clearing QRIS otomatis."
---

# 🏦 SNAP BI Banking & Treasury Automation Skill

Skill ini membekali agent untuk mengotomasi komunikasi perbankan open API standar Bank Indonesia (SNAP BI).

## 🎯 Kapabilitas Utama
1. **Rekonsiliasi Bank Otomatis (Bank Reconciliation)**:
   - Menarik data mutasi rekening koran harian via API SNAP BI v1.0.
   - Mencocokkan setoran QRIS dan transfer dengan jurnal kasir (`Tolerance: Rp 0.00`).
2. **SNAP BI Signature Generator (Asymmetric RSA-SHA256)**:
   - Men-generate header `X-SIGNATURE`, `X-TIMESTAMP`, dan `X-PARTNER-ID` yang valid.
3. **Penyelesaian Selisih & Unmatched Items**:
   - Mendeteksi selisih bank charge / biaya MDR QRIS (0.7%) dan mempostingnya ke `5130 (Beban MDR & Bank Fee)`.

## 🚀 Perintah Cepat
```bash
# Cari endpoint dan skema rekonsiliasi bank di Engine API
python3 scripts/hfex.py search "rekonsiliasi"

# ⚠️ Engine-only: Perintah bank reconcile membutuhkan
# headless-company-books CLI. Gunakan hfex.py search untuk Experience Layer.
```
