# Hfe POS & Commerce Suite - Agent Guidance

`glc-works/hfe-pos` is the canonical repository for active work on the **Point of Sale (POS) & Retail Cashier Frontend Suite**.

Read `ARCHITECTURE.md` first as the highest technical contract, `docs/active/standards/HFE-OMBOK-STD-001.md` for Operations Management & Agent Rigor, then `DEVELOPMENT.md` for delivery process authority. `CLAUDE.md` and this file are contributor entry points only.

## Current product lifecycle state

As of 2026-08-15, `hfe-pos` is **pre-production** and contains no real-user or customer data.

## Seven Guiding Principles

1. **Think before coding.** State assumptions explicitly, push back on unnecessary complexity, and ask rather than guess.
2. **Simplicity first.** Deliver the simplest compliant UI and offline-first cashier integration.
3. **Surgical changes.** Touch only what the request requires. Clean up your own unused code.
4. **Goal-driven execution.** Turn imperative tasks into verifiable UI and API test criteria.
5. **Single Source of Truth (SSOT) Everywhere.** Zero state drift. All configurations (Payment Policy, Theme, Viewport, Domain) must be managed through one authoritative single-door Context (`useMerchantConfig()`). DevTools and shortcuts must never maintain duplicate or shadow states.
6. **Primary Pilot Consumer & Engine Purity Invariant.** `hfe-pos` acts as the pilot benchmark for `headless-company-books` (Hfe Core). Identify gaps from POS operations, fix them directly in Hfe backend APIs, but ALWAYS abstract feedback into universal, industry-agnostic accounting primitives (zero domain leakage into core ledger tables).
7. **Pure Viewport App Shell (`100dvh`) & Single Scroll Owner Invariant.** Root layout must strictly use `h-[100dvh] overflow-hidden`. Exactly ONE scroll owner per active view (`<main className="flex-1 min-h-0 overflow-y-auto overscroll-contain">`). Zero scroll-trapping across standalone and dev simulator modes.
8. **3-Tier Data Authority & Zero-Drift Resolution Rule (Anti-Duplication Invariant).** When adding or integrating any new data points, fields, contacts, or entities into POS:
   - *Tier 1 (Check Upstream Hfe Core First):* Always search and inspect `glc-works/headless-company-books` (CRM contacts, schema semantics, ledger accounts, policy settings) to check if an authoritative upstream primitive already exists.
   - *Tier 2 (Check Existing POS Contexts):* If not present in Hfe Core (or in pre-production simulation), check existing POS domain contexts (`useMerchantConfig()`, `types/pos.ts`, `connector.manifest.json`).
   - *Tier 3 (Clarify Intent Before Inventing Fields):* NEVER silently invent ad-hoc mock fields or duplicate shadow structures. If the data origin is ambiguous or missing, explicitly clarify with the user/founder first, map the field to universal accounting/CRM primitives, and obtain confirmation before modifying types or state.
9. **Mandatory Multi-Device & Mobile Viewport Stress-Testing (Anti-Clipping & Anti-Collision Invariant).**
   - *Narrow Viewport Stress (360px – 390px):* Always audit UI on compact screens (iPhone SE, Galaxy S compact).
   - *Flat Header Bottom Invariant:* Fixed/sticky app headers must use flat bottoms (`border-radius: 0`) with clean `border-b` to prevent floating rounded corners from clipping scrolled content.
   - *Typography Collision & Wrapping Guard:* Long labels and price totals must use defensive wrapping (`items-baseline justify-between gap-3 truncate text-xs sm:text-sm font-mono text-base sm:text-lg`). Action button text must stay compact (1-2 lines maximum).
   - *View-Transition Scroll Reset:* Switching views or tabs (`qrStepView`) must auto-reset scroll position to `top: 0`.
10. **Apple HIG & Nielsen Norman Microcopy & Interaction Standard (Verb-First & Zero-Parentheses Invariant).**
   - *Action Button Wording:* CTAs must strictly use concise, direct verbs (e.g. `+ Tambah Menu Lainnya`, `Kirim Pesanan ke Dapur ➔`, `Bayar Sekarang ➔`). Zero parentheses `(...)` for secondary navigation or mode explanations inside action buttons. Secondary explanations belong in cards, badges, or helper text.
   - *Multi-Language (i18n) Purity:* Zero hardcoded UI strings in JSX. All button labels, headings, badges, and warnings must be bound through `useTranslation()` (`t.*`).
