# Issue 100 HLab Synthetic Flagship Verification Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide one explicit, non-interactive flagship verification entry point in `hfe-pos` for HLab orchestration that accepts scoped synthetic tenant and Company Book identifiers, enforces fail-closed synthetic boundaries, executes the flagship E2E suite, and emits machine-readable receipts.

**Architecture:** A product-owned Node CLI runner (`scripts/hlab-verify-flagship.mjs`) bound to `"verify:flagship"` in `package.json`. The runner parses either CLI flags (`--hlab-synthetic-tenant`, `--hlab-synthetic-company-book`, `--input-file`, `--receipt-out`) or a typed JSON file, validates synthetic isolation (rejects missing, foreign, or production scope), executes the Playwright flagship test with proper scope isolation, and outputs a canonical schema receipt `hlab.flagship-verification-receipt.v1`.

**Tech Stack:** Node.js (ESM), TypeScript, Playwright, Vitest, JSON Schema receipt.

**Spec:** [HFE POS Issue #100](https://github.com/glc-works/hfe-pos/issues/100), `ARCHITECTURE.md`, `DEVELOPMENT.md`, and `docs/active/standards/HFE-OMBOK-STD-001.md`.

---

## Global Constraints

1. Baseline HFE POS authority is `origin/main` commit `b19490ec9817f2f3523a860099c8ddc445e60019`.
2. Do not chain arguments to generic shell commands; use a dedicated non-interactive entrypoint.
3. Fail-closed on missing, foreign, or production identifiers.
4. Credentials and private CA keys must never appear in argv, logs, stdout, or receipts.
5. All file additions must maintain strict 500-line modularity (`python3 scripts/check-modularity.py`).
6. All 10 local CI verification steps (`./scripts/ci-local.sh`) must pass 100%.

---

## Proposed Implementation Tasks

### Task 1: Create HLab CLI Runner & Receipt Generator
- File: `scripts/hlab-verify-flagship.mjs` (< 250 lines)
- Implements:
  - Argument parsing: `--hlab-synthetic-tenant`, `--hlab-synthetic-company-book`, `--tenant`, `--company-book`, `--input-file`, `--receipt-out`, `--json`.
  - Fail-closed synthetic guard: checks for valid UUID/synthetic format, denies production/live strings.
  - Test execution: runs `playwright test e2e/flagship-one-transaction-one-truth.spec.ts` with environment variables.
  - Receipt emission: produces `hlab.flagship-verification-receipt.v1` JSON structure.

### Task 2: Expose npm Script in `package.json`
- File: `package.json`
- Adds `"verify:flagship": "node scripts/hlab-verify-flagship.mjs"`.

### Task 3: Implement Contract & Parser Unit Tests
- File: `src/tests/hlabFlagshipVerificationContract.test.ts` (< 200 lines)
- Validates:
  - Rejection of missing arguments (exits 1).
  - Rejection of production tenant (exits 1).
  - Proper parsing of flags and typed input JSON file.
  - Schema conformity of verification receipt.

### Task 4: Local Verification & E2E Validation
- Run unit test: `npx vitest run src/tests/hlabFlagshipVerificationContract.test.ts`.
- Run CLI execution: `node scripts/hlab-verify-flagship.mjs --hlab-synthetic-tenant 01a035df-b618-7612-aef2-6e332bfcdec5 --hlab-synthetic-company-book BOOK-CAFE-HQ-88`.
- Run full 10-step CI gate: `./scripts/ci-local.sh`.

---

## Verification Evidence & HLab Handover

- Merged commit SHA on `glc-works/hfe-pos` `main` will be pinned in HLab PR `hfeit/hlab#5`.
- Emitted receipt follows `hlab.flagship-verification-receipt.v1`.
