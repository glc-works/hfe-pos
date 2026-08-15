---
okf_version: "0.2"
type: Development Plan Level 2
title: Modularity Guard, Connector Validator & Local CI Tooling
description: Implements automated Python guard scripts (scripts/check-modularity.py, scripts/validate-connector.py), one-command local CI runner (scripts/ci-local.sh), and package.json verification commands matching POS-ENG-STD-001.
tags: [development-plan, level-2, tooling, modularity-guard, ci-script, connector-validator]
parent_level_1: l1-02-barista-touch-pos-table-engine
github_issue: 6
status: Proposed
---

# Level 2 Implementation Plan: Modularity Guard, Connector Validator & Local CI Tooling

## 1. Outcome
Delivers automated guard tooling (`scripts/check-modularity.py`, `scripts/validate-connector.py`, `scripts/ci-local.sh`) and configures `package.json` scripts to enforce `POS-ENG-STD-001` standards automatically across all developer and subagent sessions.

## 2. Scope

### Phase A: Modularity Guard Script (`scripts/check-modularity.py`)
- Create Python script `scripts/check-modularity.py` to scan `src/`:
  - Counts non-comment, non-empty lines for all `.ts` and `.tsx` files in `src/`.
  - Flags any file exceeding **500 lines**.
  - Exits with code `1` if any file violates the threshold and prints file paths with line counts.
  - Exits with code `0` if all files comply with `POS-ENG-STD-001`.

### Phase B: Connector Manifest Validator (`scripts/validate-connector.py`)
- Create Python script `scripts/validate-connector.py` to inspect `connector.manifest.json`:
  - Validates JSON formatting and required top-level keys (`name`, `slug`, `version`, `permissions`, `monetization`, `endpoints`).
  - Asserts permissions against allowed HCB scope whitelist (`subledger.post_transaction`, `biller.create_split`, `tax.calculate_ppn`, `inventory.sync_stock`).
  - Exits with code `0` on clean validation.

### Phase C: Local CI Verification Script (`scripts/ci-local.sh`)
- Create executable bash script `scripts/ci-local.sh`:
  - Runs sequentially:
    1. `python3 scripts/check-modularity.py`
    2. `python3 scripts/validate-connector.py`
    3. `npx tsc --noEmit`
    4. `npm run lint`
    5. `npm run test` (Vitest)
    6. `npm run build` (Vite build)
  - Returns clear green output if all pass, or stops on first failure with diagnostic error messages.

### Phase D: `package.json` Integration
- Add convenience scripts to `package.json`:
  - `"typecheck": "tsc --noEmit"`
  - `"guard:modularity": "python3 scripts/check-modularity.py"`
  - `"guard:connector": "python3 scripts/validate-connector.py"`
  - `"ci": "./scripts/ci-local.sh"`

## 3. Explicit Exclusions
- Does not modify React UI component logic in `src/views/` or `src/components/`.

## 4. Verification Plan
- Execute `python3 scripts/check-modularity.py` (initially flags `src/App.tsx` until refactored by `l2-pos-05`).
- Execute `python3 scripts/validate-connector.py` and confirm `connector.manifest.json` passes clean.
- Execute `./scripts/ci-local.sh` and verify all pipeline steps run cleanly.
