---
okf_version: "0.2"
type: Development Plan Level 2
title: "Dedicated Marketing Landing Page for POS.Hfeit (pos.hfeit.com -> pos.hfeit.app)"
description: "Build a high-impact, monochrome luxury marketing landing page for POS.Hfeit on pos.hfeit.com using Tailwind Radiant patterns and restrained dual-color accents, driving merchant traffic to pos.hfeit.app."
tags: [development-plan, level-2, pos-landing, tailwind-radiant]
parent_level_1: l1-pos-storefront
github_issue: 0
status: Proposed
---

# Level 2 Implementation Plan: L2-POS-89 — Dedicated Marketing Landing Page `POS.Hfeit` (`pos.hfeit.com` ➔ `pos.hfeit.app`)

## 1. Outcome
Membangun halaman marketing landing page resmi untuk **`POS.Hfeit`** (`pos.hfeit.com`) di dalam sub-package `packages/storefront-astro/` dengan arsitektur **Tailwind Radiant (Monokrom Mewah + 2 Sentuhan Aksen Warna)** dan *high-impact merchant copywriting*, yang mengarahkan konversi merchant langsung ke aplikasi operasional kasir **`pos.hfeit.app`**.

## 2. Solution & Core Invariants

1. **Brand & Product Focus**:
   - Khusus produk kasir **`POS.Hfeit`**.
   - Modul `BOOK.Hfeit` (Buku Besar) dan `EXP.Hfeit` suite diisolasi dari halaman ini agar pesan pemasaran 100% tajam dan fokus pada kelancaran operasional kasir.

2. **Visual & Aesthetic Standard (Tailwind Radiant Pattern)**:
   - **Monokrom Mewah (95%)**: Silver-graphite canvas (`#F4F4F5` ➔ `#E4E4E7`), border 1px halus (`border-black/5`), kartu obsidian hitam (`#09090B`), dan tipografi *Plus Jakarta Sans* & *Inter*.
   - **Maksimal 2 Sentuhan Warna Terkendali (5%)**:
     - *Electric Indigo* (`#4F46E5`): Aksen brand utama pada headline (*paling sibuk*), tab kategori aktif, dan tombol bayar.
     - *Emerald Green* (`#10B981`): Status live operasional (*OFFLINE READY*, *SIAP DISAJIKAN*, *RELOKASI SELESAI*).

3. **High-Impact Merchant Copywriting**:
   - **Hero Headline**: *"Antrean panjang. Selesai tanpa kasir panik."*
   - **Hero Subtitle**: *"Didesain khusus untuk jam paling padat. Kasir merespons instan di bawah 16 milidetik, tiket pesanan terpecah otomatis ke dapur, dan transaksi tetap lancar meski internet mati total."*
   - **5 Bento Features**:
     1. *Dapur & Barista*: Tiket otomatis terpisah ke stasiun yang tepat.
     2. *Manajemen Ruangan*: Pindah meja dan gabung tagihan dalam 1 ketuk.
     3. *Reliabilitas*: Internet mati total, kasir tetap jualan (100% offline).
     4. *Self-Order*: Tamu pesan mandiri QR meja, 0% potongan komisi aplikasi.
     5. *Keamanan Staf*: Nol kebocoran kas dengan otorisasi PIN supervisor (RBAC).

4. **Domain & Routing Topology**:
   - Public Marketing Web: **`https://pos.hfeit.com`**
   - Live Cashier App: **`https://pos.hfeit.app`** (dan `/demo` untuk simulasi interaktif).

## 3. File Execution Scope
- `packages/storefront-astro/src/pages/index.astro`: Halaman utama `pos.hfeit.com`.
- `packages/storefront-astro/src/layouts/PosLayout.astro`: Layout khusus POS dengan metadata SEO & OpenGraph.
- `packages/storefront-astro/src/components/pos/PosHeroSection.astro`: Hero section dengan Radiant canvas & floating hardware terminal register.
- `packages/storefront-astro/src/components/pos/PosBentoGrid.astro`: Bento grid 5 pilar keunggulan kasir.
- `packages/storefront-astro/src/components/pos/PosBottomCta.astro`: Bottom CTA banner menuju `pos.hfeit.app`.
- `packages/storefront-astro/src/components/pos/PosNavbar.astro` & `PosFooter.astro`: Header & footer navigasi minimalis.
- `src/tests/posLandingPage.test.ts`: Unit test suite validasi struktur, copywriting, dan link `pos.hfeit.app`.

## 4. Explicit Exclusions
- `exp.hfeit.com` (Master Suite Overview) ditunda dan tidak diaktifkan pada milestone ini.
- `BOOK.Hfeit` (Akuntansi/Ledger) dikeluarkan dari alur marketing halaman ini.
- Tidak ada modifikasi pada kernel akuntansi backend Hfe Core.

## 5. Verification Plan
1. `npm run build --prefix packages/storefront-astro` (Astro static build exit 0).
2. `npm run test -- src/tests/posLandingPage.test.ts` (Vitest unit tests 100% PASS).
3. `./scripts/ci-local.sh` (100% PASS di seluruh 128 test files).
4. Playwright visual audit capture screenshot resolusi penuh.
