---
okf_version: "0.2"
type: Development Plan Level 2
title: Mobile QR Guest Login & Cafe Cart Web App
description: Bounded customer smartphone web app implementing table QR resolution, quick guest login (Name & WhatsApp), dynamic product master menu fetching, and drink modifier drawers.
tags: [development-plan, level-2, mobile-qr, guest-login, cart, cafe-menu]
parent_level_1: l1-01-guest-login-mobile-qr-self-order
github_issue: 1
status: Proposed
---

# Level 2 Implementation Plan: Mobile QR Guest Login & Cafe Cart Web App

## 1. Outcome
Delivers a mobile-first web app (`src/mobile/`) enabling customers to scan table QR codes, enter Guest Name & WhatsApp, browse dynamic menus fetched from `Hfe` Product Master API, customize drink modifiers, and place orders.

## 2. Scope
- Create `src/mobile/index.html` & `src/mobile/app.js`:
  - Table QR resolver (`?table=MEJA-04&outlet=CAFE-BDG`).
  - Guest Login Modal (Name & WhatsApp input with local session token storage).
  - Dynamic Menu Component (fetches `/v1/company-books/{book}/products`).
  - Drink Modifier Drawer (Ice/Hot, Sugar 0%/50%/100%, Dairy Options).
  - Live Order Status Tracker UI.

## 3. Explicit Exclusions
- Does not store financial ledger postings locally; all completed orders submit payloads to `Hfe` REST APIs.

## 4. Verification Plan
- Mobile viewport test (iOS Safari & Android Chrome < 1s load).
- Product Master API fetch test with mock data.
