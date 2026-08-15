---
okf_version: "0.2"
type: Development Plan Level 2
title: Policy-Based Payment Checkout & QRIS Modal
description: Client-side checkout modal enforcing Pay-First (pre-paid QRIS) vs Open Tab (post-paid table bill) payment policies with real-time payment completion webhook triggers.
tags: [development-plan, level-2, pay-first, open-tab, qris, biller-split]
parent_level_1: l1-03-policy-based-payment-checkout
github_issue: 3
status: Proposed
---

# Level 2 Implementation Plan: Policy-Based Payment Checkout & QRIS Modal

## 1. Outcome
## 1. Outcome
Delivers the payment checkout modal component (`src/components/modals/QrisModal.tsx`) supporting Pay-First (pre-paid QRIS/VA) and Open Tab (post-paid table bill) checkout flows with dynamic ASPI QR code rendering.

## 2. Scope
- Deliver `src/components/modals/QrisModal.tsx` and payment evaluation logic:
  - Policy Evaluator (`Pay-First` vs `Open Tab`).
  - Dynamic QRIS Display Modal with real-time payment polling/webhook listener.
  - Open Tab Settlement Summary Screen with Tax (PB1) and Service Fee breakdowns.

## 3. Verification Plan
- QRIS modal display & payment status transition test.

