---
okf_version: "0.2"
type: Development Plan Level 2
title: Kitchen Display System (KDS) & Thermal Ticket Printer
description: Real-time Kitchen Display System (KDS) web interface showing live drink/food preparation chits with ESC/POS thermal printer integration.
tags: [development-plan, level-2, kds, kitchen-display, thermal-printer]
parent_level_1: l1-04-kitchen-ticket-barista-display
github_issue: 4
status: Proposed
---

# Level 2 Implementation Plan: Kitchen Display System (KDS) & Thermal Ticket Printer

## 1. Outcome
Delivers a Kitchen Display System screen (`src/kds/`) and ESC/POS thermal printing module for baristas and kitchen staff.

## 2. Scope
- Create `src/kds/index.html` & `src/kds/kds.js`:
  - KDS Order Card Queue with color-coded preparation timers (Green < 5m, Yellow < 10m, Red > 10m).
  - Status Bump Buttons (`Brewing` ➔ `Ready`).
  - ESC/POS Web USB / Raw Network Thermal Receipt Printer Helper.

## 3. Verification Plan
- KDS ticket render & bump state test.
