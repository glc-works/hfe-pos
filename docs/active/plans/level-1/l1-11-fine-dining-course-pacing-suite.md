---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Fine Dining Suite (Course Pacing Firing, Sommelier Pairing & Maître d' Concierge)
description: Experience Layer expansion for Fine Dining & High-End Gastronomy, delivering course-by-course kitchen firing (Amuse-Bouche to Dessert), Sommelier wine pairing cellar tracking, Maître d' VIP seating allocation, and high-touch guest history via HCB REST APIs.
tags: [plan, level-1, pos, fine-dining, course-firing, sommelier, maitre-d, vip-guest]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Fine Dining Suite

## 1. Domain Outcome
Expands the **Hfe POS & Commerce Suite** (`glc-works/hfe-pos`) to support **Fine Dining Restaurants, Tasting Menu Establishments, and High-End Gastronomy** alongside Cafe F&B and Retail.

Delivers course-by-course kitchen pacing (`Fire Course N` commands for 3/5/7/9-course tasting menus), Sommelier wine pairing cellar integration, Maître d' (Head Host) VIP seating management, and high-touch guest history preferences resolved through HCB Core REST APIs (`/v1/courses`, `/v1/cellar`, `/v1/vip-guests`).

---

## 2. Capability Scope

### Pillar A: Customer / Guest User Journey (Fine Dining)

```
 [1. Reservation & DP Hold] ──► [2. VIP Maître d' Greeting] ──► [3. Sommelier Wine Pairing]
  - Pre-Selected Tasting Menu    - VIP History Alert           - Pairing Recommendation
  - High DP / Pre-Auth Guarantee - Preferred Seating (Booth)    - Cellar Vintage Selection
                                                                       │
                                                                       ▼
 [6. Discreet Settlement] ◄──── [5. High-Touch Service] ◄────── [4. Course-by-Course Facing]
  - Itemized / Combined Bill     - Table Clearing Notes         - Course 1: Amuse-Bouche
  - Corporate Invoice Option     - Digestif / Cigar Menu        - Course 3: Fire Main Course
```

1. **Mandatory Reservation & DP Pre-Auth**:
   - Guest reserves table weeks in advance, selects 5-course or 7-course Tasting Menu, and pays high Down Payment / Pre-Auth Guarantee via QRIS/VA.
2. **VIP Maître d' Concierge Greeting**:
   - Upon arrival, Maître d' receives instant VIP history alert (e.g. *"Bpk. Aldi - Visit #12 - Celebrating 10th Anniversary - Prefers Quiet Corner Booth & Pinot Noir"*).
3. **Sommelier Pairing Selection**:
   - Digital Wine List drawer with vintage ratings, tasting notes, and Sommelier pairing recommendations per course.
4. **Course-by-Course Pacing Experience**:
   - Dishes served in strict, synchronized sequence. Guest never feels rushed or delayed.
5. **Discreet Table Settlement**:
   - Bill presented in luxury leather folio. Supports discreet QRIS/Card payment or Corporate Invoicing.

---

### Pillar B: Restaurant Operational User Journey (Fine Dining - 5 Operational Roles)

```
 🍷 FINE DINING OPERATIONAL SUITE
 ├─ 🎩 Maître d' / Head Host (Table Allocation, VIP Guest History, Anniversary Alerts)
 ├─ 🍷 Sommelier (Wine List Management, Cellar Bottle Retrieval, Pouring Tracking)
 ├─ 👨‍🍳 Executive Chef / Sous Chef (Expediter KDS, Course Firing Controls: Fire Appetizer, Fire Main)
 ├─ 🤵 Captain / Station Waiter (High-Touch Table Service, Course Timing Notes, Crumb Removal Trigger)
 └─ 💵 Reception / Finance (Discreet Billing, Corporate Invoice Processing, Deposit Deductions)
```

1. **Maître d' Concierge Surface (`MaitreDView.tsx`)**:
   - Floor plan grid with VIP status badges, seating time allocations, and special anniversary/dietary notes.
2. **Executive Chef Expediter KDS (`FineDiningKdsView.tsx`)**:
   - Course Firing Kanban matrix. Displays table status by course (`Course 1: Served` ➔ `Course 2: Fired` ➔ `Course 3: Pending`).
   - "Fire Course" button triggered by Captain Waiter when table finishes previous course.
3. **Sommelier Cellar Integration (`SommelierView.tsx`)**:
   - Cellar bottle inventory tracking (`GET /v1/cellar/bottles`), decanting timers, and glass/bottle pour logs.

---

## 3. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-13-course-firing-sommelier-maitre-d-engine.md`

---

## 4. Verification & Acceptance Criteria
- Triggering "Fire Main Course" command updates kitchen KDS ticket status in `< 100ms`.
- Sommelier wine bottle deduction updates Cellar subledger (`/v1/cellar`).
- Maître d' guest lookup displays anniversary history and dietary restrictions accurately.
