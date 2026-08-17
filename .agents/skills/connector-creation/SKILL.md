---
name: connector-creation
description: Master SOP for engineering, auditing, cataloging, migrating, and bi-directionally syncing Ecosystem Connectors (Xero, QuickBooks, Moka, Accurate, Mekari Jurnal, BCA SNAP, Stripe, Shopify, SAP) in Connect Hub, with Raw Facts Recalculation, 3-Way Reconciliation, and Proactive Feature Reverse-Adoption.
---

# 🔌 Ecosystem Connector Creation Standard (Tool-Driven SOP)

Panduan operasional baku (*Standard Operating Procedure*) untuk membangun, mengaudit, mendaftarkan ke Connect Hub, memigrasikan data, dan menyinkronkan konektor ekosistem pihak ketiga ke dalam **Headless Company Books (HFE)** menggunakan tools kanonikal repositori.

---

## 🏛️ PILAR 1: AUDIT & PEMETAAN API SUMBER (*Tool-Driven API Discovery*)

Sebelum menulis kode atau melakukan integrasi database, lakukan audit terhadap API sumber:

1. **Introspeksi Kesiapan Kernel HFE**:
   - Jalankan tool CLI:
     ```bash
     python3 scripts/hfe.py search "<kata-kunci-domain>"
     ```
   - Periksa apakah domain kemampuan, skema database, atau endpoint terkait sudah ada di HFE.
2. **Validasi Kontrak OpenAPI 3.1**:
   - Buka dan periksa `docs/active/reference/openapi.json` untuk mencocokkan DTO request/response resmi HFE.
3. **Pemisahan Fakta Mentah vs Angka Hitungan (*The Anti-Calculated Field Law*)**:
   - 🟢 **Tandai `RAW_FACT` (Wajib Diingest)**: `Quantity`, `UnitPrice (minor units)`, `Discount %`, `Tax Code Identifier`, `Exchange Rate`, `Timestamps`.
   - 🚫 **Tandai `CALCULATED_FIELD` (Haram Dipercaya / Wajib Dihitung Ulang)**: `Subtotal`, `TaxAmount`, `DiscountAmount`, `GrandTotal`, `COGS`, `EndingBalance`.
4. **Audit Protokol & Limit Jaringan**:
   - Identifikasi batasan rate limit (misal: 60 req/min ➔ gunakan throttler antrean 1 req/detik), model paginasi (Date-Window / Cursor), dan masa berlaku token OAuth2.

---

## 🛍️ PILAR 2: REGISTRASI & PENERJEMAHAN KEMAMPUAN KE STORE (*Connect Hub Registration*)

Daftarkan konektor baru ke Connect Hub Marketplace menggunakan langkah berbasis data:

1. **Inspeksi Kategori & Wilayah Aktif**:
   - Buka berkas data kanonikal: `src/components/core/hub/connectorsData.ts`.
   - Pastikan `category` dan `region` yang dipilih valid terhadap tipe union TypeScript di berkas tersebut.
2. **Tambahkan Metadata Konektor**:
   - Tambahkan entri baru ke array `CONNECTORS_DATA` di `connectorsData.ts`:
     * `slug`, `name`, `category`, `region`, `icon`, `summary`, `derivedBadges`, `requiredScopes`.
3. **Konfigurasi Form Kredensial Modal**:
   - Buka `src/components/core/hub/ConnectorInstallModal.tsx` dan tentukan input kredensial (ClientId, ClientSecret, ApiKey, WebhookSecret).
4. **Konfigurasi Webhook Relay Panel**:
   - Daftarkan slug konektor ke `src/components/core/hub/WebhookRelayPanel.tsx` untuk pengujian tanda tangan `HMAC-SHA256`.
5. **Tambahkan Pengawal Anti-Regresi Vitest**:
   - Tambahkan slug konektor ke array `requiredSlugs` di `src/tests/connectorInstallModal.test.ts`.
   - Jalankan pengujian:
     ```bash
     npm test -- src/tests/connectorInstallModal.test.ts --run
     ```

