---
name: agriculture-psak69
description: "Akuntansi Aset Biologis Pertanian (PSAK 69 / IAS 41): Revaluasi nilai wajar pohon perkebunan kopi dan konversi hasil panen ceri merah."
---

# 🌾 Agriculture Biological Assets (PSAK 69 / IAS 41) Skill

Skill ini membekali agent untuk mengelola aset biologis perkebunan (Kebun Gayo 50-Ha), pohon produktif (*Bearer Plants*), dan pengakuan keuntungan nilai wajar saat panen.

## 🎯 Kapabilitas Utama
1. **Revaluasi Nilai Wajar Semesteran**:
   - Menghitung nilai wajar 50.000 pohon kopi produktif @ Rp 60.000 = Rp 3.000.000.000.
   - Mencatat keuntungan selisih nilai wajar ke laba rugi (`4200 - Fair Value Gain`).
2. **Konversi Panen Ceri Kopi Menjadi Hasil Pertanian (*Agricultural Produce*)**:
   - Panen 500kg ceri merah @ Rp 90.000/kg = Rp 45.000.000 persediaan.
   - Mengalokasikan biaya upah buruh petik panen ke hutang upah.

## 🚀 Perintah Cepat
```bash
# Uji siklus panen dan akuntansi PSAK 69
python3 scripts/e2e-master-runner.py --scenario 01-05-01
```