11. **Mandatory Live Browser Inspection & Multi-Device Switcher Verification Protocol (Self-Inspect & Switch Modes Invariant).**
   - *Active Device Switching:* Before delivering or certifying any UI fix, the agent MUST inspect the live rendering across all primary hardware profiles:
     - **Compact Mobile (360px – 390px):** Verify zero text truncation, zero button overflow, flat header bottoms, and sticky floating cart visibility.
     - **Tablet Portrait (768px):** Verify proper 2/3 column distribution and drawer expansion.
     - **Tablet Landscape / Desktop (1024px – 1440px):** Verify responsive grid, dual-pane POS layout (catalog left + cart right), and absence of mobile overlays.
   - *Dual-Port Validation (DevMode vs Standalone Production Preview):*
     - Always audit on **Port 5173 (DevMode)** AND **Port 4173 (Vite Production Preview)** to guarantee zero drift between simulated frames and real responsive environments.
   - *Automated Browser Self-Inspection:* Inspect computed bounding boxes, scroll container ownership, and layout reflows directly in browser runtime before declaring victory.
12. **Universal Cross-Scenario Abstraction & Generalization Invariant (Anti-Silo Rule).**
    - *Cross-Scenario Mapping:* Whenever an operational edge-case, friction, or capability is discovered in a specific vertical (e.g., Hotel F&B, Beach Club, Specialty Coffee, Cloud Kitchen, Retail Pharmacy, Salon, Coworking Space):
      - NEVER treat it as an isolated niche workaround or hardcoded one-off.
      - ALWAYS abstract the underlying operational and mathematical pattern into a universal, industry-agnostic primitive that scales across all commerce domains:
        - *Hotel Room Folio Charge* ➔ **Universal Counterparty / Third-Party Ledger Billing Primitive** (Room charge, Corporate department invoice, Student campus wallet, Patient clinic billing).
        - *Table Reassignment / Move* ➔ **Universal Spatial / Session Resource Reassignment Primitive** (Table transfer, Hotdesk reallocation, Clinic exam room switch, Spa treatment room change).
        - *Multi-Station Kitchen Routing* ➔ **Universal Work-Order Decomposition & Multi-Fulfillment Dispatch Primitive** (Hot kitchen vs Barista bar, Multi-warehouse fulfillment, Hardware vs Software repair dispatch).
        - *VIP Minimum Spend Progress* ➔ **Universal Resource Commitment & Minimum Order Value Gating Primitive** (VIP dining room min spend, B2B wholesale MOQ, Event hall minimum consumption).
        - *Payment-Gated WiFi Access* ➔ **Universal Service / Facility Entitlement Gating Primitive** (Cafe WiFi password after order, Coworking door code after booking, Event photo access after ticket).
13. **Universal Viewport Single Source of Truth (SSOT) & 3-Zone Header Budget Invariant (Anti-Drift & Anti-Clipping Rule).**
    - *Zero Hardcoded Viewport Checks:* NEVER hardcode `const isMobile = viewportMode === 'mobile'` directly in JSX or views. ALWAYS import and consume `useViewport()` (`const { isMobile: isContextMobile } = useViewport(); const isMobile = viewportMode === 'mobile' || isContextMobile`). This guarantees physical browser resizing (<768px), DevTools mobile toggle, and simulated preview modes are 100% synchronized with zero layout breakdown.
    - *3-Zone Mobile Header Budget Invariant:* On compact mobile screens (<640px), any sticky or app header must strictly stay under a 340px total pixel budget: Left Zone (<=100px), Center Switcher (<=125px), and Right Action Zone (<=80px with AT MOST 2 visible action icons). Secondary buttons MUST be hidden via `hidden sm:flex` or collapsed into drawers.
    - *Dev Widget Non-Collision Invariant:* Floating tools (`FloatKit`) must stay discreetly anchored in the corner (`top-16 left-3`) to guarantee zero hitbox collision with bottom payment docks and catalog cards.
14. **The 6-Tier Atomic Domain Hierarchy & React Aria Engine (Single Source of Truth Layer Isolation).**
    - *The 6 Authoritative Tiers:*
      1. **Tier 1: Design Tokens (`index.css` & Tailwind):** HSL semantic colors, 4px/8px rhythm, tabular numbers (`font-mono tabular-nums`), and micro-glyphs (**`👥`**, **`🍽️`**, **`⏱️`**, **`👑`**).
      2. **Tier 2: React Aria Atoms & Headless Primitives (`src/ui/`):** Built strictly on **React Aria Components (`react-aria-components` / `@react-aria/*`)** for bulletproof touch ergonomics (anti-ghost click, zero delay), focus trap, and workstation shortcuts. Pure props, zero domain logic.
      3. **Tier 3: Domain Widgets (`src/components/shared/`):** Self-contained, slot-budgeted components (`<TableCard slotSpan={1 | 2} />`, `<ProductCard />`). Each widget declares its own fixed-slot requirement ($\ge 105\text{px}$ per slot).
      4. **Tier 4: Widget Clusters & Assemblies (`src/components/tables/`, `src/components/pos/`):** Governs inter-widget relations (Tetris slot pairing $2+4=6$, Zone aggregate metrics, and Master-Detail click bindings).
      5. **Tier 5: Master Layout Templates (`src/layouts/`):** Master Fixed-Slot Grid (`grid-cols-6` in Compact, `grid-cols-4` in Expand, and Dual-Pane Golden Ratio $61.8\% : 38.2\%$). Zero arbitrary percentage slicing (`w-[33%]`).
      6. **Tier 6: Smart Screens & Views (`src/views/`):** Viewport and Context orchestrators (`UnifiedPosView`, `CustomerCatalogView`) owning root app shell (`100dvh`, single scroll owner).
    - *Single Source of Truth Layer Isolation (Change Once, Inherited Everywhere):* Changes MUST be maintained strictly in their respective single layer without redundant multi-file ripple edits.
