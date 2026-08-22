# Level 2 Plan: L2-POS-88 — Flagship Landing Page `EXP.Hfeit` (Ecosystem Suite) via Astro 7.2

## 1. Problem & Context
EXP.Hfeit adalah brand payung resmi Lapisan Pengalaman Ekosistem Bisnis (*Ecosystem Business Experience Layer*) yang memayungi 6 produk: `ADMIN.Hfeit`, `POS.Hfeit`, `BOOK.Hfeit`, `CARD.Hfeit`, `BOARD.Hfeit`, dan `ORDER.Hfeit`.
Saat ini belum terdapat halaman landing flagship yang secara terpadu memperkenalkan ke-6 produk tersebut kepada calon pengusaha/merchant dengan bahasa humanis, fokus menyelesaikan 4 pain point utama (*anti-pusing / zero jargon*), serta menyediakan pintu masuk pendaftaran onboarding yang mulus.

## 2. Solution & Core Invariants
Membangun halaman **Flagship Landing Page `EXP.Hfeit`** di dalam sub-package **`packages/storefront-astro`** berbasis **Astro 7.2 (Cloudflare Edge)**:
1. **Astro 7.2 Architecture**:
   - Zero-JS by Default untuk cangkang marketing dengan LCP < 400ms dan Core Web Vitals 100/100.
   - Built-in `<ClientRouter />` View Transitions untuk transisi halaman mulus tanpa kedip putih.
   - Component Islands (`client:visible`) untuk simulasi interaktif alur *One Transaction. One Truth.*
2. **Pain-Point-First Copywriting (Humanis & Zero-Jargon)**:
   - Menghantam 4 masalah pengusaha: (1) Capek rekap manual & selisih kas (`BOOK`), (2) Kasir lemot saat offline (`POS`), (3) Tercekik komisi ojek online 20%-30% (`ORDER` & `BOARD`), (4) Pusing pantau banyak cabang (`ADMIN`).
3. **The Core Sextet Interactive Bento Grid (2026+ Spatial Design)**:
   - 6 kartu bento dengan warna aksen terisolasi: `ADMIN` (Indigo), `POS` (Amber), `BOOK` (Emerald), `CARD` (Purple), `BOARD` (Cyan), `ORDER` (Rose).
4. **Multi-Language (i18n) & Smart Geo-Detection**:
   - Deteksi otomatis negara via Edge header `CF-IPCountry` & `Accept-Language` (`ID` untuk lokal, `EN` untuk turis/internasional).
   - Kapsul switcher manual `[ 🇮🇩 ID | 🇬🇧 EN ]` di header dan footer dengan persistensi cookie `hfe_lang` & `localStorage` (pilihan manual selalu mengalahkan geo-detection).
5. **High-Conversion Onboarding CTA Gateway**:
   - Tombol `[ 🚀 Daftarkan Usaha Anda (Gratis) ➔ ]` mengalirkan calon merchant langsung ke **Store Onboarding Wizard 5-Langkah** (`/onboarding`).

## 3. File Execution Scope
- `packages/storefront-astro/package.json` (Astro ^7.2.0)
- `packages/storefront-astro/src/i18n/translations.ts` (Kamus terjemahan ID & EN lengkap)
- `packages/storefront-astro/src/i18n/langResolver.ts` (Resolver Geo-Detection & Cookie)
- `packages/storefront-astro/src/components/common/LanguageSwitcher.astro` (Kapsul switch manual [ ID | EN ])
- `packages/storefront-astro/src/components/exp/ExpHeroSection.astro` (Hero 2026+ Spatial dengan CTA Onboarding)
- `packages/storefront-astro/src/components/exp/ExpPainPointsSection.astro` (4 Solusi Masalah Pengusaha)
- `packages/storefront-astro/src/components/exp/ExpProductSextetGrid.astro` (Bento Grid 6 Produk)
- `packages/storefront-astro/src/components/exp/ExpOneTruthWorkflow.astro` (Simulasi 1 Transaksi ke 6 Produk)
- `packages/storefront-astro/src/components/exp/ExpIndustrySelector.astro` (Multi-Vertikal Industri)
- `packages/storefront-astro/src/components/exp/ExpLaunchpadCta.astro` (CTA Pendaftaran & Onboarding)
- `packages/storefront-astro/src/pages/exp/index.astro` (Halaman Utama EXP.Hfeit)
- `src/views/ExpSuiteLandingView.tsx` (In-app preview di POS)
- `src/tests/expSuiteLandingAndProductSextet.test.ts` (Unit test suite)

## 4. Verification Criteria
1. Sub-package Astro tervalidasi dengan build mandiri (`astro check && astro build`).
2. Unit tests Vitest memvalidasi:
   - Integritas 6 produk EXP.Hfeit dan tautan CTA onboarding.
   - Resolusi multi-bahasa (ID & EN) dan persistensi switcher manual.
3. CI Local Gate `./scripts/ci-local.sh` 100% PASS (Modularity < 500 baris, Typecheck, Test Suites, Build, Size Budget).
