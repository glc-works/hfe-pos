---
okf_version: "0.2"
type: Development Plan Level 2
title: Unified Simple POS Login Screen & Hfe Auth Transport Integration
description: Implements a clean, standalone POS login screen for staff 6-digit PIN login, cashier outlet branch selector, and owner auth token persistence connected directly to HCB Core REST APIs.
tags: [development-plan, level-2, pos-login, auth-screen, employee-pin, hfe-auth]
parent_level_1: l1-13-team-membership-and-staff-invitation
github_issue: 16
status: Proposed
---

# Level 2 Implementation Plan: Unified Simple POS Login Screen & Hfe Auth Transport Integration

## 1. Outcome
Delivers a standalone, ultra-simple POS workstation login screen (`src/views/PosAuthLoginView.tsx`) allowing staff members to select their store outlet branch, enter their 6-digit Employee PIN or login credentials, and authenticate directly against HCB Core REST APIs (`POST /v1/company-books/{book}/auth/employee-login`) per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: Unified POS Auth View (`src/views/PosAuthLoginView.tsx`)
- Implement `PosAuthLoginView.tsx` with 4 tabbed authentication modes per [`POS-AUTH-STD.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-AUTH-STD.md):
  1. **Tab 1 — Employee PIN Login**: Store branch selector dropdown, 3x4 numeric keypad for 6-digit Employee PIN entry, auto-submit on 6th digit.
  2. **Tab 2 — Owner Sign In**: Email & password login form with show/hide password eye toggle icon (`Eye` / `EyeOff`), `autocomplete="current-password"`, and "Lupa Password?" link.
  3. **Tab 3 — Owner Sign Up**: New store registration form with Brand Name, Email, Password with real-time strength meter (Min 8 chars, 1 uppercase, 1 number/symbol), and Terms check.
  4. **Tab 4 — Forgot Password & OTP Reset**: 2-step password reset flow (Step 1: Input registered email/phone to request 6-digit OTP token; Step 2: Input OTP & new password).

### Phase B: Anti-Bruteforce & Security Rate Limiting (`src/hooks/usePosAuth.ts`)
- Implement `usePosAuth()` hook:
  - Manages active logged-in staff/owner session (`currentStaffUser`, `activeBranchId`, `authToken`).
  - Session Persistence: Stores JWT token in `localStorage` (`hfe_pos_auth_token`).
  - **Rate Limiting Guard**: Enforces maximum 5 failed attempts within 5 minutes. Triggers 60-second cooldown timer upon 5 consecutive failures.
  - Logout helper: Clears staff session cleanly upon logout.

### Phase C: Hfe REST API Auth Client Integration (`src/services/hfeApi.ts`)
- Wire auth client endpoints:
  - `employeeLogin(branchId, pinCode)` ➔ `POST /v1/company-books/{book}/auth/employee-login`
  - `verifyWaInbound(phone, code)` ➔ `POST /v1/auth/wa-inbound/verify` (100% Free / Rp 0 User-Initiated WA Verification)
  - `ownerLogin(email, password)` ➔ `POST /v1/auth/login`
  - `ownerRegister(brandName, email, password)` ➔ `POST /v1/auth/register`
  - `forgotPassword(email)` ➔ `POST /v1/auth/forgot-password`
  - `resetPassword(token, newPassword)` ➔ `POST /v1/auth/reset-password`

### Phase D: Vitest Unit Testing (`src/tests/posAuth.test.ts`)
- Unit test coverage:
  - Verifies email regex and E.164 phone formatting.
  - Verifies 6-digit PIN validation and 5-attempt rate-limiting cooldown logic.
  - Verifies session token storage and auto-login recovery.

## 3. Explicit Exclusions
- Does not modify HCB server-side authentication engines; operates strictly within the Experience Layer login screen and REST transport layer.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- `PosAuthLoginView.tsx` file stays under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
