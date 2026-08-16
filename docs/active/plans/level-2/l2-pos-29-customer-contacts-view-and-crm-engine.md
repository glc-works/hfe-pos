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
Delivers the Customer Contact Master & CRM module (`src/views/CustomerContactsView.tsx`, `src/components/contacts/`, `src/hooks/useCustomerContacts.ts`) supporting customer directory search, quick customer registration, contact detail management with Kasbon debt limit setting, allergen profiling, and zero-cost 1-tap WhatsApp Click-to-Chat alerting integrated with HCB Core REST APIs per [`POS-API-MAPPING.md`](file:///Users/aldi/claudefiles/hfe-pos/docs/active/standards/POS-API-MAPPING.md).

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
  - `"📱 Kirim Struk via WhatsApp"` button generating 1-tap direct `wa.me` Click-to-Chat URL (Zero-Cost WhatsApp integration).

### Phase C: Merchant Settings for Kasbon Policy (`src/views/CafeSettingsView.tsx` & `useMerchantConfig.ts`)
- Configurable Kasbon Over-Limit Policy in Merchant Settings:
  - `'strict_block'` — Cashier cannot proceed if transaction exceeds customer credit limit.
  - `'manager_override_pin'` — Cashier receives warning, allows Manager to unlock with 6-digit PIN.
  - `'allow_unlimited'` — Soft warning only, allows credit extension.

### Phase D: Customer Session State Hook (`src/hooks/useCustomerContacts.ts`)
- Implement `useCustomerContacts()` hook:
  - Manages contact list, active contact selection, search query filtering, Kasbon credit limit updates, and `generateWhatsAppReceiptUrl(contact, orderTicket)`.

### Phase E: Hfe REST API Transport Integration (`src/services/hfeCoreApi.ts`)
- Add API client endpoints:
  - `fetchContacts(bookId, search)` ➔ `GET /v1/company-books/{book}/contacts`
  - `createContact(bookId, payload)` ➔ `POST /v1/company-books/{book}/contacts`
  - `updateContact(bookId, contactId, payload)` ➔ `PUT /v1/company-books/{book}/contacts/{id}`

### Phase F: Vitest Unit Testing (`src/tests/customerContacts.test.ts`)
- Unit test coverage:
  - Verifies contact search filtering and allergen tags.
  - Verifies Kasbon limit calculation and Merchant Overlimit policy behavior.
  - Verifies WhatsApp Click-to-Chat URL generation format.

## 3. Explicit Exclusions
- Does not use paid third-party WhatsApp BSP / Cloud API; relies exclusively on standard client-side `wa.me` Click-to-Chat protocol.
- Operates strictly within Experience Layer UI components and REST API transport layer.

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All new files stay under 500 lines (`python3 scripts/check-modularity.py`).
- TypeScript typecheck passes clean (`npm run typecheck`).