15. **Centralized Global Ecosystem Governance with Scoped Tenant Storefront Overrides.**
    - *Global Ecosystem Base:* Core tokens, double-entry GL accounts, TigerBeetle posting rules, cashier session gates, and backoffice governance are strictly managed centrally from Hfe Core. Zero client-side tenant drift.
    - *Scoped Storefront Overrides:* Merchants have full sovereign authority to customize their customer-facing touchpoints (Landing Page & Customer QR Order Space):
      - Hero headlines, taglines, promo announcement bars, brand story, and social media links.
      - QR menu layout mode (`grid_2col`, `list_compact`, `story_cards`), greeting microcopy, and customer WiFi access policy.
      - Brand primary accent color, dark/light theme mode, and digital receipt ESG footers.
    - *Fail-Safe Reset Invariant:* Every merchant customization MUST provide a 1-tap fail-safe reset back to default Hfe Ecosystem corporate settings.
16. **Mathematical Proportion, Golden Ratio ($\phi \approx 1.618$) & 8-Point Spatial Grid Invariant.**
    - *Golden Ratio Dual-Pane Split ($61.8\% : 38.2\%$):* On landscape and desktop terminals, screen space MUST follow the Golden Section: $\approx 61.8\%$ (8 columns in 12-col grid `lg:col-span-8`) for the Primary Content & Catalog Explorer vs $\approx 38.2\%$ (4 columns `lg:col-span-4`) for the Right Action & Payment Cart.
    - *Vertical Mobile Golden Section:* On compact mobile (360px–430px), distribute vertical height as: Top Identity (~12%), Center Focal Content (~61.8%), and Bottom Thumb Action Dock (~26.2%–38.2%).
    - *8-Point & 4-Point Spatial Grid:* All padding (`p-2`, `p-3`, `p-4`, `p-6`), gaps (`gap-2`, `gap-3`, `gap-4`), and border radii (`rounded-xl: 12px`, `rounded-2xl: 16px`, `rounded-3xl: 24px`) MUST strictly be multiples of 4px/8px to eliminate sub-pixel antialiasing blur.
    - *Modular Typographic Scale:* Font hierarchy must follow a geometric progression ($r = 1.125 \dots 1.200$): Micro/Badge (`10px`), Small Detail (`11px`), Body Standard (`12px-13px`), Section/Price (`14px-16px`), Hero Title (`24px-32px`). Numbers and prices must strictly declare `font-mono`.
17. **Browser-to-Native App Parity Invariant (Zero-Web-Artifacts & Haptic Tactility Standard).**
    - *Zero Browser Artifacts:* Dilarang keras membiarkan artifak web mengganggu pengalaman pengguna:
      - `overscroll-behavior-y: none` pada root untuk mengeliminasi rubber-band pull-to-refresh reload browser.
      - `-webkit-tap-highlight-color: transparent` untuk menghapus kotak abu-abu/biru default browser saat tombol disentuh.
      - `touch-action: manipulation` untuk menghapus delay 300ms double-tap zoom browser.
      - `user-select: none` (`select-none`) pada seluruh tombol navigasi, speed keys, dan kartu status meja.
    - *Haptic Tactility & Immediate State:* Setiap sentuhan tombol harus memberikan tactile visual feedback instan `<16ms` (`active:scale-[0.97]` atau `active:scale-95`).
    - *Smooth Spring Transitions:* Modals dan drawers wajib menggunakan cubic-bezier spring physics (`cubic-bezier(0.16, 1, 0.3, 1)`) dengan `backdrop-blur-md` identik dengan iOS/iPadOS sheet modal.
