# hfe-pos Legacy Plan Disposition Inventory (129 files)

Audit basis (Canon Convergence Execution Contract, `glc-works/hfeit-product@governance/canon-convergence-execution.md`):

- hfe-pos audited at local working tree `c357fd5f026deff6264485ba603f96dbeeb48efb` (branch `feat/c4-sdk-types-transport`; plan tree identical to default-branch `origin/HEAD` = `a612127117b2474b7b3a13e56b60e547a2d062c4`, 2026-08-31; local branch is 0 behind / 2 ahead, the 2 extra commits do not touch plans). Prior matrix receipt for the plan tree was POS `eacd1ec281c95db5a3d6a8ea8e784ad6d2db1d4f`.
- Product Canon at `glc-works/hfeit-product` local clone `ae7bbcf1a165f4cfcfc28783e65de2925ea145ce`.
- Live GitHub evidence queried 2026-09-02 (`gh issue`/PR list, glc-works/hfe-pos). Note: hfe-pos issue and PR numbers share one sequence; PRs #1-#32 implemented plans 52-86.
- Method: per-file front matter (title/status) + live issue/PR state + targeted code evidence under `src/`, `packages/`, `scripts/`. Read-only audit; no repo files modified.
- Cross-reference: family-level rows for the level-0 pair and the offline family already exist in `hfeit-product/governance/legacy-plan-disposition-matrix.md` (rows at POS `eacd1ec2`). This inventory dispositions every file individually and is consistent with those rows.
- Dimension vocabulary maps to the contract: authority `CANONICAL/STALE/NOT_APPLICABLE`; implementation `IMPLEMENTED/PARTIAL/BLOCKED/STALE/NOT_IMPLEMENTED`; recommendation `EXTRACT-TO-CANON / SUPERSEDED / RETIRE / KEEP-AS-COORDINATION` (contract lifecycle `HARVESTED/RETIRED/ACTIVE/SUPERSEDED/STALE`). `UNCLEAR` used where evidence was insufficient (fails closed, no guessing).

Conventions applied:

- RETIRE = planning artifact whose truth now lives in code/tests or whose approach was abandoned (PR closed unmerged). Preserve bodies as provenance; add external supersession markers; do not rewrite.
- SUPERSEDED = durable product meaning already has a named Canon successor.
- EXTRACT-TO-CANON = durable ecosystem meaning NOT yet found in a named Canon doc and still relevant; harvest first, then retire.
- KEEP-AS-COORDINATION = still actively coordinates open work (live issue binding); legitimately stays repo-local under the new convention.

---

## Group 1 — KEEP-AS-COORDINATION (7 files)

| file | title | authority | implementation | recommendation | note |
|---|---|---|---|---|---|
| level-2/101-core-authority-adoption.md | CORE Authority Adoption (authoritative catalog, reviewed quote, tender, QRIS outcome) | STALE | PARTIAL / BLOCKED (live `hfe-pos#101` open; gated on HCB `#1019`/`#1025`) | KEEP-AS-COORDINATION | P0 truth backbone for any CORE-authoritative demo; explicitly defers to Canon (`01-hfe-core`, offline/idempotency specs); browser must not own financial truth. |
| level-2/100-hlab-synthetic-flagship-verification-contract.md | HLab Synthetic Flagship Verification Contract | STALE | IMPLEMENTED (`scripts/hlab-verify-flagship.mjs`; issue `#100` closed) | KEEP-AS-COORDINATION | Demo verification entry point emitting machine-readable receipts; aligns with `governance/canonical-demo-ecosystem.yaml` (live `#121` demo-contract adoption open). |
| level-2/l2-pos-86-togrow-account-identity-alignment.md | ToGrow Account Identity Alignment | NOT_APPLICABLE (defers to Canon; names `identity-federation-entitlements.md` as parent authority) | PARTIAL (`#38`/`#40` closed replaced local auth; residual `#115` refresh-credential-in-JS-storage open) | KEEP-AS-COORDINATION | Model citizen: explicitly subordinate to Product Canon. Residual first-party-session work continues under `#115`. |
| level-2/l2-pos-87-decoupled-universal-seo-storefront-via-astro.md | Decoupled Universal SEO Storefront via Astro (BOARD.Hfeit) | STALE | PARTIAL (`packages/storefront-astro` shipped: `[merchant]`, `exp`, `pos` pages; deploy pipeline `#130`/`#133` open) | KEEP-AS-COORDINATION | Active BOARD/ORDER surface; BOARD meaning owned by `experience-card-board-order.md` §3/§8 — plan coordinates delivery only. |
| level-2/l2-pos-89-pos-hfeit-dedicated-landing-page.md | Dedicated Marketing Landing Page for POS.Hfeit (pos.hfeit.com) | STALE | PARTIAL (status Proposed; live `#111` landing language/claims-binding open) | KEEP-AS-COORDINATION | Marketing-surface coordination; contract's production-claim hygiene (`#111`) applies to its copy. |
| level-2/l2-pos-92-production-truth-hardening.md | Production Truth Hardening (settlement e2e, offline requalification, required checks) | STALE | PARTIAL (required checks `#52` closed; settlement/hardware residuals in live `#85`-`#88`, `#114`) | KEEP-AS-COORDINATION | Active production-readiness coordination; directly implements the contract's evidence ladder. |
| level-2/l2-pos-94-merchant-hub-truth-boundary-hardening.md | Merchant Hub & Financial Reports Truth Boundary Hardening | STALE | PARTIAL (live `#85`-`#88` open: fake-green states, hard-coded amounts presented as live) | KEEP-AS-COORDINATION | Enforces the contract's DEMO/SAMPLE vs LIVE/POSTED invariant; `useDataTruth`/`TruthChannelBadge` machinery exists in `src/ui/`. |

