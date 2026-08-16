# Hfe POS & Commerce Suite (`hfe-pos`)

> **Experience Layer for Headless Company Books (HCB)**  
> Responsive, Offline-First Point of Sale (POS) Cashier Interface, Barista Touch Station, Kitchen Display System (KDS), and Customer Smartphone QR Table Self-Ordering Web App.  
> 📱 **Core Principle:** *Mobile Viewport First (360-430px) • Tablet Experience Second (768-1024px) • Touch Ergonomics (<30ms) & 60fps Performance Priority.*

---

## 🌟 Overview & Architecture Mental Model

`hfe-pos` is the dedicated **Cafe & F&B Experience Layer** within the `Hfe` ecosystem (`glc-works/hfe-pos`). It connects strictly via **`Hfe` Core REST APIs** (`/v1/company-books/...`) and is completely agnostic to backend database engines, Rust financial kernels, or internal subledgers.

```
                   ┌─────────────────────────────────────────────────────────┐
                   │               Hfe Cafe POS Experience Layer             │
                   │          (MOBILE VIEWPORT FIRST • 60FPS TOUCH)           │
                   └───────────────┬─────────────────────────┬───────────────┘
                                   │                         │
             ┌─────────────────────┴──────────┐   ┌──────────┴──────────────────────┐
             │ Customer Smartphone QR Order   │   │ Barista Touch POS & KDS Kanban  │
             │ (Phone Login / Pure Guest)     │   │ (Table Floor Plan & BOM Recipe) │
             └─────────────────────┬──────────┘   └──────────┬──────────────────────┘
                                   │                         │
                                   └────────────┬────────────┘
                                                │ (100% REST API + UUID Idempotency Key)
                                                ▼
                               ┌──────────────────────────────────┐
                               │  Hfe Core REST API Transport     │
                               │  (Contacts, Products, Subledger) │
                               └──────────────────────────────────┘
```

---

## 📱 Core Strategic Pillars

1. **Customer Mobile QR Self-Ordering (`L1-01`)**: Zero app installation, dual Customer Entry Modes (Phone/WhatsApp Login vs Pure Guest Mode), dynamic menu fetch.
2. **Barista & Cashier Touch POS Station (`L1-02`)**: Visual Table Floor Plan Grid (Table 1-20 status), quick walk-in catalog grid, shift float reconciliation.
3. **Policy-Based Payment Checkout (`L1-03`)**: Enforces Pay-First QRIS vs Open Tab policies, mandatory `X-Idempotency-Key` (UUID v4) on every checkout POST.
4. **Kitchen Display System (KDS) & Thermal Printer (`L1-04`)**: Kitchen KDS Kanban view with preparation timers (Green/Yellow/Red), BOM SOP drawers, ESC/POS printer.
5. **Universal Loyalty & Voucher Wallet Engine (`L1-05`)**: Loyalty tiers (Bronze-Platinum), point multipliers, promo vouchers (`VOUCHER-BIRTHDAY`).
6. **Offline-First Resilience Buffer (`L1-06`)**: Client-side IndexedDB buffer, Web Crypto SHA-256 integrity checksums, exponential backoff retry manager.
7. **Customer Allergen Filter & Merchant Tiering (`L1-09`)**: Logged-in customer allergen flags (Lactose, Nuts, Gluten) with Greyout vs Hide display toggle.
8. **Toko Kelontong & General Retail Suite (`L1-10`)**: Barcode hardware scanner POS (`Ctrl+B`), customer Mobile Scan & Go, multi-UOM price conversions (Pcs ➔ Karton), Kasbon credit ledger.
9. **Fine Dining Gastronomy Suite (`L1-11`)**: Synchronized Course Firing KDS (`Fire Appetizer`, `Fire Main`), Sommelier wine cellar list, Maître d' VIP concierge history.
10. **Store Onboarding & Getting Started Wizard (`L1-12`)**: 3-step setup wizard (< 2 minutes) auto-populating HCB background policies under a clean Getting Started interface.
11. **Team Membership & Staff RBAC Engine (`L1-13`)**: Team invitation modal, staff active roster, 6-digit Employee PIN binding keypad, RBAC surface guards (Owner, Cashier, Barista, Chef, Waiter, QC).
12. **End-to-End Operational Workflows (`L1-14`)**: Cashier shift float reconciliation, Manager PIN authorized voids & refunds, physical stocktake audits.
13. **Self-Delivery & Local Store Courier Engine (`L1-15`)**: Zero-commission local store self-delivery by internal runners, delivery fee math, pluggable 3PL courier provider adapters (GoSend, Grab, Lalamove), WA delivery tracking.
14. **Unified Resi & Thermal/Digital Receipt Engine (`L1-16`)**: Unique AWB Resi code generator, QR package label sticker printer, ESC/POS thermal printer driver (58mm/80mm), digital WA receipt PDF.
15. **Hfe POS Auth SDK Starterkit Package (`L1-17`)**: Exportable `@hfe/pos-auth-starterkit` React package providing plug-and-play `<PosAuthProvider>`, `<PosAuthLoginScreen>`, 6-digit Employee PIN keypad, and WA Verification Rp 0 button for fast app creation (< 5 mins).
16. **Multi-Warehouse Operations Suite (`L1-18`)**: Dedicated Warehouse Operations view (`WarehouseManagementView.tsx`), supplier goods receiving, internal stock transfers, waste/spoilage logging, barcode audit.
17. **Multi-Branch Outlet Management Suite (`L1-19`)**: Active branch workspace switcher (`BranchSwitcherDropdown.tsx`), multi-outlet sales overview dashboard, branch-specific operating hours/WiFi configs, inter-branch stock transfers.