18. **Hfe Core Endpoints & Universal Accounting Truth Invariant.**
    - *Single Source of Financial Truth:* Seluruh mutasi kas, penjualan ritel, pajak PB1, dan piutang kamar hotel WAJIB bermuara ke general ledger Hfe Core (`headless-company-books`) melalui `financial_kernel::posting::PostingService`.
    - *Universal Double-Entry Ledger Mapping (Zero Shadow Balance):*
      - `Debit GL 1101 (Kas Kasir)` / `GL 1104 (Bank QRIS)` / `GL 1105 (Piutang Kamar/AR)`
      - `Kredit GL 4101 (Pendapatan Penjualan F&B/Retail)`
      - `Kredit GL 2102 (Utang Pajak PB1/PPN 10%)`
      - `Debit/Kredit GL 5101 (Beban Selisih Rekonsiliasi Kas)`
    - *Mandatory Client Idempotency Key:* Setiap request mutasi finansial (`POST /v1/company-books/{book}/transactions`) wajib menyertakan UUID v4 unik (`X-Idempotency-Key`) untuk menjamin zero double-posting saat jaringan putus-nyambung.
    - *Fail-Closed SDK Port:* Implementasi `HfePosFinancialPort` wajib fail-closed. Saat terhubung memanggil API resmi Hfe Core, saat simulasi/offline mengalir melalui `MockHfeAdapter` / `OfflineIntentQueue` dengan validasi matematis balance debit = credit.
19. **Mission-Critical Data Handling, Offline Persistence & Conflict Resolution Invariant.**
    - *ACID Disk Storage via IndexedDB:* Dilarang hanya mengandalkan RAM/LocalStorage untuk data mutasi. Seluruh transaksi kasir, split bill, dan order KDS wajib ditulis ke `IndexedDB` disk fisik sebelum UI mengonfirmasi sukses.
    - *Browser & Crash Guard:* Wajib mendaftarkan `navigator.storage.persist()` (anti-eviction OS) dan `window.beforeunload` guard untuk mencegah penutupan tab jika masih ada antrean offline pending.
    - *Financial Truth Precedes Physical Inventory (Zero Reversals of Paid Orders):* Transaksi tunai/offline pelanggan yang sudah dibayar adalah SAH. Selisih stok akibat penjualan offline simultan diselesaikan via jurnal GL Selisih Stok (`GL 5101`), bukan membatalkan uang pelanggan.
    - *Deterministic Conflict Resolution:* Perubahan harga diselesaikan via `priceSnapshot` saat struk dicetak; bentrok meja otomatis dipecah menjadi sub-tab (`IND-01-B`); kasus ambigu masuk ke `Dead-Letter & Conflict Resolution Drawer` untuk verifikasi manajer.
    - *Emergency Escape Hatch:* Sistem wajib menyediakan fitur unduh berkas darurat (`[ 📥 Ekspor Log JSON/CSV ]`) dan cetak struk provisional thermal jika jaringan mati total.
20. **The 4 Core Experience Pillars & Contextual Spotlight / Shortcut Governance.**
    - *The 4 Official Experience Pillars:*
      - **`POS` (Cashier & Barista Workstation):** iPad / Tablet Landscape (1024px+) & Desktop PC. Full Spotlight (`⌘K`) + Workstation Shortcuts (`F1-F12`, `Esc`, `Enter`, Numpad).
      - **`CARD` (Customer Member Passbook):** Smartphones & Tablets. Apple Wallet pass, stamps, event tickets wallet, past e-receipts. Member ID lookup at POS. Shortcuts disabled on mobile pass.
      - **`BOARD` (Public Storefront & Landing Page):** Desktop Browsers & Smartphones. Hero brand story, announcement bar, event ticket showcase, and Public Spotlight Search (`⌘K` / `/`).
      - **`ORDER` (Dine-in Customer QR Space):** Customer Mobile Smartphone (360px – 430px). In-page touch filter bar, WiFi unlock banner. Shortcuts 100% disabled for single-thumb touch ergonomics.
    - *Automated Standard Gate:* `scripts/audit-hfe-ui-standards.py` in Step 3 of `./scripts/ci-local.sh` strictly enforces compliance with `HFE-UI-STD-001`.
21. **State Management Separation & Universal Component Reuse Protocol.**
    - *Client/UI State vs Server State Separation:*
      - Ephemeral UI states (Cart items, open drawers, language, theme, viewport) are managed via React Context (`useMerchantConfig`, `useViewport`, `useLanguage`).
      - Asynchronous remote entities (Product catalog, active shift, guest folios, ledger settings) are managed via TanStack Query (`networkMode: 'offlineFirst'`, IndexedDB persister, optimistic mutations `<16ms`).
      - High-volume catalogs (1,000+ SKUs) and journal logs enforce TanStack Virtual DOM virtualization for 60 FPS scrolling.
    - *Anti-Duplication Protocol:*
      - All screens MUST consume shared presentational atoms from `@/ui` (`<PriceTag>`, `<Badge>`, `<Button>`, `<Drawer>`, `<Modal>`) and polymorphic organisms from `@/components/shared` (`<ProductCard variant="...">`, `<TableCard variant="...">`). Zero ad-hoc modal/drawer HTML markup in smart views.
