# Level 2 Implementation Plan: L2-POS-87 — Decoupled Universal SEO Storefront via Astro (`BOARD.Hfeit`)

- **Issue / Tracking**: L2-POS-87
- **Owner**: `github:convergenceID`
- **Domain**: `BOARD.Hfeit` (Public Storefront & SEO Discovery) & `ORDER.Hfeit` (Online & QR Transactions)
- **Status**: IN_PROGRESS

---

## 1. Context & Architectural Problem

Menggabungkan halaman etalase publik merchant (`board.hfeit.com/[namespace]`) ke dalam client-side React SPA (`hfe-pos`) membebani browser dengan bundle JavaScript besar, memperlambat First Contentful Paint (FCP) pada jaringan 3G/4G, serta tidak optimal untuk crawler Googlebot dan media sosial (WhatsApp / Instagram / Twitter preview).

### Solusi:
Membangun sub-package **`packages/storefront-astro`** berbasis **Astro 7.2 (SSR/SSG di Cloudflare Edge)** dengan arsitektur *Islands of Interactivity*, *Server Islands*, dan *`<ClientRouter />` View Transitions*, menghasilkan Core Web Vitals 100/100, Schema.org `Restaurant` & `MenuItem` JSON-LD terindeks Google, dan deep-link transfer keranjang (*Cart Handoff*) instan ke `order.hfeit.com/[namespace]`.

---

## 2. Universal 5-Pillar Architecture Alignment

1. **Hfe Core SSOT**: Produk (termasuk tiket event `category: 'event_ticket'`), diskon penjualan (`sales::discounts`), dan profil tenant bersumber dari Hfe Core.
2. **Single Control Plane di POS**: Seluruh kosmetik dan 5 saklar saluran (`enableDineInQr`, `enableTakeaway`, `enableOnlineDelivery`, `enableTableReservation`, `enableEventTicketing`) diatur melalui Pengaturan POS.
3. **Zero Redundansi**: 100% data profil legal, cabang, nomor WhatsApp, jam operasional, dan WiFi diwarisi otomatis (*Auto-Inheritance*).
4. **Mobile Numero Uno (360px–390px)**: Desain 2026+ Spatial Bento Grid, monospaced tabular numbers, dan sticky thumb action dock.
5. **Direct SDK Usage**: Astro memanggil `@hfe/sdk` langsung di edge tanpa lapisan adapter perantara.

---

## 3. File Execution Scope

- `packages/storefront-astro/package.json`
- `packages/storefront-astro/astro.config.mjs`
- `packages/storefront-astro/tsconfig.json`
- `packages/storefront-astro/src/layouts/MerchantStorefrontLayout.astro`
- `packages/storefront-astro/src/pages/[merchant]/index.astro`
- `packages/storefront-astro/src/pages/[merchant]/menu/[item].astro`
- `packages/storefront-astro/src/pages/[merchant]/events/[event].astro`
- `packages/storefront-astro/src/pages/index.astro`
- `packages/storefront-astro/src/components/hero/HeroProfileSection.astro`
- `packages/storefront-astro/src/components/promo/PromoHubSection.astro`
- `packages/storefront-astro/src/components/events/EventTicketingSection.astro`
- `packages/storefront-astro/src/components/catalog/PublicMenuCatalog.astro`
- `packages/storefront-astro/src/components/reservation/TableReservationForm.astro`
- `packages/storefront-astro/src/components/navigation/StickyActionDock.astro`
- `packages/storefront-astro/src/components/seo/JsonLdRestaurant.astro`
- `packages/storefront-astro/src/components/seo/JsonLdMenuItem.astro`
- `packages/storefront-astro/src/components/seo/OpenGraphMeta.astro`
- `packages/storefront-astro/src/lib/merchantDataResolver.ts`
- `packages/storefront-astro/src/lib/channelGovernance.ts`
- `src/types/pos.ts` (StorefrontChannelToggles & StorefrontCustomizationConfig updates)
- `src/tests/astroStorefrontAndChannelGovernance.test.ts` (Unit test suite)

---

## 4. Verification Criteria

1. Sub-package Astro tervalidasi dengan build mandiri.
2. Unit tests di Vitest memvalidasi:
   - Resolusi data merchant & auto-inheritance profil.
   - Evaluasi saklar saluran (Dine-in, Takeaway, Delivery).
   - Generasi Schema.org JSON-LD structured data.
   - Serialisasi dan deserialisasi URL cart handoff ke ORDER.
3. Menjalankan `./scripts/ci-local.sh` dengan hasil 100% PASS dan modularitas < 500 baris.
