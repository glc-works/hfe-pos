---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe Core SSOT Synchronization and Universal Multi-Tender Settlement Engine
description: Synchronizes hfe-pos with the latest upstream Hfe Core contracts (Commit 08f98245 / #833), implementing Universal Multi-Tender settlement interfaces and methods, Barcode wholesale pricing metadata, updated connector manifest permissions, and comprehensive test suites.
tags: [development-plan, level-2, pos, hfe-core, ssot, multi-tender, settlement, barcode-wholesale, manifest-sync]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 76
status: In progress
---

# Hfe Core SSOT Synchronization and Universal Multi-Tender Settlement Engine (L2-POS-76)

## Outcome

Synchronizes the `hfe-pos` frontend client suite with the canonical upstream contracts from `headless-company-books` (Commit `08f98245` / Issue #833) to uphold Hfe Core as the Single Source of Truth (SSOT):

1. **Universal Multi-Tender Types & Client Transport (`src/services/hfeCoreApi.ts`)**:
   - `PaymentTenderType`: `'cash' | 'qris' | 'card_debit' | 'card_credit' | 'hotel_room_folio' | 'voucher_credit' | 'bank_transfer'`
   - `TenderItemPayload`: `{ tender_type: PaymentTenderType, amount_minor: number, reference_id?: string, gl_account_override?: string }`
   - `DiscrepancyItemPayload`: `{ discrepancy_type: 'rounding_adjustment' | 'tip_income' | 'merchant_discount_fee' | 'cash_shortage' | 'cash_overage', amount_minor: number, reason?: string }`
   - `UniversalMultiTenderRequest`: `{ document_reference_id: string, total_obligation_minor: number, tenders: TenderItemPayload[], discrepancies?: DiscrepancyItemPayload[], notes?: string }`
   - `UniversalMultiTenderResponse`: `{ settlement_id: string, document_reference_id: string, total_obligation_minor: number, total_tendered_minor: number, total_discrepancy_minor: number, status: string, settled_at: string, journal_posting_id: string }`
   - Method: `settleUniversalMultiTender(payload: UniversalMultiTenderRequest, bookId?: string, baseUrl?: string): Promise<UniversalMultiTenderResponse>`
   - `BarcodeLookupResponse`: updated with `wholesale_price?: number` and `wholesale_min_qty?: number`.
   - Modularity rule strictly enforced (< 500 lines).

2. **Ecosystem Connector Manifest Synchronization (`connector.manifest.json`)**:
   - Updated permissions array: `["accounting.post", "payments.process", "inventory.read", "contacts.manage", "subledger.post_transaction"]`
   - Registered endpoint: `"settlements_multi_tender": "/v1/company-books/{book}/settlements/multi-tender"`

3. **Automated Verification & Vitest Test Suite (`src/tests/hfeCoreSyncAndMultiTender.test.ts`)**:
   - Multi-tender request validation ensuring mathematical exactness (`total_tendered + discrepancy === total_obligation`).
   - Barcode lookup with wholesale pricing tiers and minimum quantity validation.
   - Idempotency key preservation and automated generation for multi-tender settlement calls.

## Scope

### Pillar A: Contract & API Transport Updates
- Update `src/services/hfeCoreApi.ts` with new interfaces and multi-tender settlement function.
- Update `BarcodeLookupResponse` in `src/services/hfeCoreApi.ts` and `src/services/retailAndFineDiningApi.ts`.

### Pillar B: Connector Manifest Synchronization
- Update `connector.manifest.json` with synchronized permissions and multi-tender settlement endpoint.

### Pillar C: Verification Suite
- Add `src/tests/hfeCoreSyncAndMultiTender.test.ts` covering multi-tender settlements, barcode wholesale pricing, and idempotency handling.
- Full verification through `./scripts/ci-local.sh` and multi-device screenshot capture.

## Explicit Exclusions

- Modifying core database tables directly without passing through Hfe Core HTTP contracts.
- Altering physical cash hardware drivers.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #1: Hfe Core is the Single Source of Truth (SSOT).
- Invariant Rule #18: Hfe Core Endpoints & Universal Accounting Truth Invariant.
- Upstream Core Reference: `headless-company-books` Commit `08f98245` / Issue #833.

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0` (Modularity < 500 lines, Connector Manifest validator, HFE-UI-STD-001 Auditor, TypeScript typecheck, ESLint, 85+ Vitest test suites, Vite Production Build).
2. Visual proof: `node scripts/capture-all-views.cjs` and `node scripts/capture-compact-view.cjs` executed cleanly.

## Stop Conditions

- Any file exceeding 500 lines.
- Any CI test suite failure.
