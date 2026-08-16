---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Hfe POS Auth SDK Starterkit Package (@hfe/pos-auth-starterkit)
description: Strategic plan for packaging hfe-pos's simple authentication engine (6-digit Employee PIN, WhatsApp Rp 0 Free Verification, Owner Sign In/Up, Rate-Limiting Guard) into an exportable, plug-and-play SDK package for the Hfe ecosystem.
tags: [plan, level-1, pos, auth-sdk, starterkit, npm-package, hfe-sdk]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Hfe POS Auth SDK Starterkit Package (@hfe/pos-auth-starterkit)

## 1. Domain Outcome
Delivers the **Hfe POS Auth SDK Starterkit Package** (`@hfe/pos-auth-starterkit`).

Packages `hfe-pos`'s standalone simple authentication solution (6-digit Employee PIN keypad, User-Initiated WhatsApp Rp 0 Free Verification, Owner Sign In/Up, 2-step Forgot Password OTP, and Rate-Limiting guard) into an exportable, plug-and-play React SDK package.

Enables third-party developers, agency partners, and internal Hfe app builders to launch new Experience Layer frontends (Kiosks, Self-Service Tablets, Mobile Apps, Merchant Portals) in **under 5 minutes** without building complex authentication UI/UX from scratch.

---

## 2. Package Architecture

```
 📦 @hfe/pos-auth-starterkit (Exportable NPM/React Package)
 ├─ 🔐 `PosAuthProvider`: React Context Provider wrapping session token, active branch, & RBAC state.
 ├─ 🖥️ `PosAuthLoginScreen`: 4-Tab Auth View Component (Staff PIN, Owner Sign In/Up, Forgot Pass).
 ├─ 📱 `WaVerificationButton`: 1-Tap User-Initiated WhatsApp Verification (Rp 0 Free Link).
 ├─ 🔏 `EmployeePinKeypad`: Tactile 3x4 numeric keypad component with auto-submit on 6th digit.
 └─ 🛡️ `usePosAuth()`: Custom hook providing `login()`, `logout()`, `verifyWaInbound()`, & rate-limiting state.
```

---

## 3. Capability Scope

### Pillar A: Plug-and-Play SDK Export Structure
1. **React Context Provider (`<PosAuthProvider>`):** Manages HCB REST API auth transport, session token persistence in `localStorage`, and active staff role.
2. **Pre-Built UI Components:** Exportable `PosAuthLoginScreen`, `EmployeePinKeypad`, `WaVerificationButton`, and `ForgotPasswordModal`.
3. **TypeScript Types:** Clean exported domain types (`StaffUser`, `AuthToken`, `PosBranch`, `StaffRole`).

### Pillar B: Zero-Friction Developer Experience
- Integration example for new Experience Layer apps:
```tsx
import { PosAuthProvider, PosAuthLoginScreen, usePosAuth } from '@hfe/pos-auth-starterkit'

export default function App() {
  return (
    <PosAuthProvider apiEndpoint="https://hfe.togrow.id/v1/company-books/SENOPATI-01">
      <MainWorkspace />
    </PosAuthProvider>
  )
}

function MainWorkspace() {
  const { isAuthenticated, currentStaffUser } = usePosAuth()

  if (!isAuthenticated) {
    return <PosAuthLoginScreen />
  }

  return <div>Welcome, {currentStaffUser.name}!</div>
}
```

---

## 4. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-20-hfe-pos-auth-starterkit-sdk-package.md`

---

## 5. Verification & Acceptance Criteria
- Importing `<PosAuthProvider>` and `<PosAuthLoginScreen>` into a clean React app authenticates successfully against HCB Core REST APIs.
- SDK package size remains under 25 KB gzipped.
- Exported components compile clean with 0 TypeScript errors.
