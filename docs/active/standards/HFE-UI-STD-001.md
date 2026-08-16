---
okf_version: "0.2"
type: Engineering & Design Standard
title: HFE-UI-STD-001 — Hfe Universal UI, Native Experience & Accounting Truth Standard
description: Authoritative, non-conflicting master standard unifying physical viewport geometry, Apple-grade native app parity, atomic DDD component taxonomy, offline ACID data resilience, and double-entry accounting truth for the Hfe Ecosystem.
tags: [standard, hfe-ui, design-system, golden-ratio, native-parity, offline-acid, accounting-truth]
status: Approved
effective_date: 2026-08-16
---

# 🏛️ HFE-UI-STD-001: HFE UNIVERSAL UI & EXPERIENCE SPECIFICATION

This standard is the single, non-conflicting source of truth for all frontend surfaces, components, viewport adaptations, offline resiliency mechanisms, and ledger integrations across **Hfe POS & Commerce Suite** (`glc-works/hfe-pos`) and its upstream companion **Headless Company Books** (`glc-works/headless-company-books`).

---

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 4 MASTER PILLARS OF HFE UNIVERSAL UI                                   │
├──────────────────────────┬──────────────────────────┬──────────────────────────┬───────────────────────┤
│ 📱 PILLAR I: HARDWARE    │ 🎨 PILLAR II: EXPERIENCE │ 🛡️ PILLAR III: RESILIENCE│ ⚖️ PILLAR IV: LEDGER  │
│    (Viewport & Parity)   │    (Atomic DDD & Tokens) │    (Offline ACID Storage)│    (Accounting Truth) │
├──────────────────────────┼──────────────────────────┼──────────────────────────┼───────────────────────┤
│ • 100dvh Rigid Shell     │ • 4-Tier Atomic DDD Scale│ • IndexedDB Physical Disk│ • Zero Shadow Balance │
│ • Zero Browser Artifacts │ • Smart View vs Pure Leaf│ • OS Low-Memory Guard    │ • Debit = Credit GL   │
│ • Golden Ratio 61.8:38.2%│ • Verb-First Microcopy   │ • Financial Truth 1st    │ • Idempotency UUID v4 │
│ • 8pt Rhythm & 44px Touch│ • Storefront Overrides   │ • Auto-Split Table/Price │ • Upstream Precedence │
└──────────────────────────┴──────────────────────────┴──────────────────────────┴───────────────────────┘
```

---

## 📱 PILLAR I: PHYSICAL VIEWPORT & NATIVE APP PARITY

### 1.1 Rigid App Shell & Zero Web Artifacts
1. **Root Viewport Locking**: The root container strictly declares `height: 100%`, `height: 100dvh`, and `overflow: hidden`. Outer window scrollbars are strictly forbidden.
2. **Elimination of Web Glitches**:
   - `overscroll-behavior-y: none` to eliminate rubber-band pull-to-refresh reload.
   - `-webkit-tap-highlight-color: transparent` to eliminate tap gray boxes.
   - `touch-action: manipulation` to eliminate 300ms double-tap zoom latency.
   - `user-select: none` (`select-none`) on all UI chrome, speed keys, table cards, and navigation buttons.
3. **Single Scroll Owner Invariant**: Exactly ONE element per active view may declare `flex-1 min-h-0 overflow-y-auto overscroll-contain`.
4. **Instant Tactile Feedback**: All touchable elements must provide visual feedback in `< 16ms` (`active:scale-[0.97]` atau `active:scale-95`).

### 1.2 Mathematical Proportions & Spatial Rhythm
1. **Golden Ratio Dual-Pane Split ($\phi \approx 1.618$)**:
   - Landscape terminals (1024px – 1440px) divide screen width into **$\approx 61.8\%$** (`lg:col-span-8`) for the Primary Catalog/Floor Plan Explorer vs **$\approx 38.2\%$** (`lg:col-span-4`) for the Right Action & Payment Cart.
2. **Vertical Mobile Golden Section**:
   - On compact mobile (360px – 430px), vertical space is distributed as: Top Identity Header (~12%), Center Focal Scrollable Content (~61.8%), and Bottom Thumb Action Dock (~26.2%–38.2%).
3. **8-Point & 4-Point Spatial Rhythm**:
   - All padding (`p-2: 8px`, `p-3: 12px`, `p-4: 16px`, `p-6: 24px`), gaps (`gap-2: 8px`, `gap-3: 12px`), and border radii (`rounded-xl: 12px`, `rounded-2xl: 16px`, `rounded-3xl: 24px`) must strictly be exact multiples of 4px/8px.
4. **3-Zone Mobile Header Budget**:
   - Sticky mobile headers (<640px) must stay within a $\le 340\text{px}$ width envelope: Left Zone ($\le 100\text{px}$), Center Switcher ($\le 125\text{px}$), Right Action Zone ($\le 80\text{px}$, at most 2 icons).
   - Fixed headers must use a flat bottom edge (`border-radius: 0`) with a subtle `border-b` divider.

### 1.3 Target Device & Cross-Browser Compatibility Matrix
1. **Apple iOS (Safari / WebKit & WebApp / PWA)**:
   - Dynamic Island & Notch support via `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`.
   - Prevent bottom bar bounce via `100dvh` and `<meta name="viewport" content="viewport-fit=cover">`.
2. **Google Android (Chrome / Chromium & WebView)**:
   - System navigation gesture bar insets & virtual keyboard reflow protection.
   - Elimination of Chrome pull-to-refresh reload via `overscroll-behavior-y: none`.
3. **Huawei / HarmonyOS (Petal Browser & EMUI WebView)**:
   - Rendering engine parity with fallback system fonts (`Plus Jakarta Sans`, `-apple-system`, `Roboto`, `HarmonyOS Sans`).
   - IndexedDB physical storage persistence independent of Google Play Services.
4. **Portable Touch Tablets (iPadOS & Android Tablets — Portrait + Landscape)**:
   - **Portrait Mode (768px – 834px)**: Single-column / 2/3 column layout with touch slide-over sheets.
   - **Landscape Mode (1024px – 1366px)**: Dual-pane Golden Ratio ($61.8\% : 38.2\%$) Pinned Cashier Terminal.
   - Touch Rejection & Finger Ergonomics: Touch targets $\ge 44\text{px}$ (Apple HIG) with `touch-action: manipulation`.
5. **Desktop Operating Systems & Browsers (Chrome, Firefox, Safari macOS, Opera, Brave, Edge)**:
   - Full PWA standalone installability (`display: standalone`).
   - Direct Web Bluetooth / WebUSB ESC/POS receipt printer support.
   - Cross-browser scrollbar support (WebKit `.custom-scrollbar::-webkit-scrollbar` & Firefox `scrollbar-width: thin`).

---

## 🎨 PILLAR II: ERGONOMIC DESIGN SYSTEM & ATOMIC DDD

### 2.1 4-Tier Component Taxonomy & Bounded Slices
1. **Atoms (`src/ui/`)**: Pure design tokens, badges, monospace price tags, raw buttons.
2. **Molecules**: Compact functional combinations (Search bars, Quantity keypad modals).
3. **Organisms (`src/components/<domain>/`)**: Self-contained functional sections grouped by Bounded Context (`auth/`, `pos/`, `tables/`, `customer/`, `customer-portal/`, `kds/`, `settings/`, `notifications/`).
4. **Smart Views (`src/views/`)**: Container shells that connect Context state (`useMerchantConfig`, `useViewport`, `useNotification`) and route events. Leaf presentation components must never trigger direct side-effects.
5. **Zero God-File Rule**: No first-party `.ts` or `.tsx` file may exceed **500 lines of code**.

### 2.2 Microcopy & Localization Invariants
1. **Verb-First Action Buttons**: CTAs must use direct, concise verbs (e.g. `+ Tambah Menu Lainnya`, `Kirim Pesanan ke Dapur ➔`, `Bayar Sekarang ➔`).
2. **Zero Parentheses `(...)`**: Secondary navigation hints or operational modes inside parentheses in buttons are strictly prohibited.
3. **100% i18n Localization**: Zero hardcoded strings in JSX. All labels must bind through `useTranslation()` (`t.*`).

### 2.3 Centralized Governance vs Scoped Merchant Customization
1. **Centralized Base**: Double-entry GL accounts, cashier shift gates, tax rules, and core dark tokens (`slate-950`, `font-mono`) are governed centrally.
2. **Scoped Merchant Overrides**: Merchants hold sovereign control over Landing Page and Customer QR Order spaces (hero headlines, banners, layout modes, WiFi policies, receipt footers) via `MerchantStorefrontCustomizerModal`.
3. **Fail-Safe Reset**: Every tenant customization provides a 1-tap reset back to default Hfe Ecosystem corporate settings.

### 2.4 The 4 Core Experience Pillars: POS, CARD, BOARD, ORDER
1. **`POS` (Cashier & Barista Workstation)**:
   - Targets: iPad / Tablet Landscape (1024px+) & Desktop PC.
   - Features: Cashier cart, floor plan tables, split bill, KDS kitchen dispatch, shift blind reconciliation.
   - Interaction: **Full Spotlight (`⌘K`) + Workstation Shortcuts (F1-F12, Esc, Enter)** for ultra-fast operation.
2. **`CARD` (Customer Member Passbook & Wallet)**:
   - Targets: Mobile Smartphones & Desktop.
   - Features: Digital Member Card (Apple Wallet pass), loyalty points balance, stamp card (8/10), event ticket wallet, past e-receipts.
   - Interaction: Member ID lookup via phone/name; keyboard shortcuts disabled on consumer mobile pass.
3. **`BOARD` (Public Storefront & Landing Page)**:
   - Targets: Desktop Browsers & Mobile.
   - Features: Hero brand story, announcement banner, event ticket showcase, merchant social links.
   - Interaction: **Public Spotlight Omni-Search (`⌘K` / `/`)** on desktop; touch search icon on mobile.
4. **`ORDER` (Dine-in Customer QR Space)**:
   - Targets: Customer Mobile Smartphone (360px – 430px).
   - Features: Table QR menu, instant category chips, open-tab review, WiFi password unlock, digital receipt.
   - Interaction: **In-Page Touch Filter Bar**, keyboard shortcuts 100% disabled for pure single-thumb touch ergonomics.

### 2.5 State Management Architecture: TanStack Query (Server State) vs React Context (UI State)
1. **Client / UI State (React Context)**:
   - Manages ephemeral device-local UI states: active cart items, open modals/drawers, viewport mode (`useViewport`), language (`useLanguage`), theme (`useTheme`), and store overrides (`useMerchantConfig`).
2. **Async Server State & Ledger Queries (TanStack Query)**:
   - Manages asynchronous remote entities: product catalog (`useProductCatalog`), table orders (`useTableOrders`), cashier shifts (`useActiveShift`), and company book settings (`useCompanySettings`).
   - Declares `networkMode: 'offlineFirst'` with IndexedDB cache persistence for instant `< 0ms` disk hydration during network outages.
   - Enforces **Optimistic Mutations** for `< 16ms` cashier checkout confirmation with automatic background reconciliation.
3. **Large Dataset DOM Virtualization (TanStack Virtual)**:
   - Enforces virtualized scrolling for catalogs exceeding 1,000+ SKUs or high-volume transaction audit logs to maintain 60 FPS across low-end mobile devices.

### 2.6 Universal Component Reuse & Anti-Duplication Protocol
1. **Design Tokens & Atoms (`src/ui/`)**: Pure presentational building blocks (`<PriceTag />`, `<Badge />`, `<Button />`, `<Drawer />`, `<Modal />`). Zero domain logic.
2. **Polymorphic Domain Organisms (`src/components/shared/`)**: Multi-variant organisms (`<ProductCard variant="pos_grid" | "qr_mobile" | "landing_hero" />`, `<TableCard variant="floor_plan" | "picker" | "guest_status" />`).
3. **Single-Door Import Barrier**: All new screens must import primitives from `@/ui` and `@/components/shared`. Ad-hoc modal/drawer creation inside views is strictly prohibited.

### 2.7 Canonical Directory Structure & Taxonomy
- `src/ui/`: Pure presentational atoms (<Button>, <PriceTag>, <Modal>, <Drawer>, <Badge>).
- `src/components/shared/`: Polymorphic multi-experience organisms (<ProductCard>, <TableCard>).
- `src/components/<domain>/`: Feature-sliced business organisms (`pos/`, `customer-portal/`, `landing/`, `customer/`, `tables/`, `kds/`, `settings/`, `notifications/`, `dev/`, `common/`).
- `src/views/`: The 4 Smart Container Views (`UnifiedPosView` [POS], `CustomerPortalView` [CARD], `LandingPageView` [BOARD], `CustomerMobileView` [ORDER], `KdsView`, `BackofficeView`).
- `src/context/`: Single-door UI state contexts (`MerchantConfigContext`, `ViewportContext`, `LanguageContext`, `NotificationContext`, `ThemeContext`).
- `src/hooks/`: Business & interaction hooks (`useSpotlightShortcuts`, `useTableState`, `useShiftState`, `useProductCatalog`).
- `src/services/financial/`: Ledger integration ports (`HfePosFinancialPort`, `HfeSdkAdapter`, `MockHfeAdapter`, `OfflineIntentQueue`).
- `src/tests/`: Master Vitest suites (`hfeUniversalUiStandard.test.ts`, `spotlightSearchAndShortcuts.test.ts`).

---

## 🛡️ PILLAR III: OFFLINE-FIRST ACID RESILIENCE & CONFLICT RESOLUTION

### 3.1 Mission-Critical Data Handling & Storage
1. **ACID Physical Disk Storage (`IndexedDB`)**: All sales mutations, split bills, and table transfers are written synchronously to IndexedDB (`OfflineIntentQueue`) before UI confirmation.
2. **OS & Browser Guards**:
   - `navigator.storage.persist()` prevents operating systems from purging data under low storage.
   - `window.beforeunload` guard warns users if pending offline intents remain unsynced.
3. **Emergency Escape Hatch**:
   - Physical USB/Bluetooth receipt printing with provisional watermark `[ #OFFLINE-PROVISIONAL ]`.
   - 1-tap manual data export button: `[ 📥 Ekspor Log Darurat JSON/CSV ]`.

### 3.2 Deterministic Conflict Resolution Standard
1. **Financial Truth Precedes Physical Inventory**: Paid customer transactions are always final and non-negotiable.
2. **Inventory Overselling Variance**: Negative stock is resolved automatically by posting an adjustment to GL Inventory Variance (`GL 5101`).
3. **Catalog/Price Drift**: The system binds the immutable `priceSnapshot` recorded at the time of sale.
4. **Table Collision**: Competing table moves automatically partition into sub-tabs (`IND-01-B`).
5. **Manager Review Drawer**: Ambiguous edge-cases route to the Dead-Letter Queue with side-by-side comparison.

---

## ⚖️ PILLAR IV: UNIVERSAL ACCOUNTING TRUTH & UPSTREAM PRECEDENCE

### 4.1 3-Tier Upstream Resolution Gate
1. **Tier 1 (Check Hfe Core First)**: Always inspect `glc-works/headless-company-books` for existing CRM, contact, or ledger models before adding new entities.
2. **Tier 2 (Check POS Domain Contexts)**: Inspect `types/pos.ts` and `useMerchantConfig()`.
3. **Tier 3 (Zero Ad-Hoc Data Structures)**: Clarify with the user/founder before inventing unmapped fields.

### 4.2 Universal Double-Entry General Ledger Mapping
All financial movements must satisfy $\sum \text{Debit} = \sum \text{Credit}$:
- **Debit Assets / Receivables**:
  - `GL 1101` — Kas Kasir / Peti Kas (Cash on Hand)
  - `GL 1104` — Bank QRIS & EDC Settlement (Electronic Clearing)
  - `GL 1105` — Piutang Folio Kamar Hotel / AR Corporate (Guest Ledger AR)
- **Credit Revenue & Liabilities**:
  - `GL 4101` — Pendapatan Penjualan F&B / Ritel (Sales Revenue)
  - `GL 2102` — Utang Pajak Restoran PB1 10% (Tax Payable)
- **Variance Reconciliation**:
  - `GL 5101` — Beban Selisih Kas & Inventori (Cash/Stock Variance)

### 4.3 Mandatory Idempotency Header
Every transaction creation request (`POST /v1/.../transactions`) **MUST** include an `X-Idempotency-Key` (UUID v4) header to guarantee zero double-posting.

---

## 🧪 5. COMPLIANCE & UNIFIED VERIFICATION MATRIX

| Pillar | Metric / Invariant | Automated Test / Gate |
|---|---|---|
| **I: Hardware** | `100dvh`, `overscroll-none`, tap-manipulation | `src/tests/hfeUniversalUiStandard.test.ts` |
| **I: Geometry** | Golden Ratio 61.8%:38.2%, 8pt grid, 3-zone header budget | Multi-Device Visual & Test Suite |
| **II: Design** | 4-Tier DDD, Verb-First CTAs, 100% `t.*`, `< 500 lines` | Modularity Guard & i18n Audit |
| **II: Storefront**| Scoped merchant customization & 1-tap fail-safe reset | `merchantStorefrontCustomization.test.ts` |
| **III: Offline** | IndexedDB disk persistence, `beforeunload`, GL Variance | `src/tests/hfeUniversalUiStandard.test.ts` |
| **IV: Ledger** | $\sum \text{Debit} = \sum \text{Credit}$, UUID Idempotency Key | `hfePosFinancialPortCutover.test.ts` |
| **All Pillars** | Full Local CI Gate Exit Code `0` | `./scripts/ci-local.sh` |
