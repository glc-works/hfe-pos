---
name: connector-creation
description: Master SOP for engineering, auditing, cataloging, migrating, updating, and bi-directionally syncing Ecosystem Connectors (Xero, QuickBooks, Moka, Accurate, Mekari Jurnal, BCA SNAP, Stripe, Shopify, SAP) in Connect Hub, with Raw Facts Recalculation, 3-Way Reconciliation, and Proactive Feature Reverse-Adoption.
version: "2.1.0"
updated_at: "2026-08-17"
---

# 🔌 Master SOP: Ecosystem Connector Engineering, Audit & Lifecycle Standard (v2.1.0)

Panduan operasional baku (*Standard Operating Procedure*) untuk membangun, mengaudit kepatuhan, mendaftarkan ke Connect Hub, memigrasikan data, mengupdate versi API, dan menyinkronkan konektor ekosistem pihak ketiga ke dalam **Headless Company Books (HFE)** menggunakan tools kanonikal repositori.

---

## 🏛️ PILAR 1: AUDIT & PEMETAAN API SUMBER (*Tool-Driven API Discovery*)

Sebelum menulis kode atau melakukan integrasi database, lakukan audit terhadap API sumber:

1. **Introspeksi Kesiapan Kernel HFE**:
   - Jalankan tool CLI:
     ```bash
     python3 scripts/hfex.py search "<kata-kunci-domain>"
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
     * `slug`, `name`, `category`, `region`, `icon`, `summary`, `derivedBadges`, `requiredScopes`, `supportedVersions`.
3. **Konfigurasi Form Kredensial Modal & Sakelar Lingkungan**:
   - Buka `src/components/core/hub/ConnectorInstallModal.tsx` dan tentukan input kredensial serta sakelar `environment: 'sandbox' | 'production'`.
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

## ⚡ PILAR 4: SINKRONISASI REAL-TIME DUA ARAH & DLQ RETRY (*Resilient Event Relay*)

1. **Inbound Webhook Relay**:
   - Validasi tanda tangan kriptografi `HMAC-SHA256`.
   - Validasi `X-Idempotency-Key` / `EventID` untuk mencegah duplikasi transaksi.
   - Terjemahkan payload dan panggil API resmi `POST /api/v2/postings`.
2. **Penanganan Kegagalan Jaringan (Exponential Backoff & DLQ)**:
   - Jika server pihak ketiga *down* (503/timeout), jalankan retry pada `1s`, `5s`, `30s`, `5m`, `30m`.
   - Payload gagal dipindahkan ke **Dead-Letter Queue (DLQ)** dengan kemampuan *Manual Replay*.
3. **Outbound Shift Synchronization**:
   - Saat kasir POS tutup shift (Z-Report), teruskan ringkasan jurnal omzet dan pajak ke sistem luar via HTTP client resmi.

---

## 🛡️ PILAR 5: AUDIT KEPATUHAN & KEAMANAN KONEKTOR (*5-Point Security Audit*)

Sebelum konektor dinyatakan stabil (*Stable Release*), wajib lolos **Audit 5 Poin**:

1. **Audit Anti-Calculated Field**: Pastikan tidak ada endpoint DTO yang menerima `tax_amount` atau `grand_total` manual dari klien.
2. **Audit Tanda Tangan Webhook**: Pastikan seluruh webhook listener menolak payload tanpa `HMAC-SHA256` yang valid.
3. **Audit Idempotensi**: Pastikan penembakan 5 request duplikat serentak tidak menimbulkan pemotongan saldo ganda.
4. **Audit Isolasi Tenant**: Pastikan kredensial Tenant A tidak dapat mengakses buku besar Tenant B.
5. **Verifikasi Master Radar**:
   ```bash
   python3 scripts/hfex-rad0.py
   ```
   Assert: **0 Critical Gaps** & seluruh berkas kode `<400 baris` (batas mutlak `<500 baris`).

---

## 🔄 PILAR 6: PROTOKOL PEMBARUAN & VERSI API KONEKTOR (*Connector Version Upgrades*)

Saat pihak ketiga merilis versi API baru (misal: Xero API v3, DJP Coretax v4.0, SNAP BI upgrade):

1. **Audit Changelog & Diff Skema**:
   - Bandingkan DTO versi lama vs versi baru. Identifikasi field yang dihapus (*deprecated*) atau format baru.
2. **Perbarui Metadata Versi**:
   - Tambahkan versi baru ke `supportedVersions` di `src/components/core/hub/connectorsData.ts` (misal: `['v3.2', 'v4.0-coretax']`).
3. **Adaptor Kompatibilitas Mundur (*Backwards-Compatible Transformer*)**:
   - Bangun transformer yang mampu menerima versi lama maupun versi baru secara dinamis tanpa memutus koneksi merchant yang belum upgrade.
4. **Deteksi Data Drift Historis (*Historical Drift Heartbeat*)**:
   - Audit berkala untuk mendeteksi apakah data historis di sistem luar diubah/dihapus secara sepihak.
5. **Prosedur Pencabutan (*Unlink & De-Provisioning*)**:
   - Saat merchant memutuskan koneksi, cabut token OAuth2 namun **pertahankan seluruh jejak audit jurnal historis**.

---

## 💡 PILAR 7: ADOPSI TERBALIK & USULAN FITUR BARU (*The Reverse-Adoption Loop*)

Saat mengaudit atau mengupdate konektor luar, jika menemukan pola desain yang unggul dan belum dimiliki HFE:

1. Jalankan `python3 scripts/hfex.py search "<keyword>"` untuk memastikan apakah HFE sudah memiliki fitur tersebut.
2. Jika belum ada, susun dokumen **Level-2 Feature Proposal** di `docs/active/plans/level-2/`:
   - 🌟 *Inspirasi Sumber*: Pola API eksternal yang ditemukan (misal: Stripe Test Clocks, Xero Bank Rules).
   - 💡 *Nilai Tambah*: Manfaat bagi merchant dan keunggulan arsitektur HFE.
   - 🏛️ *Rancangan Teknis*: Skema database, DTO endpoint API, dan komponen UI.

---

## 🎓 PILAR 8: PROTOKOL PENYEMPURNAAN SKILL VIA `/learn` (*Skill Versioning & Continuous Refinement*)

Jika selama implementasi ditemukan kasus tepi (*edge-case*) baru:

1. Panggil perintah `/learn` untuk memperbarui berkas `SKILL.md` ini secara modular.
2. Naikkan nomor versi semantik di header YAML (`version: "2.x.x"`).
3. Sinkronkan pembaruan skill ke kedua repositori dan validasi dengan `python3 scripts/hfex-rad0.py`.
