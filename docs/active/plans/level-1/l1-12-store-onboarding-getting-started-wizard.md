---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Simple Outside Complex Inside — Store Onboarding & Getting Started Wizard
description: Core product setup framework delivering a 3-step onboarding wizard for new merchants (Store Type, Brand & Sosmed Profile, PB1 Tax & Kas Float) that auto-configures complex HCB background policies under a clean, frictionless interface.
tags: [plan, level-1, pos, onboarding, getting-started, simple-outside-complex-inside]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Simple Outside Complex Inside — Store Onboarding & Getting Started Wizard

## 1. Domain Outcome
Delivers the **"Simple Outside, Complex Inside"** product onboarding experience for `hfe-pos` (`glc-works/hfe-pos`).

New cafe owners, minimarket cashiers, or fine dining managers can set up their entire store workspace in **under 2 minutes** via a frictionless **3-Step Getting Started Wizard**. Under the hood, `hfe-pos` automatically initializes complex HCB financial policies, double-entry subledger GL accounts (`4010-Beverage Sales`, `1010-Cash Drawer`), UUID v4 idempotency parameters, and domain policy settings (`businessTypePolicy` & `operationScalePolicy`).

---

## 2. Product Philosophy: "Simple Outside, Complex Inside"

```
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                              SIMPLE OUTSIDE (UI / UX Layer)                            │
 ├────────────────────────────────────────────────────────────────────────────────────────┤
 │  - 3-Step Store Setup Wizard (< 2 Minutes Onboarding)                                  │
 │  - Zero accounting jargon on cashier / customer screens                                │
 │  - 1-Tap Customer QR Order, Scan & Go, and Barista Touch POS                           │
 └───────────────────────────────────────────┬────────────────────────────────────────────┘
                                             │ (Auto-Configures Background Policies)
                                             ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                            COMPLEX INSIDE (HCB Kernel & Engines)                       │
 ├────────────────────────────────────────────────────────────────────────────────────────┤
 │  - Mandatory UUID v4 `X-Idempotency-Key` exactly-once checkout execution               │
 │  - Subledger posting to HCB Financial Kernel (Sales GL 4010, PB1 Tax 2110, Cash 1010)  │
 │  - Web Crypto SHA-256 integrity checksums & IndexedDB offline resilience buffer        │
 │  - Multi-UOM pricing conversions (Pcs ➔ Pack ➔ Dus/Karton)                             │
 │  - Automatic COGS recipe BOM ingredient stock depletions                               │
 └────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Capability Scope

### A. 3-Step Store Getting Started Setup Wizard (`src/components/onboarding/`)

- **Step 1 — Pilihan Jenis Toko & Skala Usaha (Store Type & Scale)**:
  - Business Type Selector: ☕ *Cafe & F&B*, 🛒 *Toko Kelontong / Retail*, 🍷 *Fine Dining*.
  - Scale Mode Selector: 👤 *1 Orang (Solo Owner)*, 👥 *2-3 Staf (Combined)*, 🏢 *Multi-Staff (Enterprise)*.
- **Step 2 — Profil Brand, Sosmed & Storefront (Brand & Social Profile)**:
  - Brand Name (e.g. "Kopitiam Senopati & Roastery"), Logo URL, Address, Instagram (`@kopitiam.senopati`), WhatsApp Order Contact, WiFi SSID & Password.
- **Step 3 — Mode Pajak PB1 & Kas Float (Pajak & Shift Float)**:
  - PB1 Tax Mode: *Mode 0 (Off)*, *Mode 1 (Exclude 10%)*, *Mode 2 (Include 10%)*.
  - Opening Shift Float Amount (Default: Rp 500.000).
- **Launch Workstation**: Direct auto-routing to active cashier/barista workstation!

---

## 4. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-14-store-onboarding-wizard-getting-started.md`

---

## 5. Verification & Acceptance Criteria
- New merchant completes 3-step setup wizard in `< 120 seconds`.
- Completing setup auto-populates `HfeCompanyProfile`, `businessTypePolicy`, and `operationScalePolicy` without manual code editing.
- First transaction POST includes valid UUID v4 idempotency key and correct HCB GL account mappings.
