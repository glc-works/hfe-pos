---
name: web-creation
description: Master SOP for engineering, scaffolding, inspecting, updating, auditing, and reporting high-performance web applications in the HFE Monorepo with 6-Tier Architecture, Tier 2 React Aria Primitives, Defensive Spatial Isolation, Zero Text-Collision, and Anti-Monolithic Decoupling.
version: "1.2.0"
updated_at: "2026-08-17"
---

# 🌐 Master SOP: Web Application Engineering, Audit & Lifecycle Standard (v1.2.0)

> ⚠️ **NORMATIVE AUTHORITY & SSOT ANCHORS**:
> Dokumen ini berstatus operasional (*executable SOP*) dan terikat secara mutlak pada hierarki kontrak kanonikal:
> 1. [`ARCHITECTURE.md`](file:///Users/aldi/claudefiles/headless-company-books/ARCHITECTURE.md) — Kontrak Teknis Tertinggi.
> 2. [`GLC-ENG-STD-001`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/standards/GLC-ENG-STD-001.md) — Standar Rekayasa GLC Approved.
> 3. [`POS-ENG-STD-001` & `HFE-UI-STD-001`](file:///Users/aldi/claudefiles/hfe-pos/scripts/hfex-rad0.py) — Standar 9-Pilar UI/UX HFE.
> 4. [`AGENTS.md`](file:///Users/aldi/claudefiles/headless-company-books/AGENTS.md) — Aturan Isolasi Spasial Defensif & Arsitektur 6-Tingkat.
> 5. [`docs/active/reference/openapi.json`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/reference/openapi.json) — Kontrak API OpenAPI 3.1.

---

## 🏛️ PILAR 1: PRINSIP DEKOPEL MONOREPO & ANTI-MONOLITH (*Decoupled Multi-App Architecture*)

1. **Invarian 1 Aplikasi = 1 Target Runtime Terisolasi (*1 App = 1 Standalone Runtime*)**:
   - Setiap produk web di dalam monorepo adalah aplikasi mandiri dengan bundler dan port tersendiri:
     * **Aplikasi POS Kasir (`pos`)**: Khusus kasir, KDS dapur, floor plan, dan cache offline.
     * **Aplikasi Admin & Hub (`hub` / `admin`)**: Khusus Connect Hub Marketplace, manajemen konektor, dan portal merchant.
     * **Aplikasi Buku Besar (`book` / `cb-client`)**: Khusus akuntansi, bagan akun (CoA), jurnal, dan portal pajak.
   - 🚫 **Haram Menumpuk Semua Aplikasi ke dalam Satu `App.tsx` Monolitik** menggunakan puluhan *conditional switch*.
2. **Prinsip Berbagi Hanya Lapisan Bawah (*Shared Downward Packages Only*)**:
   - Yang diizinkan di-share antar aplikasi HANYA:
     * **Tier 1 (Tokens)**: Variabel CSS warna, tipografi, dan spasi di `src/index.css`.
     * **Tier 2 (Atoms)**: Komponen headless React Aria di `src/ui/` (`Button`, `Card`, `Badge`, `PriceTag`, `Input`).
     * **Tipe & Kontrak**: Definisi tipe TypeScript dan DTO OpenAPI 3.1.

---

## 📐 PILAR 2: HIRARKI DOMAIN 6-TINGKAT (*The 6-Tier Atomic Architecture*)

Semua komponen UI wajib ditempatkan secara disiplin pada salah satu dari 6 lapisan berikut (impor hanya boleh mengalir ke bawah, dilarang melompat ke atas):

```text
 ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
 │ • TIER 1: Design Tokens (`src/index.css`) ➔ HSL Color Palette, Safe-Area insets, Typography.   │
 │ • TIER 2: Headless React Aria Atoms (`src/ui/`) ➔ Button, Card, Badge, PriceTag, Input.        │
 │ • TIER 3: Domain Slot Widgets (`src/components/shared/`) ➔ TableCard, ProductCard, CartRow.    │
 │ • TIER 4: Widget Assemblies (`src/components/tables/`, `src/components/pos/`) ➔ FloorPlan.     │
 │ • TIER 5: Layout Templates (`src/layouts/`) ➔ PosHeader, AdminSidebar, ModalShell.             │
 │ • TIER 6: Smart Screens & Views (`src/views/`) ➔ UnifiedPosView, ConnectHubAdminView.          │
 └─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ PILAR 3: STANDAR ISOLASI SPASIAL DEFENSIF (*Defensive Spatial Isolation & Zero Text-Collision*)

1. **Zero Text-Collision & Sub-Container Mandiri**:
   - Data multi-variabel (ID meja, nama pelanggan, badge status, timer, nominal harga) **DILARANG** dijejalkan dalam satu baris horizontal tanpa sub-kontainer.
   - Gunakan `min-width: 0`, `truncate`, dan `overflow: hidden` pada teks dinamis.
2. **Penyajian Angka Moneter Tabular (*Tabular Monetary Figures*)**:
   - Semua nominal mata uang (misal: `Rp 120.000`, `$12.00`) wajib menggunakan angka tabular (`font-variant-numeric: tabular-nums` atau komponen `<PriceTag />`) untuk mencegah layout bergetar (*jitter*).
3. **Matriks Uji Stres 4-Kuadran (*4-Quadrant Content Matrix*)**:
   - **Q1 (Zero / Empty State)**: Nama kosong, Rp 0, 0m elapsed, status idle.
   - **Q2 (Extreme Short State)**: Inisial 1-2 huruf (`"Al"`), Rp 500, 1m elapsed.
   - **Q3 (Extreme Long / Overflow State)**: Nama panjang (`"Bpk. Alexander Raden Christopher III"`), nominal miliaran (`"Rp 1.850.000.000"`), timer 3-digit (`"120m"`).
   - **Q4 (Multi-State Variations)**: Status terpilih, peringatan billing, indikator split-bill.
4. **Proporsi Spasial Fibonacci ($5 : 8$)**:
   - Partisi baris teks dominan $\approx 62\%$ (`flex-[5] truncate`) vs angka hasil $\approx 38\%$ (`flex-[3] text-right font-mono tabular-nums`).
5. **Rasio Utilisasi Kapasitas F&B**:
   - Meja terisi menampilkan rasio kapasitas aktif (`👥 3/4 Kursi`), bukan kapasitas statis.
6. **Micro-Glyph Budgeting**:
   - Gunakan glif ringkas (**`👥 3/4`**, **`🍽️ 3`**, **`⏱️ 25m`**) untuk menghemat hingga 60% ruang horizontal.

---

## 🔍 PILAR 4: TOOLS INTROSPEKSI & CARA CEK KEBERADAAN FITUR (*Zero-Guess Capability Check*)

Sebelum merancang halaman baru, agen **WAJIB** mengecek apakah kapabilitas sudah ada di repositori:

1. **Tool Pencarian Semantik CLI**:
   ```bash
   python3 scripts/hfe.py search "<kata-kunci>"
   ```
2. **Tool Inspeksi OpenAPI 3.1**:
   - Cari endpoint resmi di `docs/active/reference/openapi.json`.
3. **Tool Inspeksi Komponen Eksisting**:
   - Gunakan `grep_search` pada `src/ui/` dan `src/components/` untuk mendeteksi atom/widget yang sudah siap pakai.

---

## 🧭 PILAR 5: PROTOKOL AUDIT 9-PILAR & DETEKSI CELAH (*9-Pillar Radar & Gap Detection*)

Jalankan sentinel auditor otomatis untuk mendeteksi pelanggaran standar UI:

```bash
python3 scripts/hfex-rad0.py
```

### 9 Pilar yang Diaudit Secara Otomatis:
1. **Pilar 1: Modularity & Line Limit (<500 baris)** ➔ Memastikan tidak ada file *god-component*.
2. **Pilar 2: Tier 2 React Aria & Monotonic Boundary** ➔ Memastikan impor tidak melompat ke atas.
3. **Pilar 3: Defensive Spatial Isolation & Anti-Collision** ➔ Memastikan safe-area, 100dvh, dan 4-kuadran.
4. **Pilar 4: Vitest Component & Domain Suites** ➔ Memvalidasi kelulusan seluruh unit test UI.
5. **Pilar 5: OpenAPI Contract & Connector Manifest** ➔ Memvalidasi izin dan `X-Idempotency-Key`.
6. **Pilar 6: Tabular Monetary Presentation** ➔ Memvalidasi `font-variant-numeric: tabular-nums`.
7. **Pilar 7: F&B Capacity Utilisation & Anti-Zigzag** ➔ Memvalidasi alur baca linear dan glif `👥`.
8. **Pilar 8: Vite Bundle Budget (<1.500 KB)** ➔ Memvalidasi *tree-shaking* dan ukuran chunk.
9. **Pilar 9: Git Hygiene & Fast Sentinel** ➔ Memvalidasi *working tree* bersih tanpa uncommitted changes.

---

## 🔄 PILAR 6: PROTOKOL PEMBARUAN & REFAKTOR AMAN (*Safe Refactoring Protocol*)

Saat mengupdate atau merefaktor halaman web:

1. **Surgical Changes**: Sentuh hanya komponen target. Jangan mengubah formatting file tetangga yang tidak bersalah.
2. **Downward Monotonic Edit**: Pastikan atom Tier 2 tidak pernah mengimpor komponen dari Tier 3-6.
3. **Uji Regresi Vitest**:
   ```bash
   npm test -- src/tests/<nama-test>.test.ts --run
   ```
4. **Verifikasi Modularity Gate**: Pastikan file yang diedit tetap **<400 baris** (batas mutlak <500 baris).

---

## 📋 PILAR 7: STANDAR PELAPORAN TEMUAN (*3-Part Retrospective & Health Scorecard*)

Setiap kali menemukan celah atau selesai melakukan pembaruan, agen wajib melaporkan dengan format baku:

```text
==========================================================================================================
 1. 🔍 ROOT CAUSE BREAKDOWN (Kenapa Terjadi Masalah/Celah)
==========================================================================================================
 [Penjelasan teknis akar masalah tanpa basa-basi atau permohonan maaf]

==========================================================================================================
 2. 🛡️ THE PERMANENT INVARIANT (Apa Aturan Baku yang Ditegakkan)
==========================================================================================================
 [Penjelasan kontrak teknis yang dijadikan benteng pertahanan permanen]

==========================================================================================================
 3. 🎯 ACTIONABLE FIX & VERIFICATION PROOF (Bukti Pengujian & Hasil Audit)
==========================================================================================================
 [Daftar file yang diperbaiki, output unit test 100% Green, dan status Master Radar 9/9 Pilar Sehat]
```

---

## ⚡ PILAR 8: ALUR SCAFFOLDING APLIKASI WEB BARU (*App Scaffolding Checklist*)

1. **Inisialisasi Non-Interaktif**:
   ```bash
   npx -y create-vite-app@latest ./ --template react-ts
   ```
2. **Pasang Dependensi Inti**:
   ```bash
   npm install react-aria-components lucide-react clsx tailwind-merge
   ```
3. **Hubungkan Tier 2 UI Primitives**:
   - Arahkan alias `@/ui` ke pustaka atom bersama (`src/ui/index.ts`).
4. **Konfigurasi CSS & Safe Areas**:
   - Terapkan `100dvh` dan safe-area insets (`env(safe-area-inset-top)`) pada kontainer utama.
