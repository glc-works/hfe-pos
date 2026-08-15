---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Policy-Based Payment Checkout (Pay-First vs Open Tab)
description: Configurable payment policy workflow supporting Pay-First (pre-paid QRIS/VA) and Open Tab (post-paid table billing) checkouts with dynamic QRIS modals and Hfe subledger split posting.
tags: [plan, level-1, pos, cafe, pay-first, open-tab, qris, virtual-account, biller-split]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Policy-Based Payment Checkout

## 1. Domain Outcome
Delivers configurable payment policy workflows for cafe merchants, supporting immediate pre-paid checkouts (Pay-First via QRIS/VA) and post-paid table tabs (Open Tab), while automatically delegating double-entry subledger split postings to `Hfe`.

## 2. Capability Scope
- **Pay-First Policy Workflow:** Requires instant QRIS or Virtual Account settlement before order is sent to the Barista / Kitchen.
- **Open Tab Billing Policy Workflow:** Allows customers to append multiple round orders to their table tab, settling the accumulated bill upon departure (Pay via Phone or Cashier).
- **Dynamic QRIS & Payment Modals:** In-app ASPI QR code display with real-time payment completion webhook listener.
- **Hfe Subledger Split Delegation:** Triggers double-entry revenue postings and 20% platform / 80% merchant biller fee splits inside `Hfe`.

## 3. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-03-open-tab-qris-payment-modal.md`
