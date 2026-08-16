---
okf_version: "0.2"
type: Development Plan Level 2
title: Exportable @hfe/pos-auth-starterkit Package, Plug-and-Play React Auth Provider & UI Components
description: Implements exportable package bundle for @hfe/pos-auth-starterkit SDK, exportable PosAuthProvider, PosAuthLoginScreen, EmployeePinKeypad, and WaVerificationButton components integrated with HCB REST APIs.
tags: [development-plan, level-2, auth-sdk, starterkit, npm-package, hfe-sdk]
parent_level_1: l1-17-hfe-pos-auth-starterkit-sdk
github_issue: 20
status: Proposed
---

# Level 2 Implementation Plan: Exportable @hfe/pos-auth-starterkit Package, Plug-and-Play React Auth Provider & UI Components

## 1. Outcome
Delivers the exportable SDK bundle for `@hfe/pos-auth-starterkit` (`src/sdk/auth/index.ts`, `src/sdk/auth/PosAuthProvider.tsx`, `src/sdk/auth/components/`) allowing third-party and internal developers to integrate `hfe-pos`'s simple authentication engine into any React app in under 5 minutes per [`POS-AUTH-STD.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-AUTH-STD.md).

## 2. Scope

### Phase A: SDK Export Entry Point & Provider (`src/sdk/auth/PosAuthProvider.tsx`)
- Implement `PosAuthProvider.tsx`:
  - Context Provider accepting `apiEndpoint`, `bookId`, and `onAuthSuccess` callback.
  - Manages session token persistence in `localStorage` (`hfe_pos_auth_token`).
  - Rate-Limiting Guard: Maximum 5 failed attempts within 5 minutes, 60-second cooldown timer.

### Phase B: Exportable UI Components (`src/sdk/auth/components/`)
- `PosAuthLoginScreen.tsx` — Standalone 4-tab authentication modal (Staff PIN, Owner Sign In, Owner Sign Up, Forgot Password).
- `EmployeePinKeypad.tsx` — Tactile 3x4 numeric keypad component with auto-submit on 6th digit.
- `WaVerificationButton.tsx` — 1-Tap User-Initiated WhatsApp Verification (Rp 0 Free Link) button.

### Phase C: Package Export Index (`src/sdk/auth/index.ts`)
- Implement `index.ts`:
  - Exports `PosAuthProvider`, `PosAuthLoginScreen`, `EmployeePinKeypad`, `WaVerificationButton`, `usePosAuth()`, and domain TypeScript types (`StaffUser`, `AuthToken`, `StaffRole`).

### Phase D: Vitest Unit Testing (`src/tests/authSdk.test.ts`)
- Unit test coverage:
  - Verifies `<PosAuthProvider>` context state initialization and token persistence.
  - Verifies exported component renders cleanly without missing context errors.

## 3. Explicit Exclusions
- Does not modify HCB server-side authentication engines; operates strictly within the Experience Layer SDK export layer.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files in `src/sdk/auth/` stay under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
