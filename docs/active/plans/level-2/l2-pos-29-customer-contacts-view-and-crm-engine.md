---
okf_version: "0.2"
type: Development Plan Level 2
title: Customer Contacts Management View, Contact Detail Modal, Kasbon Limit & WA Alerting Engine (L2-POS-29)
description: Implements Customer Contacts management view, customer directory search, quick registration modal, contact detail drawer with Kasbon credit limit setting, dietary allergen profiling, and WhatsApp direct alerting integrated with HCB REST APIs.
tags: [development-plan, level-2, contacts, crm, kasbon-limit, allergens, wa-alerting, hfe-pos]
parent_level_1: l1-24-customer-contact-master-and-crm-suite
github_issue: 29
status: Proposed
---

# Level 2 Implementation Plan: Customer Contacts Management View, Contact Detail Modal, Kasbon Limit & WA Alerting Engine

## 1. Outcome
Delivers the Customer Contact Master & CRM module (`src/views/CustomerContactsView.tsx`, `src/components/contacts/`, `src/hooks/useCustomerContacts.ts`) supporting customer directory search, quick customer registration, contact detail management with Kasbon debt limit setting, allergen profiling, and WhatsApp direct alerting integrated with HCB Core REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

## 2. Scope

### Phase A: Customer Contacts Management View (`src/views/CustomerContactsView.tsx`)
- Implement `CustomerContactsView.tsx`:
  - Contact Master Table with search by Name, WhatsApp Phone Number, or Loyalty Tier.
  - Filter Pills: `[ Semua Pelanggan ]` | `[ 👑 Tier VIP ]` | `[ 💳 Pemegang Kasbon ]` | `[ ⚠️ Punya Alergi ]`.
  - Action Toolbar: `"➕ Tambah Kontak Baru"` button opening `CreateContactModal.tsx`.

### Phase B: Customer Registration & Detail Modals (`src/components/contacts/`)
- `CreateContactModal.tsx` — Form for registering a new customer (Name, WhatsApp Phone, Email, Birthday).
- `ContactDetailModal.tsx` — Modal displaying customer full profile:
  - Loyalty Tier badge & active point balance (`450p`).
  - Kasbon credit limit setting (`Kasbon Limit: Rp 1.000.000`) & current debt balance.
  - Dietary Allergen Flags (`Lactose`, `Nuts`, `Gluten`, `Seafood`).
  - Concierge Notes (*"Prefers window seat, Anniversary July 24"*).
  - `"📞 WhatsApp Direct Alert"` button to send digital receipt or promo links directly to customer's WA.

### Phase C: Customer Session State Hook (`src/hooks/useCustomerContacts.ts`)
- Implement `useCustomerContacts()` hook:
  - Manages contact list, active contact selection, search query filtering, and Kasbon credit limit updates.

### Phase D: Hfe REST API Transport Integration (`src/services/hfeCoreApi.ts`)
- Add API client endpoints:
  - `fetchContacts(bookId, search)` ➔ `GET /v1/company-books/{book}/contacts`
  - `createContact(bookId, payload)` ➔ `POST /v1/company-books/{book}/contacts`
  - `updateContact(bookId, contactId, payload)` ➔ `PUT /v1/company-books/{book}/contacts/{id}`

### Phase E: Vitest Unit Testing (`src/tests/customerContacts.test.ts`)
- Unit test coverage:
  - Verifies contact search filtering.
  - Verifies Kasbon limit updates and allergen flag binding.

## 3. Explicit Exclusions
- Does not modify HCB server-side tenant security models; operates strictly within Experience Layer UI components and REST API transport layer.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files stay under 300 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).
