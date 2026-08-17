---
name: pajak-djp
description: "Otomasi kepatuhan pajak Indonesia: Pajak Restoran Daerah (PB1 10%), PPN 11%/12%, ekspor e-Faktur DJP, dan pemotongan PPh 21/23."
---

# 📑 Pajak DJP & PB1 Bapenda Compliance Skill

Skill ini membekali agent dengan kapabilitas untuk mengaudit, menghitung, dan melaporkan kewajiban perpajakan Indonesia di ekosistem HFE.

## 🎯 Kapabilitas Utama
1. **Pajak Restoran PB1 10% (UU HKPD)**:
   - Menghitung tarif 10% pada penjualan F&B dine-in/takeaway.
   - Mengalokasikan posting ke akun kewajiban `2140 (Hutang Pajak Restoran PB1)`.
2. **PPN 11% / 12% & e-Faktur DJP**:
   - Memisahkan Faktur Pajak Keluaran dan Faktur Pajak Masukan.
   - Menghasilkan format ekspor CSV/XML resmi untuk skema e-Faktur DJP.
3. **Batam Free Trade Zone (FTZ 0%)**:
   - Menerapkan fasilitas pembebasan PPN 0% untuk transaksi intra-Batam.
4. **PPh 21 TER (Tarif Efektif Rata-Rata 2026)**:
   - Menghitung potongan pajak penghasilan karyawan pada modul payroll shift.

## 🚀 Perintah Cepat
```bash
# Validasi jurnal pajak bulan berjalan
python3 scripts/hfe.py report tax --period current

# Ekspor draft SPT Masa PPN
python3 scripts/hfe.py report efaktur --month 2026-08
```
