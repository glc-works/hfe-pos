---
okf_version: "0.2"
type: Strategic Plan Level 1
title: POS 2026 Next-Gen Capabilities Suite (Deterministic Smart Upsell, Pay-at-Table Tip Slider, Self-Kiosk Mode, Staff Timeclock & Multi-Currency)
description: Strategic plan for elevating hfe-pos to POS 2026 global industry standards, featuring deterministic rule-based smart upsell (AI-Ready, zero 1st-party API key cost), optional contactless QR Pay-at-Table folio with tip slider, self-service ordering kiosk mode, staff timeclock attendance, and multi-currency tourist pay via HCB REST APIs.
tags: [plan, level-1, pos, pos-2026, deterministic-upsell, pay-at-table, self-kiosk, timeclock, multi-currency]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: POS 2026 Next-Gen Capabilities Suite

## 1. Domain Outcome
Delivers the **POS 2026 Next-Gen Capabilities Suite** for `hfe-pos` (`glc-works/hfe-pos`), bringing the platform to global 2026 state-of-the-art industry standards (Toast 2026, Square 2026, Clover 2026).

Equips store operators with 5 cutting-edge POS 2026 features:
- 💡 **Deterministic Smart Upsell & Dynamic Pairing (AI-Ready, $0 API Key Spend)**: Uses HCB transaction co-occurrence frequency matrices and rule-based pairing logic. No 1st-party LLM API key spending; AI-Ready schema interface for optional merchant BYO-Key.
- 📲 **Optional Contactless Pay-at-Table Folio with Tip Slider**: Guest scans table QR, reviews itemized bill, drags digital tip slider (10%/15%/20%), pays via QRIS/Cards, and walks out cleanly.
- 🏪 **Self-Service Kiosk Workstation Mode (`/kiosk`)**: Touchscreen kiosk mode for walk-in self-ordering and queue number ticket generation (`A-042`).
- ⏱️ **Staff Timeclock & Shift Attendance Engine**: PIN/Selfie clock-in & clock-out for automated payroll & tip distribution calculations.
- 🌐 **Multi-Currency Tourist Pay & DCC**: Real-time currency display and Dynamic Currency Conversion (IDR, USD, SGD, AUD) resolved through HCB Core REST APIs (`/v1/pos/2026`).

---

## 2. Capability Scope

```
 🚀 POS 2026 STATE-OF-THE-ART CAPABILITIES
 ├─ 💡 1. Deterministic Smart Upsell Engine (`DeterministicUpsellModal.tsx`, AI-Ready, $0 API Cost)
 ├─ 📲 2. Optional Contactless Pay-at-Table Folio with Digital Tip Slider (`PayAtTableQrView.tsx`)
 ├─ 🏪 3. Self-Service Kiosk Workstation Mode (`KioskSelfServiceView.tsx` / `/kiosk`)
 ├─ ⏱️ 4. Staff Timeclock & Attendance Check-In (`StaffTimeclockModal.tsx`)
 └─ 🌐 5. Multi-Currency Tourist Pay & DCC Converter (`MultiCurrencyPayModal.tsx`)
```

---

## 3. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-28-ai-upsell-kiosk-pay-at-table-timeclock-engine.md`

---

## 4. Verification Criteria
- Deterministic upsell modal evaluates cart items using co-occurrence transaction matrices without external AI API key calls.
- Pay-at-Table folio calculates custom tip slider additions accurately.
- Self-Service Kiosk mode generates sequential queue tickets (`A-042`).
- Staff Timeclock logs clock-in/clock-out timestamps cleanly.
- Multi-Currency converter transforms IDR values to USD, SGD, and AUD using live HCB exchange rates.
