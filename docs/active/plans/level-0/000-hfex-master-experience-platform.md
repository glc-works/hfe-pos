---
okf_version: "0.2"
type: Experience Plan Level 0
id: "000-hfex-master-experience-platform"
title: "HFE-X: Master Experience Platform & 7-Pillar Frontend Architecture"
level: 0
parent_id: null
status: IMPLEMENTED
dimensions:
  PILLAR: CORE
  SURFACE: DESKTOP_1024
  TIER: TIER6_VIEWS
  CADENCE: MEDIUM
  EXECUTION_LOOP: OUTER
budget_tokens: 150000
latency_sla_ms: 200
vitest_suites:
  - src/tests/idempotency.test.ts
  - src/tests/pos.test.ts
  - src/tests/kds.test.ts
  - src/tests/member-card.test.ts
  - src/tests/financial-subledger.test.ts
tags: [experience-plan, level-0, hfex, master-hub, 7-pillars, 6-tiers]
---

# Level 0 Master Plan: HFE-X Experience Platform

## 1. Executive Summary & Outcome
**HFE-X** (`glc-works/hfe-pos`) is the unified Experience Layer for modern omnichannel commerce, point-of-sale, kitchen operations, member loyalty, and financial subledger interactions. It delivers a hyper-modular, accessible, 6-tier React Aria architecture with zero layout collision, tabular monetary rendering, and strict sub-500 line modularity boundaries.

## 2. The 7 Architectural Pillars of Experience
```
                      ┌─────────────────────────────────────────────────────────────┐
                      │          000-hfex-master-experience-platform (L0)           │
                      │               HFE-X Master Experience Hub                   │
                      └──────────────────────────────┬──────────────────────────────┘
                                                     │
         ┌──────────────┬──────────────┬─────────────┼─────────────┬──────────────┬──────────────┐
         │              │              │             │             │              │              │
    ┌────▼─────┐   ┌────▼─────┐   ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐   ┌────▼─────┐   ┌────▼─────┐
    │  P1:     │   │  P2:     │   │  P3:     │  │  P4:     │  │  P5:     │   │  P6:     │   │  P7:     │
    │  CORE    │   │  POS     │   │  BOARD   │  │  ORDER   │  │  CARD    │   │  BOOK    │   │  ADMIN   │
    │  Tokens, │   │  4-Col   │   │  KDS     │  │  Omni-   │  │  Member  │   │  Ledger  │   │  Staff,  │
    │  Aria &  │   │  Tetris, │   │  Queue & │  │  Channel │  │  Loyalty │   │  Parity  │   │  Wizard  │
    │  Storage │   │  Floor   │   │  Barista │  │  Journey │  │  Voucher │   │  Cutover │   │  & Shifts│
    └──────────┘   └──────────┘   └──────────┘  └──────────┘  └──────────┘   └──────────┘   └──────────┘
```

### Pillar Overview
1. **CORE (`PILLAR=CORE`):** Design tokens, Tier 2 React Aria primitives, Theme engine, IndexedDB offline resilience, and Hfe Auth StarterKit SDK.
2. **POS (`PILLAR=POS`):** Retail cashier, 4-column adaptive Tetris floor plan, table capacity utilisation (`👥 seated/max`), cart calculation engine, and split-bill payments.
3. **BOARD (`PILLAR=BOARD`):** KDS Kitchen Display System, Barista ticket display, course pacing & firing sommelier controls, and real-time operations notifications.
4. **ORDER (`PILLAR=ORDER`):** Customer smartphone QR self-ordering, guest login with WhatsApp/phone, dining cart modifier drawer, and pay-first vs open-tab checkout policies.
5. **CARD (`PILLAR=CARD`):** Universal loyalty tiers, points accumulation, dynamic voucher wallet, member digital cards, and contact CRM master view.
6. **BOOK (`PILLAR=BOOK`):** Hfe OpenAPI financial subledger cutover, multi-warehouse inventory transfer, multi-branch outlet switcher, and multi-tender reconciliation.
7. **ADMIN (`PILLAR=ADMIN`):** Store onboarding wizard, staff RBAC & PIN authentication, shift cash drawer balancing, void/refund manager, and self-delivery courier dispatch.

## 3. 6-Tier Layer Boundary Architecture
All frontend components adhere strictly to monotonic downward imports:
- **Tier 1 (Tokens & Theme Engine):** `src/tokens/`, `src/theme/`, `src/index.css`
- **Tier 2 (React Aria Atoms & Primitives):** `src/ui/` (`Button`, `Input`, `PriceTag`, `CapacityBadge`, `Modal`, `Select`)
- **Tier 3 (Domain Slots & Headless Hooks):** `src/components/shared/`, `src/context/`, `src/hooks/`
- **Tier 4 (Widget Assemblies & Cards):** `src/components/tables/`, `src/components/cart/`, `src/components/kds/`
- **Tier 5 (Master Layouts & Viewports):** `src/layouts/` (Tetris grid, responsive shell, single top-bar)
- **Tier 6 (Views & Smart Screens):** `src/views/` (`POSView`, `KDSView`, `OrderView`, `CardView`, `AdminView`)

## 4. Multi-Surface Viewport Matrix
- **Mobile Viewport (360px):** Single-column stacked layouts, 100dvh viewport, bottom drawers, 48px touch targets.
- **Tablet Viewport (768px):** 2-column split master-detail views, Sommelier KDS grid, waiter mobile pad.
- **Desktop / POS (1024px+):** 4-column interlocking Tetris floor plan, dense POS cashier layout, multi-window DevKit HUD.
- **Kiosk Mode (Portrait/Landscape):** High-visibility visual cards, idle reset guards, self-checkout flow.

## 5. Verification Strategy & Sentinels
- **Pillar 1-9 Diagnostic Sentinels:** Checked via `python3 scripts/hfex-rad0.py`
- **86 Vitest Unit Suites:** Checked via `npm test` or `python3 scripts/hfex-rad0.py --pillar vitest`
- **AST Pattern Integrity:** Checked via `python3 scripts/hfex-rad0.py --ast`
- **Monotonic Layer Boundaries:** Checked via `python3 scripts/hfex-rad0.py --layers`