## Group 2 — EXTRACT-TO-CANON (7 files)

| file | title | authority | implementation | recommendation | note |
|---|---|---|---|---|---|
| level-1/l1-27-universal-service-commerce-and-booking.md | Universal Service Economy, Appointment Booking & Event Ticketing Suite (L1-27) | CANONICAL-candidate (occupies an L1 spec slot; booking/ticket partially covered by `01.06.05-hfe-booking-journey` + `01.01.03-ticket`, service verticals are not) | IMPLEMENTED (booking/ticketing views + tests; status Implemented) | EXTRACT-TO-CANON | Bounded harvest of uncovered service-vertical semantics (clinic/appointment catalog, event gate-in QR, coupon gateway) into `01.06.05`/`01.01.03`; then retire. Closest plan family to the AdMedika hospital direction. |
| level-2/l2-pos-46-universal-services-and-appointment-commerce.md | Universal Service Commerce Engine (L2-POS-46) | STALE — DANGEROUS: "Outcome & Specification Authority" section claims to codify expansion of hfe-pos AND headless-company-books | IMPLEMENTED | EXTRACT-TO-CANON | Strip the cross-repo spec-authority claim; CORE owns truth. Harvest same deltas as l1-27, then retire. |
| level-1/l1-10-toko-kelontong-retail-suite.md | Toko Kelontong & General Retail Suite (Barcode, Scan & Go, UOM, Kasbon) | CANONICAL-candidate (kasbon customer-credit ledger not found in Canon; UOM already covered by `01.01.08.02-unit-of-measure`) | IMPLEMENTED (retail/kasbon code present) | EXTRACT-TO-CANON | Bounded harvest: kasbon/credit semantics — verify against `01.05` obligations/settlement specs first; rest is POS implementation detail. |
| level-2/l2-pos-12-barcode-cashier-scan-and-go-kasbon-engine.md | Barcode POS Cashier, Scan & Go, UOM & Kasbon Engine | STALE | IMPLEMENTED | EXTRACT-TO-CANON | L2 twin of l1-10; contributes the same bounded kasbon harvest, then retires as implementation provenance. |
| level-1/l1-15-self-delivery-local-courier-engine.md | Self-Delivery & Local Store Courier Engine | CANONICAL-candidate (store-runner milestone courier not clearly covered by `experience-card-board-order.md` §4 ORDER modes) | IMPLEMENTED (`useSelfDelivery`, `DeliveryDispatchModal`) | EXTRACT-TO-CANON | Bounded harvest: zero-commission local courier milestone semantics into ORDER canon; dispatch UI is implementation detail. |
| level-2/l2-pos-18-local-courier-dispatch-self-delivery-engine.md | Local Courier Dispatcher & Self-Delivery Order Lifecycle UI | STALE | IMPLEMENTED | EXTRACT-TO-CANON | L2 twin of l1-15; same bounded harvest, then retire. |
| level-1/l1-16-unified-resi-awb-and-receipt-engine.md | Unified Resi Engine — AWB Tracking & Thermal/Digital Receipt | CANONICAL-candidate (unified cross-channel tracking-number semantics not found in Canon) | IMPLEMENTED (`src/components/resi/`, receipt services) | EXTRACT-TO-CANON | Bounded harvest of unified resi semantics; ESC/POS receipt printing is implementation-only (retire that part). |

## Group 3 — SUPERSEDED (15 files)