---

## 📦 PILAR 3: MESIN MIGRASI 1-KLIK & REKONSILIASI 3-ARAH (*The 3-Way Recon Invariant*)

1. **Invarian Entitas & Valas Akun**:
   - **1 Buku = 1 Entitas Hukum Perusahaan** (`base_currency: "SGD"` atau `"IDR"`).
   - Rekening bank valas dipetakan langsung ke atribut `account.currency` di dalam bagan akun yang sama (DBS SGD ➔ `SGD`, DBS USD ➔ `USD`).
2. **Kalkulasi Deterministik**:
   - Ingest hanya fakta mentah atomik. Biarkan Kernel HFE menghitung ulang seluruh subtotal, beban pajak, dan jurnal debet-kredit seimbang ($Debits == Credits$).
3. **Protokol Rekonsiliasi 3-Arah (*3-Way Recon Gate*)**:
   - *Recon 1 (Neraca Saldo)*: Membandingkan saldo tiap akun ($\Delta = |\text{HFE} - \text{Sumber}|$).
   - *Recon 2 (Rekening Bank)*: Membandingkan saldo akhir kas per rekening bank luar vs HFE.
   - *Recon 3 (Buku Pembantu AR/AP)*: Membandingkan sisa tagihan per pelanggan & vendor.
4. **Penanganan Selisih Pembulatan**:
   - Selisih desimal bawaan $\le \$0.05 / \text{Rp } 50$ dialokasikan otomatis ke akun `4390 (Rounding Adjustment)`.
   - Hasil klop sempurna ($\Delta == \$0.00$) menerbitkan **Sertifikat Audit WTP**.

---

## ⚡ PILAR 4: SINKRONISASI REAL-TIME DUA ARAH (*Bi-Directional Event Relay*)

1. **Inbound Webhook Relay**:
   - Validasi tanda tangan kriptografi `HMAC-SHA256`.
   - Validasi `X-Idempotency-Key` / `EventID` untuk mencegah duplikasi transaksi.
   - Terjemahkan payload dan panggil API resmi `POST /api/v2/postings`.
2. **Outbound Shift Synchronization**:
   - Saat kasir POS tutup shift (Z-Report), teruskan ringkasan jurnal omzet dan pajak ke sistem luar via HTTP client resmi.

---

## 🧪 PILAR 5: PENGUJIAN INVARIAN & MASTER RADAR GATE (*Testing & Verification*)

1. **Uji Frontend & Backend**:
   - Jalankan suite pengujian:
     ```bash
     npm test
     cargo test --manifest-path hcb2/Cargo.toml --lib
     ```
2. **Verifikasi Master Radar & Modularity**:
   - Jalankan sentinel radar di kedua repositori:
     ```bash
     python3 scripts/hfe-rad0.py
     python3 ../hfe-pos/scripts/hfex-rad0.py
     ```
   - Assert: **0 Critical Gaps** & seluruh berkas kode `<400 baris` (batas mutlak `<500 baris`).

---

## 🔄 PILAR 6: ADOPSI TERBALIK & USULAN FITUR BARU (*The Reverse-Adoption Loop*)

Saat mengaudit API pihak ketiga, jika menemukan pola desain yang unggul dan belum dimiliki HFE:

1. Jalankan `python3 scripts/hfe.py search "<keyword>"` untuk memastikan apakah HFE sudah memiliki fitur tersebut.
2. Jika belum ada, susun dokumen **Level-2 Feature Proposal** di `docs/active/plans/level-2/`:
   - 🌟 *Inspirasi Sumber*: Pola API eksternal yang ditemukan (misal: Stripe Test Clocks, Xero Bank Rules).
   - 💡 *Nilai Tambah*: Manfaat bagi merchant dan keunggulan arsitektur HFE.
   - 🏛️ *Rancangan Teknis*: Skema database, DTO endpoint API, dan komponen UI.
