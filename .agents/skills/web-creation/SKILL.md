---
name: web-creation
description: Master SOP for engineering, scaffolding, decoupling, and styling high-performance, accessible web applications in the HFE Monorepo with 6-Tier Architecture, Tier 2 React Aria Primitives, Defensive Spatial Isolation, Zero Text-Collision, and Anti-Monolithic Decoupling.
version: "1.0.0"
updated_at: "2026-08-17"
---

# 🌐 Master SOP: Web Application Engineering & Decoupled Architecture Standard (v1.0.0)

Panduan operasional baku (*Standard Operating Procedure*) untuk merancang, membangun, mendekomposisi, dan menata aplikasi web modern di lingkungan monorepo **Headless Company Books (HFE)** dengan isolasi runtime bersih, aksesibilitas React Aria, dan arsitektur 6-Tingkat (*6-Tier Architecture*).

---

## 🏛️ PILAR 1: PRINSIP DEKOPEL MONOREPO & ANTI-MONOLITH (*Decoupled Multi-App Architecture*)

1. **Invarian 1 Aplikasi = 1 Runtime Terisolasi (*1 App = 1 Standalone Runtime*)**:
   - Setiap produk web adalah aplikasi mandiri dengan siklus hidup, bundler, dan target pengguna tersendiri:
     * **Aplikasi POS Kasir (`pos`)**: Khusus kasir, KDS dapur, floor plan, dan cache offline.
     * **Aplikasi Admin & Hub (`hub` / `admin`)**: Khusus Connect Hub Marketplace, manajemen konektor pihak ketiga, dan portal pemilik.
     * **Aplikasi Buku Besar (`book` / `cb-client`)**: Khusus akuntansi, bagan akun (CoA), jurnal, dan portal pajak.
   - 🚫 **Haram Menumpuk Semua Aplikasi ke dalam Satu `App.tsx` Monolitik** menggunakan ratusan switch `activeStaffSurface`.
2. **Prinsip Berbagi Hanya Lapisan Bawah (*Shared Downward Packages Only*)**:
   - Yang diizinkan di-share antar aplikasi HANYA:
     * **Tier 1 (Tokens)**: Variabel CSS warna, tipografi, dan spasi.
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

Setiap kartu, baris tabel, dan elemen presentasi wajib mematuhi aturan anti-tabrakan:

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

## ⚡ PILAR 4: ALUR PEMBUATAN APLIKASI WEB BARU (*App Scaffolding & Setup*)

Saat membangun aplikasi web baru di dalam monorepo:

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

---

## 🧪 PILAR 5: MODULARITAS KODE (<400 BARIS) & PENGUJIAN OTOMATIS (*Verification Gate*)

1. **Ambang Batas Modularitas (<400 baris)**:
   - Target panjang setiap file kode: `<400 baris` (batas mutlak `<500 baris`).
   - Jika file mendekati 400 baris, lakukan dekomposisi ke sub-komponen Tier 3 atau custom hooks.
2. **Pengujian Tanpa Asumsi (*Goal-Driven Headless Tests*)**:
   - Bangun test suite Vitest di `src/tests/` untuk memvalidasi rendering tanpa overlap teks.
   - Jalankan sentinel radar:
     ```bash
     python3 scripts/hfex-rad0.py
     ```
   - Pastikan **9/9 Pilar Hijau & 0 Celah Kritis**.
