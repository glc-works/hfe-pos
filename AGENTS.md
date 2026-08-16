# Hfe POS & Commerce Suite - Agent Guidance

`glc-works/hfe-pos` is the canonical repository for active work on the **Point of Sale (POS) & Retail Cashier Frontend Suite**.

Read `ARCHITECTURE.md` first as the highest technical contract, then `DEVELOPMENT.md` for delivery process authority. `CLAUDE.md` and this file are contributor entry points only.

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

## Slot Reservation Rules

- **`planning1`:** Reserved for the central Planner peer session.
- **`implementation1`:** EXCLUSIVELY reserved for the primary Implementer peer session. Subagents must NEVER claim `implementation1`.
- **`implementation2`, `implementation3`, ...:** Allocated for subagent execution when requested.

## Agent Budget & Verification

- `XS`: <10k tokens, `S`: 10-30k tokens, `M`: 30-75k tokens, `L`: 75-150k tokens.
- Verification evidence requires explicit test outputs, console checks, and visual proof before declaring victory.

## User Review & Development Loop Protocol (Mandatory Workflow)

Whenever the USER provides a review, feedback, or POV evaluation:
1. **Interactive Discussion First**:
   - Conduct roleplay / walkthrough analysis to identify **Happy Path (What's Good)**, **Pain Points (UX Frictions)**, and **Operational Gaps (Missing Capabilities)**.
   - Discuss why it is wrong/right, surface tradeoffs, and align on proposed fixes interactively.
2. **Update Formal Plan Document**:
   - Update or create the formal Level 1 / Level 2 plan document based on the interactive discussion agreement.
3. **Execute Implementation ONLY After Explicit User Approval**:
   - NEVER launch coding tools, scripts, or subagents until the user explicitly approves the updated plan!

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