| file | title | authority | implementation | recommendation | note |
|---|---|---|---|---|---|
| level-0/000-hfex-master-experience-platform.md | HFE-X: Master Experience Platform & 7-Pillar Frontend Architecture (status: IMPLEMENTED) | STALE — DANGEROUS: claims master authority over the whole Experience platform | IMPLEMENTED (architecture shipped in app) | SUPERSEDED | `product/level-0/current-product-system.md` + `product-relationship-classification.md` + `experience-surface-map.md` own surface meaning; already dispositioned STALE/HARVESTED at POS `eacd1ec2`; Product `#68` OPEN_DECISION on shipping selection. |
| level-0/hfe-pos-suite-master-plan.md | Hfe POS & Cafe Mobile Order Suite — Master Strategic Plan (status: Proposed) | STALE — DANGEROUS: L0 plan defining ecosystem-wide API semantics (`/v1/loyalty`, `/v1/vouchers`, contacts) | IMPLEMENTED (suite shipped) | SUPERSEDED | Surface meaning → `experience-surface-map.md`/`experience-card-board-order.md`; loyalty/voucher semantics → `01.01.28-promotions-offers.md`; Product `#68` keeps shipping selection open. |
| level-1/l1-01-guest-login-mobile-qr-self-order.md | Phone Login & Guest Name Mobile QR Self-Ordering | STALE | IMPLEMENTED (`src/customer/`) | SUPERSEDED | Entry/guest semantics → `first-party-identity-sso-session.md` + `experience-card-board-order.md` §7; POS-local login must not re-own identity (see l2-pos-86). |
| level-1/l1-02-barista-touch-pos-table-engine.md | Barista Touch POS & Table Engine | STALE | IMPLEMENTED (`src/components/pos/`, `tables/`) | SUPERSEDED | POS surface meaning → `experience-surface-map.md`, `experience-card-board-order.md` §7. |
| level-1/l1-03-policy-based-payment-checkout.md | Policy-Based Payment Checkout (Pay-First vs Open Tab) | STALE | IMPLEMENTED (`src/components/payments/`) | SUPERSEDED | Payment/settlement truth is CORE's (`01.05.05-settlement` family); ORDER mode mapping → `experience-card-board-order.md` §5. |
| level-1/l1-04-kitchen-ticket-barista-display.md | Kitchen Ticket & Barista Display System (KDS) | STALE | IMPLEMENTED (`src/components/kds/`) | SUPERSEDED | Operations UX is POS implementation detail; surface role in Canon. |
| level-1/l1-05-universal-loyalty-and-voucher-engine.md | Universal HFE Loyalty Tiers, Point Accruals & Voucher Perk Engine | STALE | IMPLEMENTED (`src/components/loyalty/`) | SUPERSEDED | Canon successor exists: `product/specs/01.01.28-promotions-offers.md`; plan's `/v1/loyalty` API design must not compete. |
| level-1/l1-06-offline-indexeddb-resilience-buffer.md | Offline-First IndexedDB Resilience Buffer & SHA-256 Flush Manager | STALE | IMPLEMENTED (requalified: POS `#61`/PR `#107`, PR `#112`; 119/119 focused PASS per matrix) | SUPERSEDED | `product/specs/01.01.11-offline.md` owns semantics; already dispositioned in the legacy matrix; server-side breadth remains HCB `#931`, field proof POS `#114`. |
| level-1/l1-09-customer-preferences-togrow-account-and-merchant-tiering.md | Customer Preference Profiles, Universal toGrow Account & Merchant Tiering | STALE | IMPLEMENTED | SUPERSEDED | Identity → `identity-federation-entitlements.md`, `first-party-identity-sso-session.md`; subscription tiering → `01.06.06-subscription-billing-journey`. |
| level-1/l1-12-store-onboarding-getting-started-wizard.md | Store Onboarding & Getting Started Wizard | STALE | IMPLEMENTED (`src/components/onboarding/`, `useOnboarding`) | SUPERSEDED | Merchant administration/onboarding meaning → `merchant-administration-surfaces.md` (verify onboarding coverage during harvest; else demote to RETIRE). |
| level-1/l1-13-team-membership-and-staff-invitation.md | Team Membership, Staff Role Authorization & Invite Flow | STALE | IMPLEMENTED (`src/components/team/`) | SUPERSEDED | Identity/session + authorization meaning → `first-party-identity-sso-session.md`, `governed-object-authorization.md`; shared-terminal PIN decision pending in Product PR `#50`. |
| level-1/l1-19-multi-branch-outlet-management-suite.md | Multi-Branch Outlet Management Suite | STALE | IMPLEMENTED (`src/components/branches/`, `BranchManagementView`) | SUPERSEDED | Multi-outlet administration → `merchant-administration-surfaces.md` (verify multi-outlet coverage during harvest). |
| level-1/l1-20-esg-sustainability-commerce-engine.md | ESG & Sustainability Commerce Engine | STALE | PARTIAL (`EsgReportModal`/`esgReportEngine` exist; BYOC/surplus/tip distribution not found by name) | SUPERSEDED | Sustainability meaning → `product/specs/01.01.25-sustainability.md` (matrix row: HCB `#924`/`#932` own reconciliation); uncovered eco-perk deltas, if wanted, go through that spec. |
| level-1/l1-24-customer-contact-master-and-crm-suite.md | Customer Contact Master & CRM Suite | STALE | IMPLEMENTED (`CustomerContactsView`, CRM sections) | SUPERSEDED | Contact/party semantics → `01.01.02-contact.md` family; CRM view is implementation detail. |
| level-2/l2-pos-08-offline-indexeddb-resilience-buffer.md | IndexedDB Storage Adapter, SHA-256 Checksum & Offline Flush Manager | STALE | IMPLEMENTED (requalified per POS `#61` receipts) | SUPERSEDED | Same offline family row as l1-06 in the legacy matrix; `01.01.11-offline.md` owns semantics. |

## Group 4 — RETIRE (99 files)

Planning artifacts whose truth is now in code/tests (shipped), or whose approach was abandoned (PR closed unmerged), or which contradict current authority. Preserve as provenance; mark superseded externally; never use as authority or work dispatch.

### 4a. L1 suites — shipped implementation detail (8)

