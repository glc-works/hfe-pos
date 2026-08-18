---
okf_version: "0.2"
type: Development Plan Level 2
title: "HFEX Tooling Broken Link & Dead Reference Remediation"
description: "Remediate 38 broken references across hfe-pos scripts, agent skills, and Playwright capture tools caused by verbatim copy from Engine repo without Experience Layer adaptation."
tags: [development-plan, level-2, tooling, broken-links, hfex, remediation]
parent_level_1: l1-25-engineering-platform-suite
github_issue: 0
status: Proposed
---

# Level 2 Implementation Plan: HFEX Tooling Broken Link & Dead Reference Remediation

## 1. Outcome

All scripts, agent skills, and capture tools in `hfe-pos` reference only files
and commands that exist in the Experience Layer. Engine-specific code copied
verbatim from `headless-company-books` is either adapted with `hfex-*` naming
or removed. Zero broken references remain in Severity A (tooling fails) and
Severity B (skills misdirect).

## 2. Scope

- **`scripts/hfe.py` → `scripts/hfex.py`:** Strip Engine-only subcommands
  (`town`, `scenario`), fix `OPENAPI_PATHS` to resolve via sibling repo
  canonical path (`docs/active/api/openapi-v1.json`). Delete original.
- **`scripts/agent-state.py` → `scripts/hfex-agent-state.py`:** Strip
  Rust-specific audit functions (`audit_realization`, `audit_code_hygiene`,
  `audit_modularity`), replace with Experience Layer stubs. Fix persona
  paths to match actual `.agent-personas/` files. Delete original.
- **`scripts/start.sh`:** Replace hardcoded absolute paths with relative
  `$SCRIPT_DIR`, remove decommissioned town simulation menu item.
- **16× Playwright capture scripts:** Parametrize `brainDir` via
  `process.env.BRAIN_DIR` with sensible fallback. Fix `localhost:3000` →
  `localhost:5173`.
- **7× Agent skills:** Fix `hfe-rad0.py` → `hfex-rad0.py`, annotate
  Engine-only commands, fix OpenAPI path references.
- **Post-mortem knowledge base:** Create `docs/active/reference/post-mortem-index.md`
  with first entry documenting this failure pattern.

## 3. Explicit Exclusions

- **Severity C documentation drift** (15 items in `docs/active/standards/`
  and `docs/active/plans/level-2/`): Fix on-touch only, not in this L2.
- **`agent-state.py` modularity split** (1110 → ~810 lines post-strip):
  Separate L2 under L1-25.
- **Adapting audit functions to TypeScript/TSX scanning:** Separate L2.
- **Storybook view parity gap:** Separate L2 under L1-25.

## 4. Authority References

- Parent L1: `docs/active/plans/level-1/l1-25-engineering-platform-suite.md`
- Audit report: Conducted 2026-08-18 by 3 independent auditors
  (Markdown, TypeScript, Scripts) against commit `dcf68cd`.
- Naming convention: `hfex-*` = Experience, `hfe-*` = Engine.

## 5. Verification Plan

```bash
# Phase 1: hfex.py works
python3 scripts/hfex.py plan --level 2 | head -5
python3 scripts/hfex.py skill | head -5

# Phase 2: hfex-agent-state.py works
python3 scripts/hfex-agent-state.py slots

# Phase 3: start.sh portable
bash -n scripts/start.sh
grep -c '/Users/aldi' scripts/start.sh  # must be 0

# Phase 4: No hardcoded brain dir or port 3000
grep -rc 'b1389ef7' scripts/*.cjs  # must be 0
grep -rc 'localhost:3000' scripts/*.cjs  # must be 0

# Phase 5: Skills reference correct tools
grep -r 'hfe-rad0\.py' .agents/skills/  # must be 0

# Full regression
npm run typecheck
npm test -- --run
python3 scripts/hfex-rad0.py
```

## 6. Stop Conditions

- If `hfex.py plan` or `hfex.py skill` break after adaptation, stop and
  investigate before deleting `hfe.py`.
- If any Vitest suite fails after changes, revert the phase and investigate.
- If `hfex-rad0.py` references `hfe.py` internally, update radar first.