22. **The Proportional Tetris & Child-Slot Budget Invariant (Anti-Symmetrical Slicing).**
    - *Child Card Width Invariant ($\ge 105\text{px}$):* In any floor plan, catalog, or grid, child cards have an inviolable minimum readable width ($\approx 105\text{px} - 110\text{px}$). Squeezing child cards below $105\text{px}$ by forcing too many columns into narrow containers is strictly prohibited.
    - *Proportional Tetris Grid Slicing:* When packing multi-zone or multi-category containers into a single row, container widths MUST follow the exact mathematical ratio of child items: $\text{Width}_k = (\text{Items}_k / \text{RowCapacity}) \times 100\%$. Arbitrarily slicing parent containers 50:50 when item counts are asymmetrical ($2 : 4$) is PROHIBITED.
    - *Defensive Zone Header Single-Row Invariant:* Sub-zone headers in narrow containers ($\le 2$ slots) MUST enforce defensive truncation (`truncate`, `shrink-0`) and stay on a single line with zero awkward multi-line wrapping.
23. **Zero-Apology & Direct Iterative Post-Mortem Protocol (Permanent Invariant Encoding).**
    - Conversational apologies, repetitive pleasantries, and polite filler (*"Mohon maaf...", "Maaf atas kelalaian..."*) are STRICTLY PROHIBITED in response to user feedback, corrections, or bug reports.
    - The agent MUST immediately output a high-signal 3-part Retrospective:
      1. **Root Cause Breakdown (Kenapa Salah):** Unfiltered analysis of the spatial, mathematical, or architectural flaw.
      2. **The Permanent Invariant (Apa yang Diperbaiki):** Mathematical or structural formula that prevents recurrence.
      3. **Actionable Concrete Fix & Verification Proof:** Exact diff and test evidence.
24. **Storybook Purity, Single Viewport Ownership & Experience-Scoped Provider Decoupling (Anti-Double-Frame & Anti-Coupling Invariant).**
    - *Platform-Neutral Global Decorators:* Global Storybook decorators in `.storybook/preview.tsx` MUST provide neutral platform-level providers (`<ThemeProvider>`, `<LanguageProvider>`, `<ViewportProvider>`, `<NotificationProvider>`). Experience-specific domain states (`MerchantConfigProvider`, `CashierShiftProvider`) belong to experience-scoped decorators or mock args to prevent cross-experience contamination (e.g. CARD/BOOK or Tier 2 Atoms silently coupling to POS merchant state).
    - *Single Viewport Ownership:* Storybook's iframe is the sole authoritative device frame. Adding artificial device wrappers (`min-h-[844px]`, `max-w-md`, or fixed-height wrappers) inside individual `.stories.tsx` files is STRICTLY PROHIBITED.
      - For `layout: 'fullscreen'`: Use pure `w-full min-h-screen p-0`.
      - For `layout: 'centered'`: Center atomic components with balanced padding.
    - *Defensive Meta-Level Story Args:* Every story file MUST declare complete, valid mock data in `meta.args` to prevent `TypeError: Cannot read properties of undefined` during hot-reloads.
    - *Playwright Headless Mount Gate:* Never declare Storybook verified solely via `npm run build-storybook`. Verification requires executing `node scripts/audit-storybook-playwright.cjs` asserting 100% pass across all stories in `index.json`.
25. **Mandatory End-of-Session /learn Persistence Invariant.**
    - Whenever a user corrects an anti-pattern, architectural flaw, or spatial collision, the agent MUST trigger `/learn` before session close to persist the permanent invariant into `AGENTS.md` and prevent recurrence.
26. **SDK Discrepancy & Core SSOT Escalation Protocol (Zero Local Workarounds Invariant).**
    - *Zero Local Workarounds:* When a capability, schema field, or endpoint is missing, incompatible, or deficient in `@hfe/sdk`, writing ad-hoc local adapter workarounds, bypass fetch layers, or inventing shadow TypeScript interfaces in `hfe-pos` is **STRICTLY PROHIBITED**.
    - *Mandatory Core Issue Filing:* The agent MUST file a structured Issue / Level 2 proposal for the HFE Core (`headless-company-books`) session containing: (1) POS Operational Need, (2) Contract Gap Specification, (3) Proposed Universal Accounting/Domain Primitive, and (4) Expected OpenAPI Schema Delta.
    - *Upstream Resolution Loop:* The Core session implements the backend logic, updates `openapi.json`, and rebuilds `@hfe/sdk`. The POS frontend then simply adopts the new official SDK release cleanly without any local adapter baggage.
