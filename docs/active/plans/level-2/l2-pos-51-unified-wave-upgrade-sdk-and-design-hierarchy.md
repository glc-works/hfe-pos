---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Unified Wave Upgrade SDK Adoption and 6-Tier Design Hierarchy
description: Master Wave 1 cutover uniting official Hfe Core TypeScript SDK adoption, single-door HfePosPort boundary, pure offline intent semantics, shadcn CLI components.json integration, and the 6-Tier React Aria Atomic Domain Hierarchy with Fixed-Slot Tetris Grid.
tags: [development-plan, level-2, pos, sdk-adoption, design-hierarchy, react-aria, shadcn-cli]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 51
status: In progress
---

# Hfe POS Unified Wave Upgrade: SDK Adoption & 6-Tier Design Hierarchy

## Outcome

Delivers a unified, cohesive Wave 1 upgrade across four key engineering dimensions:

1. **Hfe Core TypeScript SDK Adoption (Contract SSOT & Accounting Truth)**:
   - Migrates POS integration to the official `@hfe/core` TypeScript SDK via an isolated `HfePosPort` interface boundary.
   - Eliminates all local shadow ledgers; server calculations authoritative in all money/tax PB1 mutations.
   - Migrates the complete **First Cashier Journey** (Open Shift -> Catalog Read -> Fast Checkout -> Tender -> Close Shift & Cash Reconciliation).

2. **Security & Financial Integrity (Anti-Fraud & Fail-Closed Semantics)**:
   - Enforces strict fail-closed handling in production mode (no synthetic financial success on network drop).
   - Mandatory client-generated UUID v4 idempotency keys (`X-Idempotency-Key`) for all mutation requests.
   - Pure offline intent buffer (`OfflineIntentQueue`) writing non-financial `pending_local` intents to physical IndexedDB.

3. **Performance & Touch Ergonomics (<16ms React Aria Engine)**:
   - Standardizes Tier 2 Headless Primitives on `react-aria-components` for sub-16ms tactile visual feedback, zero 300ms mobile tap delay, and keyboard workstation navigation.
   - Enforces Master Fixed-Slot Grid Tetris (Compact 6-Slot, Expand 4-Slot) guaranteeing $\ge 105\text{px}$ per standard slot and $\ge 220\text{px}$ for VIP 2-slot widgets, eliminating all text collision and clipping.

4. **Maintainability & Developer Velocity (shadcn CLI & 6-Tier SSOT)**:
   - Configures official `components.json` binding `@/ui` (React Aria Atoms) and `@/components/shared` (Domain Widgets) for instant automated CLI scaffolding.
   - Implements strict 6-Tier SSOT layer isolation (Token -> React Aria Atom -> Domain Widget -> Widget Cluster Assembly -> Master Layout -> Smart Screen), ensuring changes are maintained once per layer with zero cross-file ripple breakage.

## Scope

### Pillar A: shadcn CLI & Tier 2 React Aria Atoms
- `components.json`: Official shadcn configuration binding `@/ui`, `@/components/shared`, `@/lib/utils`, and `@/hooks`.
- `src/ui/`: React Aria Atoms (`PriceTag.tsx`, `TimerPill.tsx`, `MinSpendPill.tsx`, `CapacityBadge.tsx`, `Button.tsx`, `Modal.tsx`, `Drawer.tsx`, `Tabs.tsx`).

### Pillar B: Domain Widgets & Fixed-Slot Tetris Clusters
- `src/components/shared/ProductCard.tsx`: Polymorphic card (POS Cashier with SKU vs Customer QR without SKU, event bubbling isolation via `e.stopPropagation()`).
- `src/components/shared/TableCard.tsx`: Slot-budgeted table card (1-Slot Standard vs 2-Slot VIP with Min Spend Progress & Shortfall metrics).
- `src/components/pos/PosTableFloorPlanSection.tsx`: Master Fixed-Slot Grid with Proportional Tetris Pairing ($N_1 + N_2 = M$, e.g. VIP 2 + Poolside 4 = 6 slots) and defensive 1-row zone headers.

### Pillar C: Hfe Core SDK & Port-Adapter Boundary
- `src/services/hfe/HfePosPort.ts`: Canonical POS-facing interface for shift management, product catalog, fast checkout, tender recording, and reconciliation.
- `src/services/hfe/HfeSdkAdapter.ts`: Production implementation calling official `@hfe/core` SDK contracts with strict fail-closed error handling.
- `src/services/hfe/MockHfeAdapter.ts`: Explicit mock implementation strictly segregated for Storybook, Vitest, and demo modes.
- `src/services/hfe/OfflineIntentQueue.ts`: IndexedDB queue holding `pending_local` intents with idempotency replay guarantees.

### Pillar D: Verification & Integration Tests
- `src/tests/hfeUnifiedWaveUpgrade.test.ts`: Automated test suite proving:
  1. Cashier journey execution via `HfePosPort`.
  2. Idempotency preservation on retry without duplicate posting.
  3. Strict fail-closed offline intent semantics (no synthetic financial success).
  4. 6-Tier slot budgeting and single-increment product card isolation.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Rewriting secondary non-cashier modules in Wave 1 (Wave 2 covers Customer QR & Member Passbook; Wave 3 covers KDS & Warehouse).
- Direct PostgreSQL access from POS client.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #14: The 6-Tier Atomic Domain Hierarchy & React Aria Engine.
- Invariant Rule #18: Hfe Core Endpoints & Universal Accounting Truth Invariant.
- Invariant Rule #19: Mission-Critical Data Handling, Offline Persistence & Conflict Resolution.
- Invariant Rule #22: The Proportional Tetris & Child-Slot Budget Invariant.
- Invariant Rule #23: Zero-Apology & Direct Iterative Post-Mortem Protocol.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 62+ Vitest Suites, Vite Build).
2. Black-Box Journey Proof: Full cashier workflow (Open Shift -> Catalog -> Fast Checkout -> Tender -> Close Shift) completes cleanly via `HfePosPort`.
3. Offline Intent Proof: Disconnected production checkout creates `pending_local` intent in IndexedDB with zero fake ledger posting.
4. UI Collision Proof: Verified zero text collision and zero layout clipping across 360px, 768px, 1024px, and 1440px viewports.

## Stop Conditions

- Any attempt to give POS client authority to fabricate general ledger postings or bypass Hfe Core server calculations.
- Hardcoding direct SDK calls inside presentational leaf widgets (Layers 1-4).
- Local CI gate failure or any hand-maintained file exceeding 500 lines.
