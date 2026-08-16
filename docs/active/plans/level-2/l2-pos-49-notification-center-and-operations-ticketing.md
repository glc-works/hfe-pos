---
okf_version: "0.2"
type: Development Plan Level 2
title: Omnichannel Notification Center & Operations Service Ticketing Hub (L2-POS-49)
description: Implements a unified Notification Center and Service Request Ticketing Engine in Hfe POS, enabling realtime operational chits, waiter call routing, allergen safety alerts, ticket check-in gates, and financial shift notifications.
tags: [development-plan, level-2, notification-center, service-tickets, waiter-call, alerts, hfe-pos]
parent_level_1: l1-23-pos-2026-next-gen-capabilities-suite
github_issue: 49
status: Implemented
---

# Level 2 Implementation Plan: Omnichannel Notification Center & Operations Service Ticketing Hub (L2-POS-49)

## 1. Outcome & User Experience Vision
Provides a centralized **Omnichannel Notification Center (`NotificationCenterDrawer.tsx`)** and **Service Request Ticketing Engine (`ServiceTicketingModal.tsx`)** across POS workstations, Kitchen KDS, and Backoffice:

### Key Capabilities:
1. 🔔 **Unified Notification Center (Bell Icon Tray):**
   - Real-time badge counter: `[ 🔔 3 ]`.
   - Categorized Tabs:
     - 🚨 **Semua (All)**
     - 🍳 **Operasional & Meja (Orders & Table Chits)**: Waiter calls, bills requested, table transfers.
     - 🎟️ **Event & Tiketing (Ticket Sales & Check-Ins)**: Ticket purchases, gate check-in alerts.
     - 💬 **Feedback & Ulasan (Customer Reviews)**: Star ratings and private feedback to manager.
     - ⚠️ **Keselamatan Alergen (Allergen Warnings)**: High-priority kitchen safety flags.
     - 💰 **Keuangan & Shift (Cash & Ledger Alerts)**: Shift closure variances, PB1 tax summaries.
2. 🎟️ **Service Request & Waiter Call Ticketing:**
   - Waiter call chits generated from Customer QR / Table (`Minta Bill`, `Minta Refill Air`, `Panggil Waiter`).
   - 1-Tap "Tandai Selesai / Resolve Ticket".
3. 📱 **Event Ticket Gate-In Scanner & Validation:**
   - Staff scanner tool to scan attendee QR codes and update ticket status to `USED / CHECKED_IN`.

---

## 2. Component Structure

```
src/
├── types/
│   └── pos.ts                                # [MODIFY] Add HfeNotification, ServiceTicket, NotificationCategory
├── components/
│   ├── notifications/                        # [NEW DIRECTORY]
│   │   ├── NotificationCenterDrawer.tsx       # Omnichannel notification tray (< 250 lines)
│   │   ├── ServiceTicketingDrawer.tsx         # Waiter call & service chits (< 200 lines)
│   │   └── EventTicketCheckInModal.tsx        # Event entrance gate-in QR validator (< 200 lines)
├── context/
│   └── NotificationContext.tsx                # Realtime alerts store & audio ping (< 200 lines)
└── tests/
    └── notificationCenterAndTicketing.test.ts # Unit tests for alerts & ticket resolution
```

---

## 3. Verification Plan
- Unit tests validating notification dispatch, unread count badge, category filtering, and service ticket resolution.
- Modularity check (< 500 lines per file).
- Production build clean in CI Gate.