27. **The "Mobile NUMERO UNO" & Zero-Tolerance Visual Clipping Protocol.**
    - *Mobile-First Absolute Authority:* Mobile (360px – 390px) is the primary benchmark and highest authority (*NUMERO UNO*). Every UI component and layout MUST be designed, tested, and verified on compact mobile screens before desktop expansion.
    - *Strict 340px Header Budget:* On screens $\le 390\text{px}$, the top header row MUST NOT exceed 340px total width. AT MOST 2 action icons in the right zone (`Theme` + `Search`). Secondary icons (*Sambut, Bell, Scan*) MUST declare `hidden sm:flex` or collapse into drawers.
    - *Multi-Line Typographic Wrapping:* Single-row `truncate` on product names is STRICTLY FORBIDDEN. Product titles MUST use `line-clamp-2 text-xs font-bold leading-snug min-h-[32px]` so all words remain fully legible.
    - *High-Density Floor Plan Grid:* Mobile table layout MUST strictly use `grid-cols-2 gap-2` (never a wasteful single-column layout).
28. **Pure Single Scroll Owner & Zero-Trapping Guarantee.**
    - *Single Scroll Owner Invariant:* Exactly ONE element per active screen view is permitted to declare `overflow-y-auto`.
    - *Parent Constraint:* Root layout MUST strictly enforce `h-full min-h-0 overflow-hidden flex flex-col`.
    - *Fixed Control Strips:* Headers, command bars, search inputs, and category strips MUST declare `shrink-0 z-20` (fixed/sticky at top).
    - *Content Canvas Ownership:* The active content canvas (catalog grid or floor plan) is the SOLE scroll owner (`flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y pb-36`). Declaring nested `overflow-y-auto` on both parent `<main>` and child containers simultaneously is PROHIBITED.
29. **Mandatory Adversarial Visual Audit (Anti "Fake Green" Rule).**
    - *Visual Render Scrutiny:* Never declare a task complete solely because unit tests pass or buttons can be clicked. The agent MUST visually inspect rendered screenshots for edge bleeds, text clipping, and minimum touch target size ($\ge 44\text{px}$).
    - *Multi-Entry Point & Negative Path Stress-Testing:* Audits MUST test all real cashier paths:
      - Direct Walk-in / Takeaway without selecting a table.
      - Add-On order dispatch to an already occupied table.
      - Table switching / relocation with items in cart.
      - Empty cart checkout guards with constructive guidance.
30. **Single-Line Concise Microcopy Standard (Telegraphic $\le 18\text{ char}$ Invariant).**
    - *Zero-Wrapped Labels:* All form labels, action titles, and card headers MUST NOT exceed 18 characters on mobile. Text MUST fit cleanly on a single line on compact 360px–390px viewports without wrapping to 2 lines.
    - *Zero Parentheses inside Form Titles:* Explanatory text and secondary hints belong in placeholders (`placeholder="Opsional"`) or trailing badge indicators, NEVER co-located as parenthesized strings `(...)` inside label headers.
    - *Concise Telegraphic Vocabulary:* Use crisp industry terms (`No. Kartu`, `Kode Approval`, `Uang Diterima:`, `Kembalian:`) instead of verbose explanatory sentences.
31. **Single Container Header Ownership (Anti-Duplicate Header Invariant).**
    - *Single Header per Screen:* When a presenter component (such as `PosCartSection`) is nested inside a container drawer or modal (such as `PosMobileCartDrawer`), the child MUST receive `hideHeader={true}`. Rendering duplicate headers, repeated table badges, or multiple add-to-cart buttons on the same active screen is STRICTLY PROHIBITED.
    - *Unified Touch Pill:* Table / order mode switchers in drawer headers MUST be rendered as a single unified capsule button with a minimum touch area of $40\text{px} \times 40\text{px}$ (`min-h-[40px]`).
32. **100% i18n Dictionary Purity (Zero Hardcoded JSX Strings Invariant).**
    - *Zero Hardcoded UI Strings:* Every visible string (button labels, headers, placeholders, helper tags, badge descriptions) MUST be bound strictly through `useTranslation()` (`t.*`) in `src/i18n/`.
    - *Synchronized Lexicon:* Any newly added or revised translation keys MUST be updated synchronously across `src/i18n/types.ts`, `src/i18n/id.ts`, and `src/i18n/en.ts`.

## Slot Reservation Rules

- **`planning1`:** Reserved for the central Planner peer session.
- **`implementation1`:** EXCLUSIVELY reserved for the primary Implementer peer session. Subagents must NEVER claim `implementation1`.
- **`implementation2`, `implementation3`, ...:** Allocated for subagent execution when requested.

## Agent Budget & Verification

- **Branch Naming Standard:** Use `agy/<tier>-<issue>-<slug>` branches (e.g. `agy/s-51-unified-wave-upgrade`). New branches start from the declared remote base, never an unchecked local `main`.
- `XS`: <10k tokens, `S`: 10-30k tokens, `M`: 30-75k tokens, `L`: 75-150k tokens.
- Verification evidence requires explicit test outputs, console checks, and visual proof before declaring victory.

## User Review & Development Loop Protocol (Mandatory 5-Pillar Structural Enforcement)

