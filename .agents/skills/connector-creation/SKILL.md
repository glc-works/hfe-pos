---
name: connector-creation
description: Master SOP for engineering, auditing, cataloging, migrating, and bi-directionally syncing Ecosystem Connectors (Xero, QuickBooks, Moka, Accurate, Mekari Jurnal, BCA SNAP, Stripe, Shopify, SAP) in Connect Hub, with Raw Facts Recalculation, 3-Way Reconciliation, and Proactive Feature Reverse-Adoption.
---

# 🔌 Ecosystem Connector Creation & Integration Standard (7-Pillar SOP)

Panduan operasional baku (*Standard Operating Procedure*) untuk membangun, mengaudit, mempublikasikan ke Store, memigrasikan data, dan menyinkronkan konektor ekosistem pihak ketiga ke dalam **Headless Company Books (HFE)**.

---

## 🏛️ PILAR 1: AUDIT & PEMETAAN API SUMBER (*The 4-Dimensional Audit Matrix*)

Sebelum menulis kode atau melakukan integrasi database, lakukan **Audit 4-Dimensi** terhadap API sumber:

### 1. Penemuan Endpoint (*Endpoint & Capability Discovery*)
- Identitas & Valas: Organisasi, mata uang fungsional, dan daftar valas aktif.
- Fondasi Akuntansi: Bagan Akun (CoA), tarif pajak, dan kategori pelacakan/cabang (*Tracking Categories*).
- Data Master: Kontak pelanggan/vendor (NPWP/Tax ID, terms) dan katalog produk/SKU.
- Transaksi: Faktur AR/AP, pembayaran kas, transfer bank, dan jurnal memorial.
- Memori Operasional: Aturan bank (*Bank Rules*), tagihan berulang (*Repeating Invoices*), dan segel tutup buku (*Period Locks*).

### 2. Klasifikasi Fakta Mentah vs Angka Kalkulasi (*Raw Fact Classifier*)
- 🟢 **Tandai `RAW_FACT` (Wajib Diingest)**:
  * `Quantity`, `UnitPrice (minor units)`, `Discount %`, `Tax Code Identifier`, `Exchange Rate`, `Timestamps`.
- 🚫 **Tandai `CALCULATED_FIELD` (Haram Dipercaya / Wajib Dihitung Ulang)**:
  * `Subtotal`, `TaxAmount`, `DiscountAmount`, `GrandTotal`, `COGS`, `EndingBalance`.

### 3. Audit Protokol & Limit Jaringan (*Transport & Throttling Limits*)
- Catat batasan rate limit (misal: 60 req/min ➔ gunakan penunda antrean cerdas 1 req/detik).
- Tentukan strategi paginasi: Jendela tanggal (*Date-Window Partitioning*) atau kursor.
- Identifikasi siklus masa berlaku token OAuth2 dan mekanisme *Refresh Token*.

### 4. Matriks Pemetaan ke Kernel HFE (*Target Schema Mapping Matrix*)
- Petakan setiap properti JSON sumber ke tabel tujuan di database PostgreSQL HFE.
- **Invarian Entitas**: 1 Buku = 1 Entitas Hukum Perusahaan. Rekening bank valas dipetakan langsung ke `account.currency` di dalam bagan akun yang sama.

---

## 🛍️ PILAR 2: PENERJEMAHAN KEMAMPUAN KE STORE (*App Store & Marketplace Authoring*)

Setiap konektor wajib memiliki entri katalog di Connect Hub Store (`src/components/core/hub/`):

1. **Headline Proposisi Nilai**: Masalah bisnis utama yang diselesaikan.
2. **Badge Kemampuan Nyata (*Derived Feature Badges*)**:
   - `[⚡ Auto Bank Clearing]`: Jika API memiliki endpoint aturan bank.
   - `[🔁 B2B Subscriptions]`: Jika API memiliki endpoint tagihan berulang.
   - `[🏬 Multi-Branch Outlets]`: Jika API memiliki dimensi cabang/departemen.
   - `[🎨 Custom PDF Branding]`: Jika API memiliki kustomisasi logo & tema faktur.
   - `[🏭 Asset Depreciation]`: Jika API memiliki register aset tetap.
3. **Kisah Use Case Bisnis**: Target profil merchant yang paling diuntungkan.
4. **Izin Akses Minimal (*Least-Privilege Scopes*)**: Cantumkan hak akses RBAC minimum yang dibutuhkan (misal: `['ledger:post', 'accounts:read']`).

