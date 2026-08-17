# Panduan Resmi Penyiapan & Onboarding Merchant HFE

**Document ID:** `GLC-REF-ONBOARDING-001`  
**Status:** Approved Reference Standard  
**Effective Date:** 2026-08-17  
**Applies To:** Platform Onboarding, Store Setup Wizard, 1-Click Migration Bridge, & Chart of Accounts

---

## 1. Ringkasan Ekosistem & Topologi Multi-Tenancy

Platform HFE dirancang dengan arsitektur multi-tenancy terisolasi yang memisahkan entitas induk global, holding regional, dan outlet komersial merchant:

```text
 ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
 │ 👑 BLOK 01 - 09: CORE HOLDINGS & MASTER PLATFORM INFRASTRUCTURE                                 │
 │    • Tenant 01: HFE IT Global Holdings Pte. Ltd. (Singapore HoldCo & Core IP Master)            │
 │    • Tenant 02: HFE-IT Experience Global (Platform Operator & Wholesale Reseller Mesh)          │
 │    • Tenant 03: HFE Global Connect Hub & Third-Party Relay Node                                 │
 ├─────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ 🌏 BLOK 10 - 49: REGIONAL OPERATING OPCOS (ASEAN, EAST ASIA & EMEA)                             │
 │    • Tenant 10: PT HFE Teknologi Indonesia (Jakarta Sovereign OpCo)                             │
 │    • Tenant 11: HFE IT Singapore Operations Pte. Ltd. (Singapore OpCo)                          │
 │    • Tenant 12: HFE IT Malaysia Sdn. Bhd. (Kuala Lumpur OpCo)                                   │
 │    • Tenant 30: HFE IT Hong Kong Ltd. (Greater China & North Asia Hub)                          │
 ├─────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ 🛒 BLOK 100+: COMMERCIAL MERCHANTS (KAFE, RESTO, ROASTERY, PERKEBUNAN & RETAIL)                │
 │    • Setiap pendaftaran bisnis baru secara dinamis mengalokasikan UUID Tenancy terisolasi.      │
 └─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 5 Specialist Business Clusters & Kustom

HFE menyediakan 5 preset klaster bisnis terspesialisasi yang secara otomatis mengonfigurasi modul, alur kasir, dan bagan akun:

| Klaster Bisnis | Kode Sistem | Preset Fitur Utama | Kapasitas & Metrik Kunci |
| :--- | :--- | :--- | :--- |
| **Kafe & Resto F&B** | `CLUSTER_FNB` | Table Floor Plan, Modifiers, KDS Kanban, Recipe BOM, QR Table Ordering | `👥 3/4 Kursi` (Utilisasi Meja) |
| **Roasting & Manufaktur** | `CLUSTER_ROASTERY` | Batch Roaster BOM, Green Bean Shrinkage, Wholesale B2B Invoicing | `🔥 20kg Batch Oven` |
| **Perkebunan Agrikultur** | `CLUSTER_PLANTATION` | Akuntansi Aset Biologis PSAK 69, Nilai Wajar Panen, Multi-Plot Lahan | `🌱 50 Ha Lahan Gayo` |
| **Ekspor & Cross-Border** | `CLUSTER_TRADING` | Multi-Currency (IDR/SGD/MYR/HKD), Kontainer Trading, Eliminasi Antar-Entitas | `🚢 10 Kontainer / Bulan` |
| **Retail & Minimarket** | `CLUSTER_RETAIL` | Barcode Scanner, Multi-UOM Satuan Grosir, Buku Kasbon, Scan & Go Mobile | `🛒 3 Kasir POS + Scanner` |
| **Kustom & Usaha Lainnya** | `CLUSTER_OTHER` | Standard Commercial General Ledger, Custom Approval Workflows | `⚙️ Kustom Fleksibel` |

---

## 3. Alur 3 Langkah Onboarding + 1 Pratinjau Sistem (3+1 Flow)

1. **Langkah 1: Identitas Bisnis & Jalur Migrasi**:
   - Memilih jalur **Fresh Start** atau **1-Click Migration Bridge**.
   - Memilih **Specialist Cluster** (`CLUSTER_FNB`, `CLUSTER_ROASTERY`, `CLUSTER_PLANTATION`, `CLUSTER_TRADING`, `CLUSTER_RETAIL`, `CLUSTER_OTHER`).
   - Memilih **Negara & Mata Uang** (🇮🇩 IDR, 🇸🇬 SGD, 🇲🇾 MYR, 🇭🇰 HKD).
   - Akses cepat tombol **1-Click Persona** (`Kafe BSD` dan `Roastery`).

2. **Langkah 2: Profil Brand & Skala Kapasitas**:
   - Nama Brand, Logo URL, Alamat Toko, Instagram, WhatsApp Order Contact.
   - Kebijakan WiFi Pelanggan & Kredensial Akses.
   - Skala Kapasitas Operasional (e.g. `20 Meja 👥 3/4`, `20kg Batch Oven`, `50 Ha Lahan`).
   - Skala Tim & Otorisasi PIN Staf (`Solo Cashier`, `Tim Kecil`, `Enterprise`).

3. **Langkah 3: Pajak, Kas Laci Float & File CSV Migrasi**:
   - Kebijakan Pajak PB1/PPN 10% (Mode 0 Non-PB1, Mode 1 Exclude, Mode 2 Include).
   - Modal Kas Laci Float Awal Shift Kasir.
   - Unggah atau simulasi file CSV/Excel data migrasi.

4. **Langkah 4: Pratinjau Sistem & Verifikasi Tenancy (PREVIEW)**:
   - Verifikasi Tenancy UUID terbitan HCB Core.
   - Pengecekan Bagan Akun 18 Akun Standar (CoA).
   - Validasi Keseimbangan Jurnal Saldo Awal ($Debits == Credits$).
   - Sertifikasi Status **System-Verified Ready ✨**.

---

## 4. 1-Click Migration Bridge Connector

Fitur Migration Bridge memungkinkan impor otomatis dari platform POS dan akuntansi terkemuka:

- **🟢 Xero Cloud Accounting**: Sinkronisasi bagan akun, kontak vendor/customer, dan riwayat transaksi.
- **🟣 Moka POS**: Impor katalog produk, varian modifier, dan database pelanggan.
- **🔵 Mekari Jurnal**: Impor Chart of Accounts (CoA) dan saldo neraca awal.
- **🔴 Accurate Online**: Migrasi master barang, persediaan awal, dan saldo utang-piutang.
- **📄 CSV / Excel**: Template standar untuk impor massal cepat.

---

## 5. Chart of Accounts (CoA 18 Akun Standar) & Saldo Awal

Setiap merchant yang menyelesaikan onboarding otomatis mendapatkan bagan akun terstandarisasi:

```text
1000 - Kas & Setara Kas (Aset Lancar)
1010 - Kas Laci Kasir / Float (Aset Lancar)
1020 - Rekening Bank Operasional (Aset Lancar)
1100 - Piutang Usaha / AR (Aset Lancar)
1200 - Persediaan Bahan Baku (Aset Lancar)
1210 - Persediaan Barang Jadi (Aset Lancar)
1500 - Aset Tetap - Mesin & Peralatan (Aset Tetap)
1510 - Akumulasi Penyusutan Mesin (Kontra-Aset)
2000 - Utang Usaha / AP (Liabilitas Lancar)
2100 - Utang Pajak Daerah PB1 / PPN (Liabilitas Lancar)
2200 - Uang Muka Pelanggan / Open Tab (Liabilitas Lancar)
3000 - Modal Disetor Pemilik (Ekuitas)
3100 - Saldo Laba Ditahan / Retained Earnings (Ekuitas)
4000 - Pendapatan Penjualan Utama (Pendapatan)
4100 - Pendapatan Grosir / Wholesale B2B (Pendapatan)
5000 - Beban Pokok Penjualan / HPP (Beban Langsung)
6000 - Beban Gaji & Upah Staf (Beban Operasional)
6100 - Beban Operasional & Utilitas Outlet (Beban Operasional)
```

### Invarian Jurnal Saldo Awal Seimbang
$$\sum \text{Debits} = \sum \text{Credits}$$
$$\text{Kas Laci} + \text{Bank} + \text{Persediaan} + \text{Aset Mesin} = \text{Utang Usaha} + \text{Modal Disetor}$$

---

## 6. Verifikasi Status Operasional (System-Verified)

Getting Started Checklist memverifikasi kesiapan operasional secara otomatis melalui HCB Core REST API:

1. **Profil Badan Usaha / PT Terdaftar**: Memastikan `companyBookId` dan nama legal terdaftar pada kernel HCB.
2. **Minimum 1 Staf Aktif**: Memastikan otorisasi PIN kasir terkonfigurasi.
3. **Shift Kas Float Terbuka**: Memastikan modal fisik laci kasir tercatat pada subledger kas.
