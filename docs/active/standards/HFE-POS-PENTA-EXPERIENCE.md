# 🏛️ ARSITEKTUR 5 PILAR PENGALAMAN HFE COMMERCE SUITE (PENTA EXPERIENCE ARCHITECTURE)

**Dokumen Standar:** `HFE-POS-PENTA-EXPERIENCE`  
**Otoritas:** `glc-works/hfe-pos` & Ekosistem `glc-works/headless-company-books`  
**Status:** Approved Living Technical Architecture  
**Tanggal:** 16 Agustus 2026

---

## 🗺️ 1. DIAGRAM 5 PILAR LENGKAP (THE 5 COMPLETE COMMERCE PILLARS)

Ekosistem `hfe-pos` membagi seluruh pengalaman komersial modern ke dalam **5 Pilar Utama Berdasarkan Aktor & Konteks Penggunaan (*Zero State Drift*)**:

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                PENTA EXPERIENCE ARCHITECTURE — HFE COMMERCE SUITE                                         │
├───────────────────┬───────────────────┬───────────────────────────────┬───────────────────────────┬───────────────────────┤
│ 📱 PILAR 1:       │ 🌐 PILAR 2:       │ 💳 PILAR 3:                   │ 🏪 PILAR 4:               │ 🛵 PILAR 5:           │
│ IN-STORE QR ORDER │ PUBLIC LANDING    │ CUSTOMER PORTAL & MEMBER CARD │ POS, KDS & OWNER BO       │ COURIER & DRIVER APP  │
├───────────────────┼───────────────────┼───────────────────────────────┼───────────────────────────┼───────────────────────┤
│ • Tamu di Meja    │ • Calon Tamu/Publik • Pelanggan Terdaftar/Member    │ • Kasir, Barista & Dapur  │ • Kurir Pengantaran   │
│ • Scan Meja (1-20)│ • Profil Brand PT │ • Kartu Passbook Apple Wallet │ • 👑 Owner Dashboard/Home │ • Antrean Antar Toko  │
│ • Custom Modifiers│ • Etalase Kupon   │ • Barcode Scan Kasir 1-Ketuk  │ • Workstation Kasir Cepat │ • Navigasi GMaps/Waze │
│ • Open-Tab vs Pay │ • Tiket Acara/Kls │ • Saldo Poin & Stamp Card     │ • Peta Meja Multi-Zona    │ • Foto Serah Terima   │
│ • WiFi Unlock Auto│ • Form Reservasi  │ • Dompet E-Ticket Acara/Kelas │ • KDS Dapur Split Chits   │ • Tanda Tangan POD    │
│ • Tracking Dapur  │ • Kontak WhatsApp │ • Riwayat Transaksi & Struk   │ • Gudang Multi-Cabang GRN │ • Setoran Kasir COD   │
│ • Unduh E-Receipt │ • Lokasi Maps     │ • Preferensi Diet/Kendaraan   │ • Jurnal Akuntansi Core   │ • Status Terkirim Live│
└───────────────────┴───────────────────┴───────────────────────────────┴───────────────────────────┴───────────────────────┘
```

---

## 🔍 2. RINCIAN SPESIFIKASI 5 PILAR

### 📱 PILAR 1: IN-STORE CUSTOMER QR ORDER (`src/views/CustomerMobileView.tsx`)
* **Aktor:** Tamu yang sedang duduk di meja restoran atau ruang tunggu layanan.
* **Fitur:** Zero-app install di browser, scan meja otomatis, custom modifiers (Level gula, Oat milk), open-tab vs bayar langsung, WiFi password terbuka otomatis usai lunas (`L2-POS-44`), dan tracking status dapur *real-time*.

---

### 🌐 PILAR 2: MERCHANT LANDING PAGE HUB (`src/views/LandingView.tsx`)
* **Aktor:** Calon pelanggan online, audiens media sosial, dan penikmat event komunitas.
* **Fitur:** Profil legalitas brand toko, etalase kupon promo dengan 1-ketuk salin, penjualan tiket event live music & booking kelas edukasi berbayar (`L2-POS-46`), dan form reservasi meja interaktif.

---

### 💳 PILAR 3: CUSTOMER PORTAL & DIGITAL MEMBER CARD (`src/views/CustomerPortalView.tsx`)
* **Aktor:** Pelanggan setia yang memiliki akun / nomor kontak terdaftar.
* **Fitur (`L2-POS-47`):**
  1. **Digital Passbook Member Card:** Kartu member bergradasi elegan dengan QR/Barcode ID untuk di-scan kasir POS.
  2. **Saldo Poin & Stamp Card:** Progres poin loyalitas belanja dan stamp kopi gratis.
  3. **Dompet E-Ticket Acara & Kelas:** Koleksi tiket event yang telah dibeli dengan QR verifikasi gate-in.
  4. **Riwayat Pesanan & E-Receipt:** Arsip seluruh transaksi masa lalu dan bukti servis kendaraan/sesi gym.
  5. **Preferensi Pribadi:** Catatan diet khusus dan data kendaraan/alamat tersimpan.

---

### 🏪 PILAR 4: POS CASHIER, KDS DAPUR & OWNER BACKOFFICE (`src/views/UnifiedPosView.tsx`)
* **Aktor:** Kasir, Barista, Chef Dapur, Montir, Supervisor, dan **👑 Pemilik Usaha (Owner)**.
* **Fitur:**
  1. **👑 Owner Executive Home / Dashboard:** Ringkasan omzet hari ini, margin laba kotor, pantauan cabang, dan anti-fraud alert.
  2. **Workstation Kasir Cepat:** Integrasi scanner barcode member pelanggan, speed keys, dan split-bill.
  3. **Peta Meja Multi-Zona & Relokasi:** Partisi area spasial (`L2-POS-45`) dan relokasi meja kilat.
  4. **KDS Dapur Multi-Station:** Pembagian tiket pesanan ke station Barista vs Hot Kitchen.
  5. **Persediaan Multi-Gudang GRN & Tutup Shift:** Penerimaan batch supplier dan rekonsiliasi kas shift *blind count*.

---

### 🛵 PILAR 5: COURIER & DRIVER DELIVERY COMPANION (`src/views/DriverDeliveryView.tsx`)
* **Aktor:** Kurir internal toko atau staf delivery outlet.
* **Fitur (`L1-15`):**
  1. **Antrean Pesanan Antar (Delivery Queue):** Notifikasi pesanan yang siap dikirim dari dapur/gudang.
  2. **Navigasi 1-Ketuk:** Tombol langsung menuju Google Maps / Waze dengan koordinat alamat pelanggan.
  3. **Bukti Pengiriman (Proof-of-Delivery / POD):** Upload foto serah terima barang + tanda tangan digital penerima.
  4. **Penyelesaian Pembayaran COD (Cash-on-Delivery):** Rekonsiliasi uang tunai yang ditagih di tempat pelanggan ke kasir toko.

---

## 🔄 3. INTEROPERABILITAS LINTAS PILAR (ZERO STATE DRIFT)

Semua 5 pilar beroperasi di atas **Single Source of Truth (SSOT)**:
* `MerchantConfigContext.tsx` ➔ Mengontrol konfigurasi toko, tema, dan kupon promo.
* `CustomerAuthContext.tsx` ➔ Mengelola akun member, saldo poin, dan tiket acara pelanggan.
* `DeliveryDispatchContext.tsx` ➔ Mengelola penugasan kurir, status perjalanan, dan bukti POD.
* `hfeCoreApi.ts` / `mockData.ts` ➔ Menjaga buku besar akuntansi, stok bahan, dan master kontak CRM.
