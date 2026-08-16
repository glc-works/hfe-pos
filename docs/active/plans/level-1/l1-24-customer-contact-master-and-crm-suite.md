---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Customer Contact Master & CRM Suite (Contact Directory, Kasbon Credit Limit, Allergen Flags & WA Alerting)
description: Strategic plan for managing customer contact master records, customer CRM directory, WhatsApp phone binding, loyalty points balance, Kasbon debt credit limits, dietary allergen warnings, and 1-tap WhatsApp alerts via HCB REST APIs.
tags: [plan, level-1, pos, contacts, crm, kasbon-limit, allergens, wa-alerting]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Customer Contact Master & CRM Suite

## 1. Domain Outcome
Delivers the **Customer Contact Master & CRM Suite** for `hfe-pos` (`glc-works/hfe-pos`).

Empowers store cashiers, waiters, and managers to manage customer contact records (`CustomerContactsView.tsx`, `ContactDetailModal.tsx`), search customers by name or phone, assign loyalty tiers and point balances, set Kasbon debt credit limits, log dietary allergen flags (`Lactose`, `Nuts`, `Gluten`), and dispatch 1-tap WhatsApp notifications resolved through HCB Core REST APIs (`/v1/contacts`).

---

## 2. Capability Scope

```
 👤 CUSTOMER CONTACT MASTER & CRM LIFECYCLE
 ├─ 🔍 1. Customer Contact Master Directory (`CustomerContactsView.tsx` with name/phone search)
 ├─ ➕ 2. New Customer Registration Modal (`CreateContactModal.tsx` for quick cashier input)
 ├─ 💳 3. Kasbon Credit Limit & Debt Balance Management (Kasbon limit setting & settlement history)
 ├─ ⚠️ 4. Dietary Allergen & Preferences Profiling (Allergen flags + concierge preference notes)
 └─ 📱 5. 1-Tap WhatsApp Alerting & Digital Folio Dispatch (Direct WhatsApp contact trigger)
```

### Pillar A: Contact Master Directory & Registration
1. **Customer Contacts Management Screen (`CustomerContactsView.tsx`)**:
   - Master Contact Table displaying customer photo/avatar, full name, phone number, active loyalty tier badge, and points balance.
   - Quick Filter Tabs: `[ Semua Pelanggan ]` | `[ 👑 Tier VIP ]` | `[ 💳 Pemegang Kasbon ]` | `[ ⚠️ Punya Alergi ]`.
2. **Quick Customer Registration Modal (`CreateContactModal.tsx`)**:
   - Cashier form to quickly register a new walk-in customer's name, WhatsApp phone number, and optional birthday date.

### Pillar B: Contact Profile Detail, Kasbon Limit & WA Alerting
1. **Contact Profile Detail Modal (`ContactDetailModal.tsx`)**:
   - View and edit customer profile fields, loyalty points, approved Kasbon debt limit, allergen flags, and concierge preference notes (*"Prefers window seat, Anniversary July 24"*).
2. **WhatsApp Direct Integration**:
   - 1-tap button to dispatch digital receipts or promotional vouchers directly to customer's WhatsApp.

---

## 3. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-29-customer-contacts-view-and-crm-engine.md`

---

## 4. Verification & Acceptance Criteria
- Registering a new customer updates the contact directory and returns a valid HCB Contact UUID.
- Setting Kasbon credit limit is enforced at checkout when Kasbon payment method is selected.
- Allergen flags trigger visual warnings when customer's contact profile is bound to a table order.
