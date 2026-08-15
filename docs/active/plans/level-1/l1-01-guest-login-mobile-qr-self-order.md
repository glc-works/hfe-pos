---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Phone Login & Mobile QR Self-Ordering
description: Zero-install smartphone web app interface for table QR scanning, simple Phone Number login resolving to Hfe Contact Master, dynamic menu rendering from Hfe Product Master, and interactive drink/food modifier customization.
tags: [plan, level-1, pos, cafe, mobile-qr-order, phone-login, contact-master, product-master]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Phone Login & Mobile QR Self-Ordering

## 1. Domain Outcome
Delivers a zero-install customer smartphone web app loaded instantly via table QR scan (`hfe-pos.togrow.id/table/{id}`), capturing simple Phone/WhatsApp Number login resolved into `Hfe` Contact Master (`type: customer`), and rendering dynamic cafe menus fetched from `Hfe` Product Master API.

## 2. Capability Scope
- **Table QR Scanner & Session Resolution:** Resolves table number and cafe outlet ID from URL parameters.
- **Simple Phone Login Modal:** Captures customer Phone/WhatsApp number, resolving/creating a `Contact` record (`POST /v1/company-books/{book}/contacts`) with `type: customer`.
- **Dynamic Menu Renderer:** Fetches product catalog, photos, and categories from `Hfe` Product Master API (`GET /v1/company-books/{book}/products`).
- **Interactive Modifier Selector:** Drink/food modifier drawer (Ice/Hot, Sugar 0%/50%/100%, Dairy Options).
- **Real-Time Order Tracker:** Customer order progress tracker (Placed ➔ Brewing ➔ Ready).

## 3. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-01-mobile-qr-guest-login-cart.md`