---

## 🔐 PILAR 3: PENGELOLAAN AUTENTIKASI & KREDENSIAL (*Auth Handshake & Credentials*)

1. **Form Kredensial UI (`ConnectorInstallModal.tsx`)**:
   - Menyediakan form input terisolasi untuk `ClientId`, `ClientSecret`, `TenantId`, dan `WebhookSecret`.
2. **Uji Ping Koneksi Otomatis**:
   - Menguji konektivitas ke server eksternal sebelum menyimpan kredensial.
3. **Pengelolaan Token Aman**:
   - Menyimpan refresh token secara terenkripsi dan melakukan peremajaan token sebelum kedaluwarsa.

---

## 📦 PILAR 4: MESIN MIGRASI 1-KLIK & REKONSILIASI 3-ARAH (*The 3-Way Recon Invariant*)

Saat melakukan migrasi data dari sistem lama:

1. **Prinsip Ingest Fakta Mentah**:
   - Ambil hanya kuantitas dan harga satuan. Hitung ulang seluruh subtotal, pajak PB1/GST, dan grand total menggunakan Kernel Deterministik HFE.
2. **Ekstraksi 8 Dimensi Memori Operasional**:
   - Serap cabang, aturan bank, langganan rutin, peran staf, plafon piutang, dan jadwal depresiasi aset secara otomatis.
3. **Protokol Rekonsiliasi 3-Arah (*3-Way Recon Gate*)**:
   - *Recon 1 (Neraca Saldo)*: Membandingkan saldo tiap akun ($\Delta = |\text{HFE} - \text{Sumber}|$).
   - *Recon 2 (Rekening Bank)*: Membandingkan saldo akhir kas per rekening bank luar vs HFE.
   - *Recon 3 (Buku Pembantu AR/AP)*: Membandingkan sisa tagihan per pelanggan & vendor.
4. **Penanganan Selisih Pembulatan**:
   - Selisih desimal bawaan $\le \$0.05 / \text{Rp } 50$ dialokasikan otomatis ke akun `4390 (Rounding Adjustment)`.
   - Hasil klop sempurna ($\Delta == \$0.00$) menerbitkan **Sertifikat Audit WTP**.

---

## ⚡ PILAR 5: SINKRONISASI REAL-TIME DUA ARAH (*Bi-Directional Event Relay*)

1. **Inbound Webhook Relay**:
   - Memvalidasi tanda tangan kriptografi `HMAC-SHA256` pada header webhook masuk.
   - Memeriksa `X-Idempotency-Key` / `EventID` untuk mencegah pemotongan saldo ganda.
   - Menerjemahkan payload luar dan memanggil API resmi `POST /api/v2/postings`.
2. **Outbound Shift Synchronization**:
   - Saat kasir POS tutup shift (Z-Report), ringkasan omzet dan pajak diteruskan secara asinkron ke sistem akuntansi eksternal via HTTP client resmi.

---

## 🧪 PILAR 6: PENGUJIAN INVARIAN & MODULARITAS KODE (*Testing & Modularity Gate*)

1. **Uji Komponen Frontend (Vitest)**:
   - Pastikan modal instalasi, toggle izin, dan tabel rekonsiliasi memiliki pengujian unit di `src/tests/`.
2. **Kepatuhan Modularity File Limit**:
   - Setiap berkas konektor wajib `<400 baris` (batas mutlak `<500 baris`).
3. **Verifikasi Fuzzer Properti**:
   - Jalankan fuzzer matematis untuk membuktikan tidak ada kebocoran nilai debet-kredit pada payload transaksi acak.

---

## 🔄 PILAR 7: ADOPSI TERBALIK & USULAN FITUR BARU (*The Reverse-Adoption Loop*)

Saat mengaudit API luar, jika menemukan pola desain yang superior:

1. **Introspeksi Kernel**: Periksa apakah HFE sudah memiliki fitur tersebut (`python3 scripts/hfe.py search "<keyword>"`).
2. **Formulasi Usulan Fitur**: Jika HFE belum memiliki atau bisa diperkuat, buat dokumen **Level-2 Feature Proposal** di `docs/active/plans/level-2/`:
   - 🌟 *Inspirasi Sumber*: Pola API eksternal yang ditemukan.
   - 💡 *Nilai Tambah*: Manfaat bagi merchant dan arsitektur HFE.
   - 🏛️ *Rancangan Teknis*: Skema database, DTO endpoint API, dan komponen UI.