Whenever the USER provides a review, feedback, bug report, or POV evaluation (e.g. *"kenapa..."*, *"coba cek..."*, *"jangan..."*, *"bagaimana jika..."*, or architectural questions):

1. **HARD ZERO-WRITE GATE & TOOL BLACKLIST (Absolute Physical Invariant):**
   - **ZERO modifying tool calls are permitted in the feedback/review response turn.**
   - Explicitly blacklisted tools in feedback turns: `write_to_file`, `replace_file_content`, `multi_replace_file_content`, and `run_command` (modifying or test-running scripts).
   - The agent MUST output **ONLY visible markdown analysis and discussion text**.

2. **MANDATORY 4-PART CONCISE EXPERT ANALYSIS & EXECUTIVE SUMMARY (Zero-Noise, Global-Benchmark-Anchored):**
   - The response MUST strictly follow this high-signal structure (1-2 punchy sentences per persona, zero fluff):
     1. **2–3 Curated Relevant Personas from `.agent-personas/`:** Pick only personas directly relevant to the issue. Zero filler or cheerleading personas.
     2. **Proactive Global Industry Benchmarking (Zero Superficial Commentary):** Personas MUST NOT act as passive local code reviewers. Every persona evaluation MUST proactively anchor against and compare the solution with the Top 2-3 Global Industry Leaders (e.g. F&B/POS: Toast POS, Square for Restaurants, Oracle Micros, Lightspeed; Web UX: Linear, Stripe, Apple HIG; Ledger/FinTech: SAP, QuickBooks, TigerBeetle, Xero). Never wait for the user to ask for industry patterns.
     3. **Adversarial Operational Stress-Testing (3 Extremes):** Every proposal MUST be proactively attacked against 3 operational extremes: (a) Extreme Asymmetry (50 items vs 2 items), (b) Minimum Scale (3 items single-zone), and (c) Rush-Hour Cashier Throughput (0.5s reaction, zero-scroll).
     4. **Compact Trade-Off Matrix:** Clean, high-signal comparative table evaluating viable options.
     5. **📌 Crisp Executive Summary (Unambiguous Consensus):** A definitive, bulleted summary stating: (a) Core Consensus Decision, (b) Scope Boundaries (What Changes vs What Stays), and (c) Single Actionable Recommendation.

3. **INTERACTIVE DISCUSSION & ALIGNMENT:**
   - Present the analysis and solicit user direction on the trade-offs before proceeding.

4. **EXPLICIT CONFIRMATION TOKEN CONTRACT (Zero Implicit Consent):**
   - Coding tools and modifying scripts are **STRICTLY LOCKED** until the user explicitly sends an affirmative execution token in their message (e.g. `[EKSEKUSI]`, `[TERAPKAN]`, *"Oke terapkan"*, *"aku setuju"*, *"approve"*, *"setuju"*, *"oke"*, *"gas"*, *"lanjut"*).
   - Ambiguous conversational filler (*"coba"*, *"gimana"*, *"yaudah"*, *"ngk usah"*) **DO NOT unlock execution**. Absent an approved confirmation token, the agent **MUST REMAIN in interactive discussion mode** with ZERO modifying tool calls.

5. **FAILURE PROTOCOL (Ambiguity Fails Closed):**
   - If the agent has even 1% doubt regarding user intent, the agent MUST stop and ask for clarification in plain text rather than making an assumption and invoking tools.

## Defensive UI & Spatial Isolation Standard (Zero Text-Collision & 4-Quadrant Matrix)

All UI components, cards, tables, and presentation layers MUST comply with the following structural layout and verification standards:
1. *Defensive Spatial Isolation (Zero Text Collision)*: Multi-variable dynamic data (e.g., entity ID, customer/waiter name, status badge, elapsed timer, and financial currency amounts) MUST NOT be co-located in a single unconstrained horizontal row without dedicated sub-containers. Variable text MUST use explicit stacked rows or independent grid columns with `min-width: 0`, `text-overflow: ellipsis`, and `overflow: hidden`.
2. *Tabular Monetary Presentation*: All currency amounts (e.g., `IDR Rp 120.000`, `USD $120.00`) MUST use tabular figures (`font-variant-numeric: tabular-nums`) and dedicated container width allocations to prevent layout jitter or digit clipping.
3. *Mandatory 4-Quadrant Dynamic Content Stress Matrix*: Every presentational card or grid component MUST be verified against 4 distinct data extremes:
   - (Q1) *Zero/Empty State*: Blank name, Rp 0, 0m elapsed, idle status.
   - (Q2) *Extreme Short State*: 1-2 char initials (`"Al"`, `"Ch"`), Rp 500, 1m elapsed.
   - (Q3) *Extreme Long/Overflow State*: Full title/name (`"Bpk. Alexander Raden Christopher III"`), multi-million/billion amounts (`"Rp 1.850.000.000"`), 3-digit timer (`"120m"`).
   - (Q4) *Multi-State Variations*: Selected/Active glow, Occupied warning badge, Billing alert, Split-Bill indicator.
