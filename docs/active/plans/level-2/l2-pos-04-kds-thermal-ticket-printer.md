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
## 1. Outcome
Delivers a Kitchen Display System view (`src/views/KdsKanbanView.tsx`) and ESC/POS thermal printing module for baristas and kitchen staff.

## 2. Scope
- Deliver `src/views/KdsKanbanView.tsx` and associated sub-components:
  - KDS Order Card Queue with Kanban, List, and Work Order modes (`src/components/kds/KdsKanbanGrid.tsx`).
  - Color-coded preparation timers (Green < 5m, Yellow < 10m, Red > 10m).
  - Status Bump Buttons (`Brewing` ➔ `Ready` ➔ `QC Passed` ➔ `Served`).
  - Recipe BOM & SOP Drawer modal (`src/components/modals/RecipeBomModal.tsx`).
  - ESC/POS Web USB / Raw Network Thermal Receipt Printer Helper (`src/services/thermalPrinter.ts`).

## 3. Verification Plan
- KDS ticket render & bump state test.
- Recipe BOM modal drawer interaction test.

