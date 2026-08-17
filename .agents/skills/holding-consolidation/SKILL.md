---
name: holding-consolidation
description: "Konsolidasi Laporan Keuangan Grup Holding Multi-Entitas: Translasi Valas (IAS 21) dan Eliminasi Saldo Resiprokal Bilateral."
---

# 🏢 Multi-Entity Holding Financial Consolidation Skill

Skill ini membekali agent untuk melakukan konsolidasi laporan keuangan holding (Singapura HoldCo, PT Indo, MY OpCo, HK OpCo).

## 🎯 Kapabilitas Utama
1. **Translasi Mata Uang Asing (IAS 21)**:
   - Menyelaraskan trial balance IDR, MYR, dan HKD ke mata uang pelaporan SGD/USD.
   - Mengalokasikan selisih kurs ke *Foreign Currency Translation Reserve (Equity)*.
2. **Eliminasi Saldo Resiprokal Intra-Group**:
   - Mengeliminasi Piutang Antar-PT (HoldCo AR) vs Hutang Antar-PT (OpCo AP) secara otomatis.
   - Menghasilkan net selisih konsolidasi tepat **`$0.00 Net Variance`**.

## 🚀 Perintah Cepat
```bash
# Uji konsolidasi holding dan eliminasi bilateral
python3 scripts/e2e-master-runner.py --scenario 01-06-01
```
