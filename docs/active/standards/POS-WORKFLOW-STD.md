---
okf_version: "0.2"
type: Standard Document
title: POS-WORKFLOW-STD — User Review & Interactive Development Loop Standard
description: Authoritative standard governing how AI agents, developers, and team members process user reviews, conduct roleplay audits, identify happy paths/pain points/gaps, update plans, and obtain explicit approval before execution.
tags: [standard, workflow, review-loop, agents-guidance, hfe-pos]
status: Approved
effective_date: 2026-08-15
---

# POS-WORKFLOW-STD: User Review & Interactive Development Loop Standard

## 1. Scope & Authority

This document defines the mandatory **User Review & Development Loop Protocol** for **Hfe POS & Commerce Suite** (`glc-works/hfe-pos`). It binds all AI agents (Aibo, Codex, Claude, Z Code), subagents, and human contributors.

---

## 🔄 2. The 3-Step Review & Development Cycle

```
                        ┌─────────────────────────────────────────────────────────┐
                        │      USER REVIEW & DEVELOPMENT LOOP PROTOCOL            │
                        └───────────┬───────────────────┬───────────────────┬─────┘
                                    │                   │                   │
     ┌──────────────────────────────┘                   │                   └──────────────────────────────┐
     ▼                                                  ▼                                                  ▼
 💬 STEP 1: INTERACTIVE DISCUSSION              📝 STEP 2: UPDATE FORMAL PLAN               ⚡ STEP 3: EXECUTE IMPLEMENTATION
 - Audit Happy Path (What's Good)               - Create/Update Level 1 Strategic Plan      - ONLY after explicit User approval
 - Audit Pain Points (UX Frictions)             - Create/Update Level 2 Implementation      - Run automated Vitest test suite
 - Audit Operational Gaps (Missing)             - Document explicit design choices          - Verify local CI gate clean
 - Surface tradeoffs & pushback
```

---

### 💬 Step 1: Interactive Discussion & Roleplay Audit
Whenever the USER provides a review, feedback, or POV evaluation:
1. Conduct a multi-role audit/roleplay walk-through across all relevant operational roles.
2. Identify and document:
   - 😄 **Happy Path**: What is already working well and delivering value.
   - ⚠️ **Pain Points**: Visual/UX frictions, unnecessary clicks, or confusing layouts.
   - 🚧 **Operational Gaps**: Missing operational capabilities required in real-life floor operations.
3. Discuss why items are right or wrong, surface architectural tradeoffs, and propose actionable fixes.
4. **DO NOT launch coding tools or subagents during this step.**

---

### 📝 Step 2: Update Formal Plan Document
Once the user and agent align on the proposed fixes and design choices:
1. Update or create the corresponding **Level 1 Strategic Plan** (`docs/active/plans/level-1/`).
2. Update or create the corresponding **Level 2 Implementation Plan** (`docs/active/plans/level-2/`).
3. Document all file changes, exclusions, and verification plans in prose.

---

### ⚡ Step 3: Execute Implementation ONLY After Explicit Approval
1. Present the updated plan to the user and request explicit approval.
2. **Launch implementation tools / subagents ONLY AFTER explicit approval is received.**
3. Verify all changes using automated test suites (`npm run test`), modularity guards (`check-modularity.py`), and local CI gates (`ci-local.sh`).