---

## 🗺️ Master Plan & Implementation Directory

| L1 Strategic Plan | L2 Implementation Ticket | Domain Scope & Deliverables | Status |
|---|---|---|---|
| **`L1-01`** | `L2-POS-01` | Customer Mobile QR Ordering & Phone/Guest Entry Mode | Extracted (`CustomerMobileView.tsx`) |
| **`L1-02`** | `L2-POS-02` | Barista Touch POS Station & Table Floor Plan Grid | Extracted (`BaristaPosView.tsx`) |
| **`L1-03`** | `L2-POS-03` | Policy-Based Payment Checkout (Pay-First vs Open Tab) | Extracted (`QrisModal.tsx`) |
| **`L1-04`** | `L2-POS-04` | Kitchen KDS Kanban View & Thermal Printer | Extracted (`KdsKanbanView.tsx`) |
| — | `L2-POS-05` | App Monolith Decomposing & Vitest Setup | ✅ PASSED (`10/10` Tests) |
| — | `L2-POS-06` | Modularity & Connector Tooling Guard Scripts | ✅ PASSED (`ci-local.sh`) |
| **`L1-05`** | `L2-POS-07` | Universal Loyalty Tiers & Voucher Wallet Engine | ✅ PASSED (`useLoyalty.ts`) |
| **`L1-06`** | `L2-POS-08` | Offline-First IndexedDB Resilience Buffer & Hasher | ✅ PASSED (`offlineStorage.ts`) |
| **`L1-09`** | `L2-POS-11` | Logged-in Customer Allergen Filter & toGrow History | ✅ PASSED (`lactose`, `nuts`) |
| **`L1-10`** | `L2-POS-12` | Toko Kelontong Barcode Cashier, Scan & Go, Kasbon | Proposed (`RetailPosView.tsx`) |
| **`L1-11`** | `L2-POS-13` | Fine Dining Course Firing, Sommelier Cellar, Maître d' | Proposed (`FineDiningKdsView.tsx`) |
| **`L1-12`** | `L2-POS-14` | 3-Step Store Onboarding Setup Wizard & Checklist | ✅ PASSED (`StoreOnboardingWizard`) |
| **`L1-13`** | `L2-POS-15` | Team Membership, Staff RBAC & 6-Digit PIN Binding | ✅ PASSED (`TeamRosterSection`) |
| — | `L2-POS-16` | Standalone Simple POS Auth Login Screen (4-Tab) | ✅ PASSED (`PosAuthLoginView.tsx`) |
| **`L1-14`** | `L2-POS-17` | Cashier Shift Reconcile, Manager Void & Stocktake | Proposed (`ShiftDrawerModal.tsx`) |
| **`L1-15`** | `L2-POS-18` | Self-Delivery Local Courier Dispatch & 3PL Adapter | Proposed (`DeliveryDispatchModal`) |
| **`L1-16`** | `L2-POS-19` | AWB Resi Tracking, QR Label & Thermal Receipt | Proposed (`ResiTrackingView.tsx`) |
| **`L1-17`** | `L2-POS-20` | Exportable `@hfe/pos-auth-starterkit` SDK Package | Proposed (`src/sdk/auth/`) |
| **`L1-18`** | `L2-POS-21` | Dedicated Warehouse View, Goods Receiving, Spoilage | Proposed (`WarehouseManagementView`) |
| **`L1-19`** | `L2-POS-22` | Multi-Branch Outlet Dashboard & Branch Switcher | Proposed (`BranchManagementView.tsx`) |
| **`L1-20`** | `L2-POS-23` | Eco-Impact Dashboard & Tip Distribution Engine | Proposed (`EcoImpactDashboardWidget`) |
| **`L1-21`** | `L2-POS-25` | Station Printer Router, GS1 Scale Barcode & Consignment | Proposed (`printerRouter.ts`) |
| **`L1-22`** | `L2-POS-27` | Hfe POS Real-Time Insights & 17-Point UX Purification | Proposed (`HfeInsightWidget.tsx`) |

