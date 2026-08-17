---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Day Mode Light Theme Engine and Cashier Workstation
description: Implements high-contrast, anti-glare Day Mode (Light Theme) with semantic CSS tokens and Tailwind dark variants across POS workstation, table cards, cash register inputs, and top command bar, fully orchestrated via MerchantConfigContext.
tags: [development-plan, level-2, pos, day-mode, light-theme, design-tokens, cashier-ergonomics]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 85
status: In progress
---

# Hfe POS Day Mode (Light Theme Engine & POS Workstation) (L2-POS-85)

## Outcome

Delivers high-legibility Day Mode (Light Theme) for cashiers operating in high-sunlight or outdoor environments:

1. **Semantic CSS Token System (`src/index.css`)**:
   - High-contrast light palette (`#f8fafc` canvas, `#ffffff` surface, `#0f172a` primary text, `#e2e8f0` borders) paired seamlessly with dark palette.
2. **Context Theme Orchestrator (`src/context/MerchantConfigContext.tsx`)**:
   - Single source of truth managing `themeMode: 'light' | 'dark'` and synchronizing `document.documentElement.classList`.
3. **POS Workstation Light Theme Polish**:
   - `TableCard.tsx`: Crisp white free tables (`bg-white`), amber-warm occupied tables (`bg-amber-50`), and mint billing tables (`bg-emerald-50`).
   - `PosCartSection.tsx`: Clean white cart panel, high-contrast dark tabular figures (`text-slate-900`), and formatted money input.
   - `UnifiedPosCommandHeader.tsx`: 1-Tap Day/Dark Mode switcher button (`[ ☀️ / 🌙 ]`).

## Scope

### Pillar A: Tier 1 Design Tokens & Context
- `src/index.css`: Define light/dark root CSS variables.
- `src/context/MerchantConfigContext.tsx`: Theme synchronization with HTML class list.

### Pillar B: Tier 3 & 4 POS Workstation Components
- `src/components/shared/TableCard.tsx`: Dual-theme support with WCAG AAA contrast.
- `src/components/pos/PosCartSection.tsx`: Dual-theme cart panel and cash input.
- `src/components/pos/UnifiedPosCommandHeader.tsx`: 1-Tap theme toggle icon.

### Pillar C: Verification & Test Suite
- `src/tests/dayModeLightAndDarkTheme.test.ts`: Unit tests verifying theme switching, DOM class updates, and contrast invariants.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #5: Single Source of Truth Everywhere (`useMerchantConfig()`).

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0`.
2. Browser screenshot verification demonstrating clean Day Mode rendering on POS Cashier Workstation.

## Stop Conditions

- Any hand-maintained file exceeding 500 lines.
- CI gate failure.
