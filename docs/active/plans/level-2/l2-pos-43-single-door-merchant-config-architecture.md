---
okf_version: "0.2"
type: Development Plan Level 2
title: Single-Door Merchant Configuration Architecture & DevMode Shortcut Hub
description: Consolidate all store configuration state (Payment Policy, Customer Theme, Merchant Theme, Custom Vault, Hardware Viewport, and App Domain) into a single unified MerchantConfigContext. DevMode acts strictly as a convenience shortcut calling the exact same single-door mutator APIs used by official Back-Office Settings.
tags: [development-plan, level-2, merchant-config, single-door-architecture, zero-drift, state-synchronization, devmode-scaffolding]
parent_level_1: l1-pos-suite-modernization
github_issue: 43
status: Proposed
---

# Single-Door Merchant Configuration Architecture & DevMode Shortcut Hub

## Outcome

1. **Single Door of Mutation (`MerchantConfigContext.tsx`):**
   - The authoritative single source of truth for:
     - Payment Policy (`pay-first` vs `open-tab`)
     - Active Customer Theme & POS Theme
     - Custom Saved Template Vault
     - Active App Domain
     - Hardware Viewport Simulation
2. **DevMode as a Pure Shortcut Scaffolding:**
   - `DevModePack` consumes `useMerchantConfig()` directly.
   - Any modification made via DevMode toolbar immediately mutates the central store and syncs with `CafeSettingsView`, `CustomerMobileView`, and `UnifiedPosView`.
3. **Production Standalone Purity:**
   - In production (when `DevModePack` is stripped), `CafeSettingsView` continues to mutate the exact same `MerchantConfigContext` without any missing dependency.

## Scope

- `src/context/MerchantConfigContext.tsx` (NEW: Unified Single-Door Context Provider < 500 lines)
- `src/components/dev/DevModePack.tsx` (Wire shortcut buttons directly to `useMerchantConfig()`)
- `src/App.tsx` (Wrap tree with `MerchantConfigProvider`)
- `src/tests/merchantConfigContext.test.ts` (Vitest test suite verifying single door synchronization)

## Authority references

- Parent L1: `docs/active/plans/level-1/l1-pos-suite-modernization.md`
- Normative UX Contract: `docs/active/standards/FNB-COMMERCE-UX-HEURISTICS.md` (GLC-FNB-UX-010)

## Verification

1. Local CI Gate `./scripts/ci-local.sh` passes 100% (Modularity, TypeScript typecheck, ESLint, 156+ Vitest unit tests, and production build).
2. Changing theme or payment policy in DevMode instantly reflects in Settings, Customer Menu, and POS without page reload.