---

## 📐 Engineering Standards & Modularity Guard

`hfe-pos` adheres strictly to:
| Standard Document | Purpose |
|---|---|
| [`POS-ENG-STD-001.md`](docs/active/standards/POS-ENG-STD-001.md) | Highest technical contract & 500-line modularity rule |
| [`POS-WORKFLOW-STD.md`](docs/active/standards/POS-WORKFLOW-STD.md) | Mandatory User Review & Interactive Development Loop Protocol |
| [`POS-BUSINESS-PROOFS-REF.md`](docs/active/standards/POS-BUSINESS-PROOFS-REF.md) | Authoritative Business Test Scenarios & Operational Proof Matrix (SCN-01 to SCN-09) |
| [`POS-ACTORS-REF.md`](docs/active/standards/POS-ACTORS-REF.md) | Authoritative POS 13 Operational Actors & RBAC Matrix |

- **Connector Integrity**: `connector.manifest.json` must validate clean against HCB schema (`scripts/validate-connector.py`).
- **Local CI Gate**: Run `./scripts/ci-local.sh` before merging.

---

## 🚀 Getting Started & Local Development

### Prerequisites
- Node.js `v18+` or `v22+`
- npm `v9+`

### Installation & Commands

```bash
# Install dependencies
npm install

# Run local development server (Vite)
npm run dev

# Run Storybook component explorer (Port 6006)
npm run storybook

# Run Typecheck
npm run typecheck

# Run Modularity & Connector Guards
python3 scripts/check-modularity.py
python3 scripts/validate-connector.py

# Run Local CI Pipeline
./scripts/ci-local.sh

# Build production bundle
npm run build
```

---

## 📁 Repository Structure

```
hfe-pos/
├── docs/
│   └── active/
│       ├── plans/            # Level 0, 1, and 2 Strategic & Development Plans
│       │   ├── level-0/
│       │   ├── level-1/
│       │   ├── level-2/
│       │   └── templates/    # OKF 0.2 Plan Templates
│       └── standards/        # Technical Engineering Standards (POS-ENG-STD-001.md)
├── scripts/                  # Guard Scripts (modularity, connector schema, ci-local)
├── src/
│   ├── components/           # Reusable UI primitives, modals, and landing components
│   ├── views/                # Domain views (Landing, CustomerMobile, BaristaPOS, KDS)
│   ├── services/             # Hfe REST API Client Layer (hfeApi.ts)
│   ├── hooks/                # Custom React Hooks (useCart, useTableState)
│   └── tests/                # Vitest Unit Tests (cartMath.test.ts)
├── connector.manifest.json   # HCB Connector Manifest Specification
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 📜 License & Governance
Governed under **GLC-Works Headless Company Books Ecosystem**. All rights reserved.