4. *Automated DOM Bounding-Box Overlap Gate*: CI verification MUST assert non-overlapping bounding boxes for adjacent text and badge elements across standard resolutions (Mobile 360px, Tablet 768px, Desktop/POS 1024px+).
5. *Orthogonal Visual Channels (1 Channel = 1 Purpose)*: A UI component is STRICTLY FORBIDDEN from using more than ONE visual channel to signal the same semantic state. When border/background color signals occupancy (Amber = Unpaid, Slate = Free), duplicate status dots (`🟢`, `⏳`), left accent strips, and redundant text pills are PROHIBITED. Top-right corner is reserved exclusively for temporal state (`45m`).
6. *F&B Capacity Utilisation Standard (`seatedGuests/maxCapacity`)*: Seating/table cards MUST NOT display static capacity (`4 Pax`) when occupied. The system MUST render the actual capacity utilisation ratio (`👥 seatedGuests/maxCapacity Kursi`, e.g. `👥 3/4 Kursi` when seated, `👥 4 Kursi` when empty).
7. *Linear Optical Reading Flow (Anti-Zigzag Invariant)*: Reading path must follow a consistent vertical axis (Entity ID -> Capacity Utilisation -> Guest Name -> Price). Opposing cross-corner zig-zag scattering is strictly forbidden.
8. *The Fibonacci Spatial Geometry & Modular Scale System*: Multi-element rows MUST strictly follow geometric proportions based on the Fibonacci series:
   - (P1) *Center Monad ($1$)*: Single/empty states must be positioned in a balanced, centered focal point rather than pushed lopsidedly to one side.
   - (P2) *Binary Fibonacci ($5 : 8$ or $3 : 5$)*: Two co-located elements in a row MUST be partitioned with $\approx 62\%$ for the dominant text/name (`flex-[5] truncate`) and $\approx 38\%$ for the numerical/monetary outcome (`flex-[3] text-right font-mono tabular-nums`).
   - (P3) *Ternary Anchored ($1 : 1 : 1$)*: Three elements use Left Identifier $\longleftrightarrow$ **Center Area of Focus ($\star$)** $\longleftrightarrow$ Right Temporal Timer.
9. *The Glyph-First Micro-Budget Invariant*: On compact or high-density grids, verbose text words (`Seats`, `Items`, `Minutes`) MUST be replaced with semantic micro-glyphs (**`👥 3/4`**, **`🍽️ 3`**, **`⏱️ 25m`**, **`👑 74%`**) to conserve up to 60% horizontal character width and eliminate text truncation.
10. *Centering Information & Area of Focus (Foveal Optical Center)*: The most decisive operational metric (e.g. live occupancy ratio `👥 3/4`) MUST occupy the **Focal Optical Center** of the card. Perimeter anchors (Entity ID and Timer) act as symmetrical brackets.

## Mandatory Closed Implementation & Verification Loop (5-Step Protocol)

For every execution or coding task, agents MUST execute the closed verification loop before handover:
1. **Step 1: Implement:** Apply changes according to standards, architecture, and heuristics.
2. **Step 2: Multi-Point Self-Audit & Live Browser Device Inspection (Must Test 360px, 390px, 768px & 1280px Viewports on Both Ports 5173 & 4173):**
   - *Boundary & Clipping Audit:* Check bottom buffer, floating docks, drawer safe-areas, and flat header borders (`border-radius: 0`).
   - *Scroll & ScrollSpy Audit:* Verify single scroll owner, scroll runway, 1-tap tab transitions, and view-transition scroll reset (`top: 0`).
   - *Typography Collision Audit:* Check long labels and wide monetary amounts on 360px screens to prevent overlap or awkward button wrapping.
   - *Standalone vs DevMode Check:* Verify identical behavior in pure standalone (`!isDevMode` / Port 4173) and simulated frames (Port 5173).
   - *Theme & Typography Contrast:* Verify legibility in both Light and Dark modes.
3. **Step 3: Autonomous Auto-Repair:** Fix all discovered gaps immediately in-flight without waiting for user reports.
4. **Step 4: Local CI Gate Verification:** Run `./scripts/ci-local.sh` and ensure exit code `0` (Modularity, TypeScript, 100% Tests, Build).
5. **Step 5: Structured Delivery Report:** Present:
   - **Gaps Found (Temuan Cacat):** Self-identified issues during audit.
   - **Solutions Applied (Solusi Diterapkan):** Concrete code/layout fixes made.
   - **Decisions / Clarifications Ahead (Opsi / Keputusan User):** Strategic trade-offs requiring user direction (if any).


