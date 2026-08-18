---
name: web-creation
description: Master SOP for engineering, scaffolding, inspecting, updating, auditing, styling with Design Tokens, and authoring Storybook 4-Quadrant Visual Suites in the HFE Monorepo with 6-Tier Architecture, Tier 2 React Aria Primitives, Modern Web Guidance Best Practices, and Anti-Monolithic Decoupling.
version: "1.4.0"
updated_at: "2026-08-17"
---

# 🌐 Master SOP: Web Application Engineering, Modern Standards & Design System (v1.4.0)

> ⚠️ **NORMATIVE AUTHORITY & SSOT ANCHORS**:
> Dokumen ini berstatus operasional (*executable SOP*) dan terikat secara mutlak pada hierarki kontrak kanonikal:
> 1. [`ARCHITECTURE.md`](file:///Users/aldi/claudefiles/headless-company-books/ARCHITECTURE.md) — Kontrak Teknis Tertinggi.
> 2. [`GLC-ENG-STD-001`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/standards/GLC-ENG-STD-001.md) — Standar Rekayasa GLC Approved.
> 3. [`POS-ENG-STD-001` & `HFE-UI-STD-001`](file:///Users/aldi/claudefiles/hfe-pos/scripts/hfex-rad0.py) — Standar 9-Pilar UI/UX HFE.
> 4. [`AGENTS.md`](file:///Users/aldi/claudefiles/headless-company-books/AGENTS.md) — Aturan Isolasi Spasial Defensif & Arsitektur 6-Tingkat.
> 5. [`docs/active/reference/openapi.json`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/reference/openapi.json) — Kontrak API OpenAPI 3.1.
> 6. [Modern Web Guidance Standards](file:///Users/aldi/.gemini/config/plugins/modern-web-guidance-plugin/skills/modern-web-guidance/SKILL.md) — Praktik Baku Web Modern (Baseline Widely Available).

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

## 🛡️ PILAR 3: STANDAR ISOLASI SPASIAL DEFENSIF (*Defensive Spatial Isolation & Zero Collision*)

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

## 👑 PILAR 4: SELERA DESAIN TINGGI & 10 LARANGAN KLISE (*Design Taste & Anti-Cliché Standard*)

1. **Prinsip Utama: Function-Driven Design**:
   - Bentuk visual wajib mengabdi pada kecepatan operasional kasir dan kejelasan pembukuan.
2. **Less, but Better**:
   - Setiap piksel, border, dan bayangan (*shadow*) harus memiliki alasan fungsional.
3. 🚫 **10 Larangan Pola Desain Klise (*Forbidden Tropes*)**:
   * ❌ *No Dashboard Overuse* (Jangan memaksakan layout dashboard pada halaman yang butuh tabel/kanban fokus).
   * ❌ *No Purple on Dark* (Haram memakai font ungu/violet neon di atas latar gelap).
   * ❌ *No Colored Border Glows* (Garis tepi menyala neon dilarang; gunakan border solid/halus).
   * ❌ *No Huge Untracked Typefaces* (Judul besar tanpa letter-spacing terkalibrasi).
   * ❌ *No Textureless Surfaces* (Wadah datar tanpa kedalaman visual subtle).
   * ❌ *No Icon-Stuffed Bento Boxes* (Bento box dijejali ikon acak tak bermakna).
   * ❌ *No Pulsing Biscuit Pills* (Badge kapsul dengan titik berkedip di atas headline).
   * ❌ *No Gradient Keywords* (Teks warna-warni gradien di kata kunci).
   * ❌ *No Grid Backgrounds* (Latar belakang jaring-jaring garis).
   * ❌ *No Over-Nested Cards* (Kartu di dalam kartu di dalam kartu).

---

## 🎨 PILAR 5: PEMBUATAN & SINKRONISASI DESIGN TOKEN (*Design Token Lifecycle Standard*)

1. **Lokasi & Format Token**:
   - **Global CSS Variables**: Didefinisikan di `src/index.css` dalam format HSL: `hsl(var(--color-primary) / <alpha>)`.
   - **Preset Tema**: Terdaftar di `src/data/mockData.ts` (`BUILTIN_THEMES`).
2. **Penamaan Semantik Baku**:
   - Background: `--color-bg-canvas`, `--color-bg-surface`, `--color-bg-card`.
   - Border: `--color-border-subtle`, `--color-border-focus`, `--color-border-accent`.
   - Text: `--color-text-primary`, `--color-text-muted`, `--color-text-tabular`.
   - State: `--color-brand-primary`, `--color-danger`, `--color-warning-amber`.
3. **Anti-Hardcoded Colors Invariant**:
   - 🚫 Dilarang menggunakan nilai warna hex ad-hoc (misal `#1e293b`) di komponen.
   - ✅ Gunakan semantic token classes Tailwind/CSS yang terhubung ke variabel root.
4. **Sinkronisasi Token Lintas Workspace**:
   ```bash
   npm run tokens:sync
   ```

---

## 📚 PILAR 6: PENGGUNAAN & PEMBUATAN STORYBOOK (*Storybook 4-Quadrant Visual Suite*)

1. **Struktur Direktori Story**:
   - `src/stories/components/` ➔ Atom Tier 2 & Widget Tier 3 (`PriceTag.stories.tsx`, `TableCard.stories.tsx`).
   - `src/stories/scenarios/` ➔ Simulasi skenario E2E (`SCN_01_01_01_BsdCafeSplitBill.stories.tsx`).
   - `src/stories/onboarding/` ➔ Wizard onboarding (`StoreOnboardingWizard.stories.tsx`).
2. **Kewajiban 4-Kuadran di Setiap File Story (*4-Quadrant Rule*)**:
   Setiap storybook wajib mengekspor 4 varian data ekstrem (`Q1_Empty`, `Q2_Short`, `Q3_Overflow`, `Q4_MultiState`).
3. **Pengujian Interaktif `play()` Function**:
   - Gunakan fungsi `play()` dari `@storybook/test` untuk mengotomasi simulasi klik kasir, open-tab, dan QRIS.
4. **Perintah Menjalankan & Mengaudit Storybook**:
   ```bash
   npm run storybook
   python3 scripts/radar/story_sync.py --audit
   ```

---

## ♿ PILAR 7: AKSESIBILITAS & KEYBOARD SHORTCUTS (*A11y & WCAG 2.2 AA*)

1. **Target Sentuh Minimum 44x44px**:
   - Semua tombol dan kontrol sentuh wajib memiliki ukuran area sentuh minimal `min-h-[44px] min-w-[44px]`.
2. **Navigasi Keyboard Penuh**:
   - Dialog modal wajib mendukung penutupan via tombol `Esc` dan perangkap fokus (`focus-trap`).
   - Sediakan hotkeys operasional kasir (misal `F2` untuk Bayar, `F4` untuk Cetak Struk).
3. **Indikator Cincin Fokus Eksplisit**:
   - Setiap elemen yang dapat difokuskan wajib memiliki `focus-visible:ring-2 focus-visible:ring-amber-500`.

---

## ⚡ PILAR 8: CORE WEB VITALS & OFFLINE-FIRST OPTIMISTIC UI (*Performance & Resilience*)

1. **Zero Layout Shift (CLS == 0.00)**:
   - Gunakan skeleton loader dengan dimensi tinggi dan lebar eksplisit sebelum data termuat.
2. **Optimistic UI Updates (INP < 50ms)**:
   - Perbarui state UI kasir secara instan (<16ms / 60fps), lalu kirim mutasi ke backend secara asinkron.
3. **Buffer Mutasi Offline-First**:
   - Jika koneksi terputus, simpan transaksi ke IndexedDB dan tampilkan badge status: `🟢 Online` / `⚡ Mode Offline`.

---

## 🔍 PILAR 9: TOOLS INTROSPEKSI & CARA CEK FITUR (*Zero-Guess Capability Check*)

1. **Tool Pencarian Semantik CLI**:
   ```bash
    python3 scripts/hfex.py search "<kata-kunci>"
   ```
2. **Tool Modern Web Guidance Search**:
   ```bash
   npx -y modern-web-guidance@latest search "<use-case>"
   ```
3. **Tool Inspeksi OpenAPI 3.1 & Komponen**:
   - Cari endpoint di `docs/active/reference/openapi.json` dan periksa `src/ui/`.

---

## 🧭 PILAR 10: PROTOKOL AUDIT 9-PILAR & DETEKSI CELAH (*9-Pillar Radar & Gap Detection*)

Jalankan sentinel auditor otomatis untuk mendeteksi pelanggaran standar UI:

```bash
python3 scripts/hfex-rad0.py
```

### 9 Pilar yang Diaudit Secara Otomatis:
1. **Modularity (<500 baris)** • 2. **Tier 2 React Aria** • 3. **Spatial Isolation** • 4. **Vitest Suites (100+)** • 5. **OpenAPI Parity** • 6. **Tabular Numbers** • 7. **Capacity Utilisation** • 8. **Vite Bundle Budget (<1.500 KB)** • 9. **Git Hygiene**.

---

## 🔄 PILAR 11: PROTOKOL PEMBARUAN & REFAKTOR AMAN (*Safe Refactoring Protocol*)

1. **Surgical Changes**: Sentuh hanya komponen target tanpa merusak styling tetangga.
2. **Downward Monotonic Edit**: Pastikan Tier 2 dilarang mengimpor komponen dari Tier 3-6.
3. **Uji Regresi Vitest**:
   ```bash
   npm test -- src/tests/<nama-test>.test.ts --run
   ```
4. **Verifikasi Modularity Gate**: Pastikan file yang diedit tetap **<400 baris** (batas mutlak <500 baris).

---

## 📋 PILAR 12: STANDAR PELAPORAN TEMUAN (*3-Part Retrospective & Health Scorecard*)

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
