---
okf_version: "0.2"
type: Development Plan Level 2
title: Hfe POS Domain Separation between Cafe Operations and Event Ticketing
description: Enforces strict Domain-Driven Design (DDD) Bounded Context separation between real-time Cafe/Dining operations (Allergens, Waiter Calls, Bill Requests, Kitchen alerts) and Commercial Event Ticketing (Masterclasses, Workshops, Gate-In QR scanning).
tags: [development-plan, level-2, pos, domain-separation, ddd, notification-center, cafe-operations, event-ticketing]
parent_level_1: l1-pos-01-core-architecture-and-standards
github_issue: 77
status: In progress
---

# Hfe POS Domain Separation between Cafe Operations and Event Ticketing (L2-POS-77)

## Outcome

Enforces clear domain isolation between:
1. **Cafe Floor & Operational Service Center (`NotificationCenterDrawer.tsx`)**:
   - Dedicated 100% to real-time F&B floor service: Food Allergen Alerts (`⚠️`), Table Waiter Calls (`🛎️`), Physical Bill Printing Requests (`🧾`), and Shift Integrity.
   - Eliminates commercial ticket logs (`Penjualan Tiket`) and gate-in speed buttons from the dining alert feed, preventing cognitive overload and missed allergen alerts during rush hour.
2. **Event Ticketing & Gate-In Scanner Hub**:
   - Positioned as a dedicated secondary commerce tool (`Gate-In Ticket Scanner` & `Event Booking Hub`) accessible via Spotlight (`⌘K`) and App Launcher, strictly isolated from table waiter alerts.

## Scope

### Pillar A: Notification Center Domain Refactoring
- `src/components/notifications/NotificationCenterDrawer.tsx`:
  - Rename to **Pusat Alert Operasional Kafe** (Dining & Table Service Alert Hub).
  - Top action bar dedicated to **Panggilan Meja (Waiter Calls)** & **Alert Alergen Kritis**.
  - Category tabs focused on F&B service: `[Semua]`, `[⚠️ Alergen]`, `[🛎️ Meja & Dapur]`, `[💵 Shift Kasir]`, `[💬 Ulasan]`.

### Pillar B: Automated Verification & Unit Tests
- `src/tests/domainSeparationCafeAndTickets.test.ts`:
  - Asserts cafe operational notifications are isolated from ticket logs.
  - Asserts allergen and waiter call priorities are first-class citizens.

## Explicit Exclusions

- Modifying core database tables in `headless-company-books`.

## Authority References

- Architecture Standard: `docs/active/standards/POS-ENG-STD-001.md`
- Invariant Rule #12: Universal Cross-Scenario Abstraction & Generalization Invariant.
- Invariant Rule #20: The 4 Core Experience Pillars (POS, CARD, BOARD, ORDER).

## Verification

1. Local CI Gate: `./scripts/ci-local.sh` passes 100% with exit code `0`.
2. Multi-device browser screenshot verification of the refactored Notification Center.

## Stop Conditions

- Any hand-maintained file exceeding 500 lines.
- CI gate failure.