| file | title | authority | implementation | recommendation | note |
|---|---|---|---|---|---|
| level-1/l1-11-fine-dining-course-pacing-suite.md | Fine Dining Suite (Course Pacing, Sommelier, Maître d') | STALE | IMPLEMENTED (`finedining/`, `FineDiningKdsView`, `MaitreDView`) | RETIRE | F&B-vertical implementation, not ecosystem meaning. |
| level-1/l1-14-operational-workflows-shift-void-stocktake.md | Shift Reconciliation, Void & Refund, Stocktake Audit | STALE | IMPLEMENTED (`shifts/`, `refunds/`) | RETIRE | Operational workflow detail; cash truth is CORE's. |
| level-1/l1-17-hfe-pos-auth-starterkit-sdk.md | Hfe POS Auth SDK Starterkit Package (@hfe/pos-auth-starterkit) | STALE — DANGEROUS: would export POS-local auth as ecosystem SDK, competing with Identity authority | NOT_IMPLEMENTED (no such package in `packages/`) | RETIRE | Contradicts Identity canon and l2-pos-86 alignment; POS-local auth was replaced by ToGrow alignment (`#38`/`#40` closed). Do not revive. |
| level-1/l1-18-multi-warehouse-operations-suite.md | Multi-Warehouse Operations Suite | STALE | IMPLEMENTED (`warehouse/`, `WasteAdjustmentModal`) | RETIRE | Inventory/warehouse semantics → `01.01.17-product-inventory.md`; plan is implementation detail. |
| level-1/l1-21-real-world-rl-operations-suite.md | Real-World RL Operations Suite (printer routing, GS1, N-way split, consignment) | STALE | PARTIAL (`DynamicSplitBillModal` exists; GS1/consignment not found by name) | RETIRE | Mostly hardware/parsing implementation; consignment semantics, if wanted, belong under `01.01.17`. |
| level-1/l1-22-hfe-pos-insights-and-ux-purification-suite.md | Hfe POS Real-Time Insights & UX Purification Suite | STALE | IMPLEMENTED (`insights/`, `HfeInsightsView`) | RETIRE | Analytics presentation detail; live-truth boundary for insights now tracked by `#85`-`#88`/`#126` and plan 94. |
| level-1/l1-23-pos-2026-next-gen-capabilities-suite.md | POS 2026 Next-Gen Capabilities Suite (upsell, kiosk, pay-at-table, timeclock) | STALE | IMPLEMENTED (`DeterministicUpsellModal`, `KioskSelfServiceView`, `StaffTimeclockModal`) | RETIRE | Feature implementation detail; "POS 2026 standards" claims are marketing language, not evidence. |
| level-1/l1-25-engineering-platform-suite.md | HFEX Engineering Platform Suite (tooling, sentinels, CI gates) | STALE | IMPLEMENTED (`scripts/` suite: modularity guard, ci-local, audits) | RETIRE | Repo tooling coordination; stays as provenance only. |

### 4b. L2 launch wave 01-08 — shipped foundation (8)

| file | title | authority | implementation | recommendation | note |
|---|---|---|---|---|---|
| level-2/l2-pos-01-mobile-qr-guest-login-cart.md | Mobile QR Guest Login & Cafe Cart Web App | STALE | IMPLEMENTED (`src/customer/`) | RETIRE | Shipped; identity semantics superseded (see l1-01). |
| level-2/l2-pos-02-barista-touch-table-grid.md | Barista Touch POS Station & Table Floor Plan Grid | STALE | IMPLEMENTED | RETIRE | Shipped. |
| level-2/l2-pos-03-open-tab-qris-payment-modal.md | Policy-Based Payment Checkout & QRIS Modal | STALE | IMPLEMENTED | RETIRE | Payment truth now flows through GovernedPosCheckout/CORE (plan 50/101). |
| level-2/l2-pos-04-kds-thermal-ticket-printer.md | Kitchen Display System & Thermal Ticket Printer | STALE | IMPLEMENTED | RETIRE | Shipped. |
| level-2/l2-pos-05-app-monolith-decomposing-and-testing.md | App Monolith Decomposing, Hfe REST Transport & Vitest Suite | STALE | IMPLEMENTED | RETIRE | Done; modularity now enforced by `scripts/check-modularity.py`. |
| level-2/l2-pos-06-modularity-guard-and-frontend-tooling.md | Modularity Guard, Connector Validator & Local CI Tooling | STALE | IMPLEMENTED (`scripts/check-modularity.py`, `ci-local.sh`) | RETIRE | Done. |
| level-2/l2-pos-07-loyalty-tiers-voucher-wallet-engine.md | Loyalty Tiers Badge, Voucher Wallet Drawer & Promo Code Engine | STALE | IMPLEMENTED | RETIRE | Loyalty semantics superseded by `01.01.28-promotions-offers.md`. |
| level-2/l2-pos-11-allergen-filter-togrow-account-merchant-tiering.md | Allergen Filter, Cross-Merchant toGrow History & Pay-Tier Entitlements | STALE | IMPLEMENTED | RETIRE | Entitlement semantics superseded by Identity/entitlements canon. |

### 4c. L2 verticals 12-49 — shipped suites (19)

| file | title | authority | implementation | recommendation | note |
|---|---|---|---|---|---|
| level-2/l2-pos-13-course-firing-sommelier-maitre-d-engine.md | Course Firing KDS, Sommelier Pairing & Maître d' Engine | STALE | IMPLEMENTED | RETIRE | Shipped fine-dining detail. |
| level-2/l2-pos-14-store-onboarding-wizard-getting-started.md | 3-Step Store Onboarding Wizard | STALE | IMPLEMENTED | RETIRE | Shipped. |
| level-2/l2-pos-15-team-invitation-staff-rbac-pin-engine.md | Team Invitation, Staff RBAC & Employee PIN Binding | STALE | PARTIAL (shipped; live `#126` legacy Merchant Hub PIN visual-test issue open) | RETIRE | Residuals have live owners (`#126`, Product PR `#50` shared-terminal decision). |
| level-2/l2-pos-16-unified-simple-pos-login-screen.md | Unified Simple POS Login Screen & Auth Transport | STALE | IMPLEMENTED | RETIRE | Auth semantics now governed by l2-pos-86/Identity canon; residual `#115`. |
| level-2/l2-pos-17-shift-reconcile-void-refund-stocktake-engine.md | Shift Reconciliation, Manager Void & Refund, Stocktake UI | STALE | IMPLEMENTED | RETIRE | Shipped. |
| level-2/l2-pos-19-awb-resi-and-thermal-receipt-engine.md | AWB Resi Generator, QR Label, ESC/POS Chit & Digital Receipt | STALE | IMPLEMENTED (`src/utils/escPosDriver.ts`, receipt services) | RETIRE | Printing is implementation detail; resi semantics harvested via l1-16. |
| level-2/l2-pos-20-hfe-pos-auth-starterkit-sdk-package.md | Exportable @hfe/pos-auth-starterkit Package | STALE — DANGEROUS: ecosystem auth SDK competing with Identity authority | NOT_IMPLEMENTED (package absent) | RETIRE | Same contradiction as l1-17; superseded by ToGrow identity alignment. Do not revive. |
| level-2/l2-pos-21-warehouse-management-view-transfer-spoilage-engine.md | Warehouse Management View, Stock Transfer & Spoilage UI | STALE | IMPLEMENTED | RETIRE | Shipped; inventory truth under `01.01.17`. |
| level-2/l2-pos-22-branch-management-view-outlet-switcher-engine.md | Branch Management View & Inter-Branch Performance | STALE | IMPLEMENTED | RETIRE | Shipped. |
| level-2/l2-pos-23-eco-impact-dashboard-surplus-discount-tip-engine.md | Eco-Impact Dashboard, Paperless Default, Surplus Discount & Tip Engine | STALE | PARTIAL (EsgReportModal exists; eco-impact dashboard/BYOC/tip not found by name) | RETIRE | Unimplemented deltas, if wanted, route through `01.01.25-sustainability.md` (HCB `#932`), not this plan. |
| level-2/l2-pos-24-comprehensive-ux-purification-board-review.md | Comprehensive UX Purification (15 Board Review Improvements) | STALE | IMPLEMENTED | RETIRE | Point-in-time UX repair; superseded by later UX waves. |
| level-2/l2-pos-25-station-printer-routing-gs1-barcode-scale-consignment-engine.md | Station Printer Routing, GS1 Parser, N-Way Split & Consignment | STALE | PARTIAL (kdsStationRoutingDecomposition test exists; GS1/consignment not found) | RETIRE | Same as l1-21; unimplemented parts route through Canon specs if wanted. |
| level-2/l2-pos-26-comprehensive-17-point-ux-catalog-repair.md | 17-Point UX & Catalog Repair | STALE | IMPLEMENTED | RETIRE | Point-in-time repair; provenance. |
| level-2/l2-pos-27-ux-repair-and-hfe-insights-engine.md | UX Repair & Hfe Real-Time Insights Engine | STALE | IMPLEMENTED | RETIRE | Insights truth-boundary residuals now owned by `#85`-`#88`/plan 94. |
| level-2/l2-pos-28-ai-upsell-kiosk-pay-at-table-timeclock-engine.md | Deterministic Smart Upsell, Kiosk, Pay-at-Table, Timeclock | STALE | IMPLEMENTED | RETIRE | Shipped (l1-23 L2 twin). |
| level-2/l2-pos-28-theme-selector-miniature-preview-and-merchant-settings-repair.md | Theme Selector Miniature Preview & Settings Cleanup | STALE | IMPLEMENTED | RETIRE | Shipped; note duplicated plan ID 28 (see identity-collision finding). |
| level-2/l2-pos-29-customer-contacts-view-and-crm-engine.md | Customer Contacts View, Kasbon Limit & WA Alerting | STALE | IMPLEMENTED | RETIRE | Contact semantics under `01.01.02`. |
| level-2/l2-pos-29-table-bill-hydration-and-payment-status-visibility.md | Table Bill Hydration & Payment Status Visibility | STALE | IMPLEMENTED | RETIRE | Shipped; duplicated plan ID 29. |
| level-2/l2-pos-47-customer-card-and-member-portal.md | Digital Customer Card, Member Portal & Omnichannel Loyalty Hub | STALE | IMPLEMENTED (`customer-portal/`, `DigitalMemberCard`; recent passkey/social-login commit on default branch) | RETIRE | Shipped; CARD meaning (Life & Work pass model, not loyalty-only) owned by `experience-card-board-order.md` §2. |

### 4d. L2 notification/service (1)

| file | title | authority | implementation | recommendation | note |
|---|---|---|---|---|---|
| level-2/l2-pos-49-notification-center-and-operations-ticketing.md | Omnichannel Notification Center & Operations Service Ticketing Hub | STALE | IMPLEMENTED (`notifications/NotificationCenterDrawer`, `ServiceTicketingDrawer`, `EventTicketCheckInModal`) | RETIRE | Notification delivery semantics → `01.01.12.03-notification-delivery.md`; ticketing → `01.01.03-ticket.md`. |

### 4e. L2 SDK cutover waves 50-55 (5)

| file | title | authority | implementation | recommendation | note |
|---|---|---|---|---|---|
| level-2/l2-pos-50-production-contract-cutover-and-sdk-adoption.md | Hfe POS Production Contract Cutover and SDK Adoption | STALE | IMPLEMENTED (status Completed; `HfePosFinancialPort`, `HfeSdkAdapter`, `OfflineIntentQueue` in `src/services/financial/`; flagship read-back proof `#35` closed) | RETIRE | Defers correctly to CORE authority ("Authority References" section is deferential, not a claim); residual connected-mode breadth moved to plan 101. |
| level-2/l2-pos-51-unified-wave-upgrade-sdk-and-design-hierarchy.md | Unified Wave Upgrade SDK Adoption & 6-Tier Design Hierarchy | STALE | IMPLEMENTED (front-matter "In progress" is stale; PR #1 MERGED) | RETIRE | Merged; front-matter status unreliable — see finding below. |
| level-2/l2-pos-52-customer-touchpoints-and-order-channels.md | Customer Touchpoints and Order Channels Cutover (Wave 2) | STALE | IMPLEMENTED (PR #1 MERGED) | RETIRE | Shipped. |
| level-2/l2-pos-53-operations-kds-and-backoffice-cutover.md | Operations KDS and Backoffice Cutover (Wave 3) | STALE | IMPLEMENTED (PR #2 MERGED) | RETIRE | Shipped. |
| level-2/l2-pos-55-master-product-wide-compliance-sweep-and-device-parity.md | Master Product-Wide Compliance Sweep and Device Parity | STALE | IMPLEMENTED (PR #3 MERGED) | RETIRE | "100% Tier 2" claim in front matter is unevidenced; treat as provenance only. |

### 4f. L2 floor-plan/Tetris geometry saga 56-77 (18)

| file | title | authority | implementation | recommendation | note |
|---|---|---|---|---|---|
| level-2/l2-pos-56-proportional-tetris-zone-packing-zero-empty-space.md | Proportional Tetris Zone Packing | STALE | IMPLEMENTED (PR #4 MERGED) | RETIRE | Superseded by later geometry iterations; final state in code. |
| level-2/l2-pos-57-2d-tetris-vertical-rowspan-packing.md | 2D Tetris Vertical RowSpan Packing | STALE | IMPLEMENTED (PR #5 MERGED) | RETIRE | Same family. |
| level-2/l2-pos-58-symmetric-3x2-tetris-zone-pairing.md | Symmetric 3x2 Tetris Zone Pairing | STALE | IMPLEMENTED (PR #6 MERGED) | RETIRE | Same family. |
| level-2/l2-pos-59-universal-3-row-micro-budget-multi-device.md | Universal 3-Row Micro-Budget Multi-Device Parity | STALE | IMPLEMENTED (PR #7 MERGED) | RETIRE | Layout invariants now live in the consumer-client UI standard carried in AGENTS.md-type contracts, not this plan. |
| level-2/l2-pos-60-restore-spacious-4-col-grid-view.md | Restore Spacious 4-Column Grid View | STALE | IMPLEMENTED (PR #8 MERGED) | RETIRE | Shipped. |
| level-2/l2-pos-61-adaptive-factor-grid-columns-zero-empty-space.md | Adaptive Factor Grid Columns | STALE | IMPLEMENTED (PR #9 MERGED) | RETIRE | Shipped. |
| level-2/l2-pos-63-ios-widget-matrix-floor-plan.md | iOS/Android Modular Widget Matrix Floor Plan | STALE | IMPLEMENTED (PR #10 MERGED) | RETIRE | Shipped. |
| level-2/l2-pos-64-strict-4col-grid-and-6col-compact-canvas.md | Strict 4-Slot Grid & 6-Slot Compact Canvas | STALE | STALE (PR #11 CLOSED unmerged — approach abandoned) | RETIRE | Abandoned approach; do not dispatch from this plan. |
| level-2/l2-pos-65-4col-interlocking-tetris-rotation.md | 4-Column Continuous Interlocking Tetris Rotation | STALE | STALE (PR #12 CLOSED unmerged) | RETIRE | Abandoned approach. |
| level-2/l2-pos-67-continuous-interlocking-area-surface-engine.md | Continuous Interlocking Area Surface Engine | STALE | STALE (PR #13 CLOSED unmerged) | RETIRE | Abandoned approach. |
| level-2/l2-pos-68-native-svg-fillet-path-surface-engine.md | Native SVG Fillet Path Surface Engine | STALE | STALE (PR #14 CLOSED unmerged) | RETIRE | Abandoned approach. |
| level-2/l2-pos-69-symmetric-othello-grid-and-zone-surfaces.md | Symmetric Othello Grid & Zone Territorial Surfaces | STALE | STALE (PR #15 CLOSED unmerged) | RETIRE | Abandoned approach (pure-CSS successor PR #16 was merged instead). |
| level-2/l2-pos-70-pure-css-territorial-area-classification.md | Pure CSS Territorial Area Classification Engine | STALE | IMPLEMENTED (PR #16 MERGED) | RETIRE | Shipped terminal state of the geometry saga. |
| level-2/l2-pos-71-direct-modal-action-and-clean-selection-rollback.md | Direct Modal Action & Clean Selection Rollback | STALE | STALE (PR #17 CLOSED unmerged) | RETIRE | Abandoned or absorbed. |
| level-2/l2-pos-72-floor-plan-area-filters-and-full-view-consistency.md | Floor Plan Area Filters & Full View Consistency | STALE | STALE (PR #18 CLOSED unmerged) | RETIRE | Abandoned or absorbed. |
| level-2/l2-pos-73-unified-single-canvas-6col-compact-view.md | Unified Single Canvas 6-Column Compact View | STALE | STALE (PR #19 CLOSED unmerged) | RETIRE | Abandoned. |
| level-2/l2-pos-74-bar-operations-and-billion-monetary-stress-test.md | Bar Operations, Billion Monetary Stress-Test, Compact Formatter | STALE | STALE (PR #20 CLOSED unmerged) | RETIRE | Spatial-containment intent survives in the consumer-client UI standard, not this plan. |
| level-2/l2-pos-75-six-tier-layer-isolation-and-adaptive-pricetag-atom.md | 6-Tier Layer Isolation & Adaptive PriceTag Atom | STALE | STALE (PR #21 CLOSED unmerged) | RETIRE | Tier model lives in architecture contracts. |

### 4g. L2 core-sync/search/currency 76-86 (11)

| file | title | authority | implementation | recommendation | note |
|---|---|---|---|---|---|
| level-2/l2-pos-76-hfe-core-ssot-sync-and-multi-tender.md | Hfe Core SSOT Synchronization & Universal Multi-Tender Settlement | STALE | STALE (PR #22 CLOSED unmerged) | RETIRE | Settlement truth is CORE's (`01.05.05`); local multi-tender UI work absorbed elsewhere. |
| level-2/l2-pos-77-domain-separation-cafe-operations-and-ticketing.md | Domain Separation between Cafe Operations and Event Ticketing | STALE | STALE (PR #23 CLOSED unmerged) | RETIRE | Bounded-context principle survives in standards; plan abandoned. |
| level-2/l2-pos-78-shared-pos-catalog-category-showcase-and-search.md | Shared Category Showcase Pills & In-Page Search | STALE | IMPLEMENTED (PR #24 MERGED) | RETIRE | Shipped. |
| level-2/l2-pos-79-smart-search-and-multilingual-thesaurus.md | Smart Semantic Search & Multilingual Thesaurus | STALE | IMPLEMENTED (PR #25 MERGED) | RETIRE | Shipped; semantic-search capability provenance. |
| level-2/l2-pos-80-hfecard-dual-persona-warehouse-wms-and-milestone-courier.md | HfeCard Dual-Persona Passbook, Role-Pure WMS, Milestone Courier | STALE | IMPLEMENTED (PR #26 MERGED; `HfeCardIdentityPassbook`, dual-persona tests) | RETIRE | CARD Life/Work dual-persona meaning → `experience-card-board-order.md` §2; do not let this plan redefine CARD. |
| level-2/l2-pos-81-multi-country-adaptive-cash-denominations.md | Multi-Country Adaptive Cash Banknote Denominations | STALE | IMPLEMENTED (PR #27 MERGED) | RETIRE | Currency master data is CORE's (`01.01.08.01`); UI preset logic is implementation. |
| level-2/l2-pos-82-kiss-multi-currency-cashier-tender.md | KISS Multi-Currency Cashier Tender & Language Decoupling | STALE | IMPLEMENTED (PR #28 MERGED) | RETIRE | Shipped. |
| level-2/l2-pos-83-banknote-ceiling-and-speed-keys-000.md | Banknote Ceiling Dynamic Presets & Speed Keys 000 | STALE | IMPLEMENTED (PR #29 MERGED) | RETIRE | Shipped. |
| level-2/l2-pos-84-locale-driven-number-formatting.md | Locale-Driven Number & Money Field Formatter | STALE | IMPLEMENTED (PR #30 MERGED) | RETIRE | Localization projection semantics → `01.01.12.06-localization-projection.md`. |
| level-2/l2-pos-85-daymode-light-theme-engine.md | Day Mode Light Theme Engine & Cashier Workstation | STALE | IMPLEMENTED (light theme shipped; `scripts/capture-pos-daymode.cjs`; no literal `dayMode` symbol found — theme engine lives in MerchantConfigContext) | RETIRE | Shipped as part of the theme engine family (32/85/100). |
| level-2/l2-pos-86-hfex-tooling-broken-link-remediation.md | HFEX Tooling Broken Link & Dead Reference Remediation | STALE | IMPLEMENTED (status Done; PR #31 MERGED) | RETIRE | One-off remediation, complete. |

### 4h. L2 surface/ops/dns 87-100 (14)

| file | title | authority | implementation | recommendation | note |
|---|---|---|---|---|---|
| level-2/l2-pos-87-admin-mode-merchant-and-user-management.md | Admin Mode (Multi-Merchant & User RBAC Management Hub) | STALE | PARTIAL (`AdminPortalView`, admin components shipped; live `#126` legacy-PIN test issue open) | RETIRE | Admin semantics → `merchant-administration-surfaces.md`; residuals have live owners. |
| level-2/l2-pos-88-escpos-thermal-printer-and-cash-drawer-driver.md | Direct ESC/POS Thermal Printer & Cash Drawer Driver | STALE | PARTIAL (driver/encoder/services + tests exist; live `#88`: go-live readiness pre-approved, hardware tests simulated) | RETIRE | Contract rule: physical go-live must not be inferred from simulated hardware; residual owned by live `#88`. |
| level-2/l2-pos-88-flagship-exp-hfeit-suite-landing-page.md | Flagship Landing Page EXP.Hfeit (Ecosystem Suite) via Astro 7.2 | STALE | IMPLEMENTED (issue `#46` closed; storefront `exp` page exists) | RETIRE | EXP positioning now owned by Canon surface docs + `#111` claims hygiene; note duplicated plan ID 88. |
| level-2/l2-pos-90-safe-zero-downtime-dns-migration-togrow-and-sekeding.md | Safe Zero-Downtime DNS Migration (togrow.id & sekeding.com) | NOT_APPLICABLE | IMPLEMENTED (status Superseded; issue `#49` closed) | RETIRE | Already marked Superseded in front matter; deployment truth owned by deployment governance (`hfe-deployment-governance`). |
| level-2/l2-pos-91-live-core-plumbing-and-authoritative-readback.md | Live CORE Plumbing, Authoritative Read-Back Gating & Flagship Journey Proof | STALE | IMPLEMENTED (`liveCoreActivation.ts`, `HfePostingReadbackValidator` + tests; `#35` closed; issue `#91` closed as docs repair) | RETIRE | Executed; remaining connected-mode breadth is owned by plan 101 / live `#101`. |
| level-2/l2-pos-95-offline-stack-requalification.md | Offline Stack Re-Qualification & Idempotency Gating | STALE | IMPLEMENTED (requalification completed: POS `#61`/PR `#107` at `00528886`, PR `#112` at `eacd1ec2`; 119/119 focused PASS) | RETIRE | Legacy matrix dispositioned this family: `01.01.11-offline.md` owns semantics; residual real-device/manager-triage proof is POS `#114`. |
| level-2/l2-pos-96-storefront-resolver-fail-closed.md | Storefront Resolver Fail-Closed Protection | STALE | IMPLEMENTED (issue `#60` closed) | RETIRE | Fail-closed invariant enforced; provenance. |
| level-2/l2-pos-97-board-footer-merchant-onboarding-cta.md | BOARD Merchant Storefront Footer Onboarding CTA | STALE | IMPLEMENTED (CTA present in `packages/storefront-astro/src/layouts/MerchantStorefrontLayout.astro` → pos.hfeit.com) | RETIRE | Shipped. |
| level-2/l2-pos-98-exp-landing-system-that-grows-with-you.md | EXP.Hfeit Positioning: "A System That Grows With You" | STALE | IMPLEMENTED (issue `#93` closed) | RETIRE | Positioning copy shipped; claims language residual under live `#111`. |
| level-2/l2-pos-99-qr-order-scrollbar-and-theme-contrast-fix.md | QR Order Scrollbar & Universal Theme Contrast Hardening | STALE | IMPLEMENTED (`src/tests/themeContrastAudit.test.ts`) | RETIRE | Shipped. |
| level-2/l2-pos-100-fix-theme-desync-and-visual-capture.md | Theme Desynchronization Repair & Mandatory Visual Proof Protocol | STALE | IMPLEMENTED (`capture-day-night-contrast.cjs`, contrast guards, theme tests) | RETIRE | Shipped. |

### 4i. L2 newest wave 102-103 (2)

| file | title | authority | implementation | recommendation | note |
|---|---|---|---|---|---|
| level-2/l2-pos-102-luxury-online-delivery-checkout.md | Luxury Online Delivery Checkout & Precision Address Architecture | STALE | IMPLEMENTED (`useSelfDelivery`, `DeliveryAddressModal`, `customerDeliveryCheckoutPrecision.test.tsx` present on default branch; commit d9ef3e6 "PR #128") | RETIRE | Shipped 3-tier address/distance-fee checkout; delivery semantics → ORDER canon (§4); ongkir pricing semantics, if harvested, belong with the l1-15 courier extraction. |
| level-2/l2-pos-103-live-track-order-dock-and-hub-favorite-products.md | Live Track Order Dock & HUB Favorite Products Leaderboard | STALE | IMPLEMENTED (`posTrackOrderDockAndHubFavoriteProducts.test.tsx`, `FavoriteProductsLeaderboard.tsx` on default branch) | RETIRE | Shipped; hub analytics must obey the truth boundary (`#126`, plan 94). |

## Group 5 — UNCLEAR (1 file)

| file | title | authority | implementation | recommendation | note |
|---|---|---|---|---|---|
| level-2/l2-pos-101-board-dual-cta-and-online-state-isolation.md | BOARD Dual-CTA (Reservasi & Delivery/Pickup) & Online Table State Isolation | STALE | UNCLEAR (commit ebc3d20 "implement dual-CTA (#124)" touches plans; reserve CTA exists in `LandingPageView`, but the "Pesan Online (Antar & Ambil)" dual-CTA wording was NOT found on default branch) | UNCLEAR | Fails closed per instructions: implementation state unproven either way. Verify `#124` merge state and CTA rendering before dispositioning; table-state isolation portion unverified. |

---

## Templates (3 files, outside the 129 count)

`templates/level-1.md`, `templates/level-2.md`, `templates/level-n.md` — old-convention plan templates (okf front matter with `status: READY_TO_BUILD`, `dimensions: PILLAR/SURFACE/TIER`). NOT_APPLICABLE as authority; KEEP-AS-COORDINATION as scaffolding until the repo adopts the new-convention templates, at which point they should be replaced in the same reviewed change. They embed the 6-Tier/PILLAR taxonomy that matches the shipped app architecture.

---

## Cross-cutting findings

1. **Plan-ID vs GitHub-issue identity collision (live `#127`).** `github_issue:` front matter in plans 56-88 actually holds the L2 plan number, not a GitHub issue; the implementing PRs are repo PRs #1-#32 (shared numbering). Old issue numbers 33-53 now belong to unrelated new-style issues (e.g. plan 92 cites `github_issue: 35`, but live `#35` is the closed flagship read-back proof — accidentally sane, others are not). Duplicated plan IDs exist: 28 (x2), 29 (x2), 86 (x2), 87 (x2), 88 (x2). Never resolve a plan's "issue binding" without live query.
2. **Front-matter status is unreliable.** Plans 51/52/53/55 say "In progress" but their PRs (#1-#3) are MERGED; several "Proposed" plans shipped long ago. Status truth = code + PR/CI evidence, per the contract's evidence ladder.
3. **Level-0 pair is already dispositioned** at family level in `hfeit-product/governance/legacy-plan-disposition-matrix.md` (POS `eacd1ec2` rows): STALE as product authority, HARVESTED; Product `#68` remains the OPEN_DECISION on Experience shipping selection. The offline family (l1-06, l2-pos-08, l2-pos-95) has a matrix row too.
4. **This audit feeds live `#119`** ("Docs: bound active plan tree to current Product Canon authority") — the natural owner for turning these dispositions into repo-side supersession markers.
5. **Connected-mode work is genuinely open** (plan 101 / `#101`, blocked on HCB `#1019`/`#1025`): until it lands, POS demo journeys must keep demo/sample vs live-posted labeling per plan 94 and the canonical-demo-ecosystem contract (`#121`).
