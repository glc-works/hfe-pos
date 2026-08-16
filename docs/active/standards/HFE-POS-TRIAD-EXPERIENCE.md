# 🏛️ ARSITEKTUR 4 PILAR PENGALAMAN HFE COMMERCE SUITE (QUAD EXPERIENCE ARCHITECTURE)

**Dokumen Standar:** `HFE-POS-QUAD-EXPERIENCE`  
**Otoritas:** `glc-works/hfe-pos` & Ekosistem `glc-works/headless-company-books`  
**Status:** Approved Living Technical Architecture  
**Tanggal:** 16 Agustus 2026

---

## 🗺️ 1. DIAGRAM 4 PILAR UTAMA (THE 4 EXPERIENCE PILLARS)

Ekosistem `hfe-pos` dibangun di atas 4 pilar yang saling terhubung secara mulus tanpa *state drift* (*Single Source of Truth*):

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                    QUAD EXPERIENCE ARCHITECTURE — HFE POS & COMMERCE SUITE                      │
├───────────────────┬───────────────────┬───────────────────────────────┬─────────────────────────┤
│ 📱 PILAR 1:       │ 🌐 PILAR 2:       │ 💳 PILAR 3:                   │ 🏪 PILAR 4:             │
│ CUSTOMER QR ORDER │ MERCHANT LANDING  │ CUSTOMER PORTAL & MEMBER CARD │ POS, KDS & BACKOFFICE   │
├───────────────────┼───────────────────┼───────────────────────────────┼─────────────────────────┤
│ • Scan QR Meja    │ • Brand Showcase  │ • Kartu Member Digital Pass   │ • Workstation Kasir Cpt │
│ • Custom Modifiers│ • Promo Kupon     │ • Barcode Scan Kasir 1-Ketuk  │ • Peta Meja Multi-Zona  │
│ • Open-Tab vs Pay │ • Kalender Event  │ • Saldo Poin & Stamp Card     │ • KDS Dapur Split Chits │
│ • Payment Gated WF│ • Jual Tiket/Kelas│ • Dompet E-Ticket Acara/Kelas │ • Gudang Multi-Lokasi   │
│ • Tracking Dapur  │ • Form Reservasi  │ • Riwayat Struk & E-Receipt   │ • Jasa & Part BOM       │
│ • Download Struk  │ • Kontak WhatsApp │ • Preferensi Diet & Kendaraan │ • Jurnal Hfe Core       │
└───────────────────┴───────────────────┴───────────────────────────────┴─────────────────────────┘
```

---

## 🔍 2. RINCIAN SPESIFIKASI TIAP PILAR

### 📱 PILAR 1: IN-STORE CUSTOMER QR ORDER (`src/views/CustomerMobileView.tsx`)
* **Fokus Pengguna:** Pengunjung meja kafe, ruang tunggu servis/salon, atau pesanan *takeaway*.
* **Fitur Kunci:** Scan meja otomatis, smart cart modifiers, open-tab vs bayar langsung, password WiFi otomatis terbuka usai bayar (`L2-POS-44`), dan tracking dapur live.

---

### 🌐 PILAR 2: MERCHANT LANDING PAGE HUB (`src/views/LandingView.tsx`)
* **Fokus Pengguna:** Calon pelanggan online, pengunjung profil media sosial, dan penikmat event komunitas.
* **Fitur Kunci:** Profil brand digital, etalase kupon voucher diskon, penjualan tiket event live music & booking kelas workshop edukasi (`L2-POS-46`), dan form reservasi meja interaktif.

---

### 💳 PILAR 3: CUSTOMER PORTAL & DIGITAL MEMBER CARD (`src/views/CustomerPortalView.tsx`)
* **Fokus Pengguna:** Pelanggan setia yang ingin melihat kartu member, saldo poin, dan riwayat transaksinya.
* **Fitur Kunci (`L2-POS-47`):**
  1. **Digital Passbook Member Card:** Kartu visual mewah gaya Apple Wallet dengan QR/Barcode ID untuk di-scan oleh kasir POS.
  2. **Loyalty Ledger & Stamp Card:** Pelacakan progres reward (misal: *Kopi ke-8 dari 10*).
  3. **Dompet E-Ticket & Kelas:** Koleksi tiket event berbayar dengan QR code validasi gate-in.
  4. **Riwayat Pesanan & E-Receipt:** Arsip struk belanja dan riwayat servis kendaraan / sesi gym.
  5. **Preferensi Pribadi:** Catatan preferensi diet (Oat Milk, Less Sugar) dan plat nomor kendaraan.

---

### 🏪 PILAR 4: POS CASHIER, KDS DAPUR & ENTERPRISE BACKOFFICE (`src/views/UnifiedPosView.tsx`)
* **Fokus Pengguna:** Kasir, Barista, Chef, Montir, Trainer, Manager, dan Owner.
* **Fitur Kunci:** Kasir berkecepatan tinggi, integrasi scanner barcode member pelanggan, peta meja multi-zona (`L2-POS-45`), multi-station KDS, persediaan multi-gudang GRN, work-order jasa, dan jurnal akuntansi Hfe Core.

---

## 🔄 3. INTEROPERABILITAS LINTAS PILAR (ZERO STATE DRIFT)

Semua 4 pilar berbagi data yang tersinkronisasi secara instan melalui:
* `MerchantConfigContext.tsx`: Mengontrol tema, bahasa, voucher, dan kebijakan toko.
* `CustomerAuthContext.tsx`: Mengelola identitas member pelanggan, saldo poin, dan tiket aktif.
* `hfeCoreApi.ts` / `mockData.ts`: Menjaga integritas data kontak CRM, transaksi ledger, dan persediaan barang/jasa.
