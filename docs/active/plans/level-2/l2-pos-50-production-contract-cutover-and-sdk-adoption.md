---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Production Contract Cutover and SDK Adoption
description: Establish HfePosFinancialPort with fail-closed HfeSdkAdapter, explicit MockHfeAdapter, pure OfflineIntentQueue, and governance-first topology resolution from Hfe Core
tags: [development-plan, level-2, pos, sdk-cutover, financial-port]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 50
status: Completed
---

# Hfe POS Production Contract Cutover and SDK Adoption

## Outcome

Delivers a single-source-of-truth financial integration layer (`HfePosFinancialPort`) for `hfe-pos` that eliminates synthetic success fabrication on network failures. Production traffic uses `HfeSdkAdapter` which communicates directly with `headless-company-books` via official TypeScript SDK/OpenAPI contracts with strict fail-closed error handling. Dev/test simulations use an explicit `MockHfeAdapter`, and offline transactions are buffered in `OfflineIntentQueue` as non-financial pending intents. Multi-branch accounting topology selection in POS UI is replaced with authoritative read-only topology resolution from Hfe Core settings.

## Scope

- **Financial Port & Adapter Architecture**:
  - `src/services/financial/HfePosFinancialPort.ts`: Canonical TypeScript interface defining contract methods for product catalog, cashier sessions, retail checkout, table split/merge, customer loyalty, and shift closure.
  - `src/services/financial/HfeSdkAdapter.ts`: Production implementation communicating with Hfe Core endpoints (`/v1/company-books/...`). Fails closed on network/server errors (no synthetic success generation).
  - `src/services/financial/MockHfeAdapter.ts`: Explicit mock implementation for Storybook, Vitest unit mocks, and local offline dev mode.
  - `src/services/financial/OfflineIntentQueue.ts`: IndexedDB queue storing intent payloads with `status: 'pending_sync'`, distinctly segregated from posted ledger confirmations.
- **Accounting Topology Governance**:
  - Deprecate client-side manual radio buttons for "Dimensional vs Multi-Book vs Sub-Account" in POS settings.
  - Implement `fetchCompanyBookSettings()` in `HfeSdkAdapter` to retrieve authoritative topology and cost centers governed by Hfe Core.
- **Desktop & Mobile Cashier Workflow Integration**:
  - Integrate `onSwitchToCatalog` in `PosCartSection` to provide immediate `[+ Tambah Menu]` CTAs.
  - Ensure `PosFavoritesBar` provides 1-tap bestseller speed keys docked on desktop dual-pane and in catalog tab on mobile.
- **Verification & End-to-End Proof**:
  - `src/tests/hfePosFinancialPortCutover.test.ts`: Automated test suite asserting fail-closed behavior, mock isolation, and ledger sync integrity.

## Explicit Exclusions

- Modifying core database tables or TigerBeetle schema in `headless-company-books` (Hfe Core is authoritative backend).
- Rewrite of non-financial visual components (Customer QR theme, KDS drag-and-drop animation).
- Second concurrent writable session claim during implementation.

## Authority References

- Parent L1: `docs/active/plans/level-1/l1-pos-01-core-architecture-and-standards.md`
- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #6: Primary Pilot Consumer & Engine Purity Invariant.
- Invariant Rule #8: 3-Tier Data Authority & Zero-Drift Resolution Rule.
- Invariant Rule #13: Universal Viewport Single Source of Truth & 3-Zone Header Budget.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Typecheck, ESLint, Tests, Build).
2. Fail-Closed Proof: When backend is disconnected in production mode, `HfeSdkAdapter` throws a genuine network error and buffers intent in `OfflineIntentQueue` without fabricating canonical success.
3. Mock Badge Proof: When `MockHfeAdapter` is activated, UI renders explicit `[SIMULATED / MOCK]` status badge.

## Stop Conditions

- Any requirement attempting to give POS UI write authority over Hfe Core accounting ledger topology.
- Scope creep into full backend kernel refactoring outside public REST/SDK contracts.
- Local CI gate failure or file exceeding 500 lines.
