---
okf_version: "0.2"
type: Experience Plan Level N
id: "[plan-id-slug]"
title: "[Plan Title: Domain / Capability / Feature]"
level: 2 # Arbitrary depth: 0 (Master Hub), 1 (Domain Pillar), 2 (Feature/Component), 3 (Sub-task/Widget), N
parent_id: "[parent-plan-id or null]"
status: READY_TO_BUILD # BACKLOG | READY_TO_BUILD | IN_PROGRESS | IMPLEMENTED
dimensions:
  PILLAR: POS # CORE | BOARD | ADMIN | POS | ORDER | CARD | BOOK
  SURFACE: DESKTOP_1024 # MOBILE_360 | TABLET_768 | DESKTOP_1024 | KIOSK
  TIER: TIER4_WIDGET_CLUSTERS # TIER1_TOKENS | TIER2_REACT_ARIA | TIER3_DOMAIN_SLOTS | TIER4_WIDGET_CLUSTERS | TIER5_LAYOUTS | TIER6_VIEWS
  CADENCE: SMALL # SMALL (<0.5s in-memory) | MEDIUM (1-5s integration) | LARGE (>5s build/live)
  EXECUTION_LOOP: INNER # INNER (hot dev loop) | OUTER (pre-commit/CI) | LIVE (runtime/benchmarks)
budget_tokens: 45000
latency_sla_ms: 100
vitest_suites:
  - src/tests/example.test.ts
tags: [experience-plan, level-n, pillar-pos, desktop-1024, tier4]
---

# Level [N] Experience Plan: [Plan Title]

## 1. Executive Summary & Outcome
[Clear, verifiable outcome statement of what this Level N plan delivers for the Experience Layer]

## 2. Experience & Domain Scope
- **Inclusions:**
  - [Feature or component 1]
  - [Feature or component 2]
- **Exclusions:**
  - [Explicitly excluded items]

## 3. 6-Tier Atomic Architecture Alignment
- **Tier 1 (Tokens & Themes):** [e.g., CSS variables, color scales, tabular numeral configs]
- **Tier 2 (React Aria Atoms):** [e.g., Headless primitives in `src/ui/`, Button, Input, Modal]
- **Tier 3 (Domain Slots):** [e.g., Math adapters, context providers, offline storage]
- **Tier 4 (Widget Assemblies):** [e.g., TableCard, CartDrawer, ModifierModal]
- **Tier 5 (Layouts & Viewports):** [e.g., 4-Col Tetris Grid, Split-Screen Cashier Layout]
- **Tier 6 (Views & Smart Screens):** [e.g., POSMainView, KDSKanbanView, MemberPortalView]

## 4. Multi-Surface Viewport Invariants
- **Mobile Viewport (360px):** [One-thumb ergonomics, 100dvh safe-area padding, bottom sheet drawers]
- **Tablet Viewport (768px):** [Split-column layout, touch target sizing >= 44px]
- **Desktop / POS Terminal (1024px+):** [4-col dense grid, keyboard shortcuts, multi-pane workbench]
- **Kiosk / Self-Service:** [High-contrast touch buttons, auto-reset idle timeout, step-by-step wizard]

## 5. Defensive Spatial Isolation & Tabular Monetary Standards
- **Zero Text Collision:** Dynamic variables (Guest Name, Entity ID, Price, Elapsed Timer) partitioned into dedicated sub-containers or stacked rows.
- **Tabular Numerals:** Currency figures enforce `font-variant-numeric: tabular-nums` and dedicated mono containers to prevent layout jitter.
- **Capacity Utilisation:** Renders `👥 seated/max` format (e.g. `👥 3/4 Kursi`) with focal center alignment.
- **Anti-Zigzag Optical Flow:** Linear top-to-bottom reading path (ID ➔ Utilisation ➔ Guest ➔ Amount).

## 6. Child & Dependent Sub-Plans
- `docs/active/plans/level-[N+1]/[child-plan-id].md`

## 7. Verification Strategy & Acceptance Criteria
- **Vitest Unit Suites:** `npm test -- [suite_name]`
- **Radar Pillar Sentinels:** `python3 scripts/hfex-rad0.py --pillar [pillar_name]`
- **AST Structural Check:** `python3 scripts/hfex-rad0.py --ast`
- **Monotonic Boundary Check:** `python3 scripts/hfex-rad0.py --layers`
- **Cadence SLA:** Verified under Google Test Size `[SMALL/MEDIUM/LARGE]` (<`[latency_sla_ms]`ms).
