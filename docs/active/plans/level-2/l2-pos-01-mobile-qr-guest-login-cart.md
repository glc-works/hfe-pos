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
## 1. Outcome
Delivers a mobile-first customer web view (`src/views/CustomerMobileView.tsx`) enabling customers to scan table QR codes, select Guest Name or Phone/WhatsApp login, browse dynamic menus fetched from `Hfe` Product Master API, customize drink modifiers, and place orders.

## 2. Scope
- Deliver `src/views/CustomerMobileView.tsx` and associated sub-components:
  - Table & Seat QR resolver (`?table=MEJA-04&seat=Seat+1`).
  - Guest Login Modal component (`src/components/modals/LoginModal.tsx` with Phone & Guest Name modes).
  - Dynamic Menu Catalog component (`src/components/customer/MenuCatalog.tsx` fetching `/v1/company-books/{book}/products`).
  - Drink & Food Modifier Drawer (`src/components/modals/ModifierModal.tsx` for Ice/Hot, Sugar 0%/50%/100%, Dairy Options).
  - Live Order Status Tracker UI (`src/components/customer/OrderStatusTracker.tsx`).

## 3. Explicit Exclusions
- Does not store financial ledger postings locally; all completed orders submit payloads to `Hfe` REST APIs.

## 4. Verification Plan
- Mobile viewport test (iOS Safari & Android Chrome 360px-430px single-thumb ergonomics).
- Product Master API fetch test with mock data and REST fallback.

