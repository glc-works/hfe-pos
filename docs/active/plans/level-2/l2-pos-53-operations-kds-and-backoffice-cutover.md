---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Operations Kitchen Display System and Backoffice Cutover
description: Wave 3 upgrade delivering Kitchen Display System (KDS) multi-station routing, fine dining course hold and fire matrix, warehouse multi-branch inventory transfers, spoilage ledger recording, omnichannel service ticketing, and retirement of legacy handwritten REST calls into the canonical HfePosPort architecture.
tags: [development-plan, level-2, pos, operations, kds, warehouse, backoffice]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 53
status: In progress
---

# Hfe POS Operations, KDS & Backoffice Cutover (Wave 3)

## Outcome

Delivers the final operational and backoffice convergence for `hfe-pos` across four key pillars:

1. **Kitchen Display System (KDS) & Multi-Station Routing**:
   - Decomposes order line items into specialized work orders across stations (`Barista Bar`, `Hot Kitchen`, `Sommelier & Bar`).
   - Fine dining course hold-and-fire progression (`Appetizer` -> `Main Course` -> `Dessert`) with real-time cooking elapsed timers.

2. **Multi-Branch & Warehouse Inventory Ledger Integration**:
   - Multi-branch stock transfers (`Outlet Senopati` -> `Outlet PIK`) with in-transit status and destination confirmation.
   - Spoilage and waste recording directly posted as inventory shrinkage expense entries (`GL 5101`).

3. **Omnichannel Service Ticketing & Notification Hub**:
   - Real-time waiter call chits (`Water Refill`, `Bill Request`, `Clean Table`) with elapsed duration timers and 1-tap staff resolution.
   - Gate-in event ticket check-in validator updating pass statuses to `CHECKED_IN / USED`.

4. **Full Port-Adapter Migration**:
   - Consolidates all remaining operational mutations under `HfePosPort`, ensuring zero un-intercepted network requests across the entire application.

## Scope

### Pillar A: Kitchen Display System (KDS)
- `src/views/UnifiedKdsView.tsx`: Station switcher (`All`, `Barista`, `Kitchen`), course matrix, and tactile order status toggling (`queued` -> `cooking` -> `ready` -> `served`).
- `src/components/kds/KdsHoldAndFireCard.tsx`: Hold/Fire visual indicators and priority alert cards.

### Pillar B: Warehouse & Multi-Branch Operations
- `src/views/StaffWorkstationView.tsx`: Integrated warehouse stocktake, spoilage ledger reporting, and branch transfer requisition.
- `src/services/financial/HfePosFinancialPort.ts`: Method declarations for inventory transfers and waste write-offs.

### Pillar C: Service Ticketing & Notification Hub
- `src/components/notifications/NotificationCenterDrawer.tsx`: Unread counter badge, category filter, and 1-tap clearance.
- `src/components/notifications/ServiceTicketingDrawer.tsx`: Table service chit queue with wait duration timers.
- `src/components/notifications/EventTicketCheckInModal.tsx`: Gate-in validator for event passes.

### Pillar D: Verification & Integration Tests
- `src/tests/operationsKdsAndBackofficeWave3.test.ts`: Automated test suite asserting:
  1. Multi-station kitchen order decomposition.
  2. Course hold and fire status progression.
  3. Warehouse spoilage write-off and branch transfer calculations.
  4. Service ticket creation and resolution pipeline.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books`.
- Direct PostgreSQL access from POS client.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #6: Primary Pilot Consumer & Engine Purity Invariant.
- Invariant Rule #12: Universal Cross-Scenario Abstraction & Generalization Invariant.
- Invariant Rule #14: The 6-Tier Atomic Domain Hierarchy & React Aria Engine.
- Invariant Rule #18: Hfe Core Endpoints & Universal Accounting Truth Invariant.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest, HFE-UI-STD-001 Auditor, Typecheck, ESLint, 65+ Vitest Suites, Vite Build).
2. Kitchen Dispatch Proof: Splitting an order with food and coffee sends items to their respective stations.
3. Spoilage Ledger Proof: Waste write-off generates balanced double-entry GL adjustment entries.
4. Ticket Resolution Proof: Service tickets transition deterministically from `open` to `resolved`.

## Stop Conditions

- Any hand-maintained file exceeding the 500-line modularity threshold.
- Local CI gate failure.
