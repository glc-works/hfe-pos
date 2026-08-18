---
okf_version: "0.2"
type: Strategic Plan Level 1
title: "HFEX Engineering Platform Suite"
description: "Experience Layer engineering platform infrastructure: hfex-* tooling, radar sentinels, Storybook living docs, Playwright capture, frontend CI gates, agent skills/personas, and post-mortem knowledge base."
tags: [plan, level-1, pos, engineering-platform, tooling, dx, hfex]
parent_level_0: hfe-pos-suite-master-plan
status: Proposed
---

# Level 1 Strategic Plan: HFEX Engineering Platform Suite

## 1. Domain Outcome

Delivers and maintains the **Experience Layer engineering platform** — the
shared infrastructure that supports contributors (human and agent) in building,
verifying, and integrating with the HFE Experience Layer (`hfe-pos`).

**Scope boundary:** If a change strengthens how people build, verify, or
integrate with the Experience Layer — not what the end-user of the application
experiences — it belongs here. When an internal tool is promoted to an
external-facing engine capability, the L2 stays under this L1 (the tool's
*home* is the platform, even if it gains a product surface).

**Naming convention:** Experience Layer tools use the `hfex-*` prefix.
Engine/Core tools use the `hfe-*` prefix and live in `headless-company-books`.

## 2. Capability Scope

- **`hfex-*` CLI Tooling:** Experience-adapted introspection CLI (`hfex.py`),
  agent state coordination (`hfex-agent-state.py`), and radar sentinel
  (`hfex-rad0.py`).
- **Storybook Living Documentation:** 4-Quadrant visual suites, scenario
  stories, and view-level story parity.
- **Playwright Capture & Visual Regression:** Portable screenshot scripts,
  parametrized output directories, correct dev server ports.
- **Frontend CI Gates:** Vitest suite parity, TypeScript strict mode,
  bundle budget, and radar pillar gates.
- **Agent Infrastructure:** Experience-specific agent skills, personas,
  and session lifecycle tooling.
- **Knowledge Base:** Post-mortem index and lessons-learned registry to
  prevent recurring failure patterns.

## 3. Dependent Level 2 Plans

- `docs/active/plans/level-2/l2-pos-86-hfex-tooling-broken-link-remediation.md`

## 4. Verification & Acceptance Criteria

- All `hfex-*` scripts execute without error on a clean checkout.
- Zero hardcoded absolute paths in scripts (grep verification).
- Zero references to Engine-only paths (`hcb2/`, `v2/service/`, `*.rs`) in
  Experience Layer tooling.
- Agent skills reference only `hfex-*` tools or explicitly annotate Engine
  dependencies.
- Post-mortem index exists and is referenced from radar or session-start.
