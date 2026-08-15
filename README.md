# Hfe POS & Commerce Suite (`hfe-pos`)

> **Experience Layer for Headless Company Books (HCB)**  
> Responsive, Offline-First Point of Sale (POS) Cashier Interface, Barista Touch Station, Kitchen Display System (KDS), and Customer Smartphone QR Table Self-Ordering Web App.

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

1. **Customer Mobile QR Self-Ordering (`L1-01`)**:
   - Zero app installation required.
   - Dual Customer Entry Modes: **Phone/WhatsApp Login (Loyalty & Voucher Wallet)** OR **Pure Guest Mode (Name Only)**.
   - Dynamic product menu fetch from `Hfe` Product Master API (`GET /v1/company-books/{book}/products`).
   - Drink/food modifier customization (Ice/Hot, Sugar 0%/50%/100%, Dairy Options).
2. **Barista & Cashier Touch POS Station (`L1-02`)**:
   - Visual Table Floor Plan Grid (Table 1-20 status: Free, Occupied, Open Tab).
   - Quick walk-in catalog grid for rapid barista entry.
   - Cashier Shift Drawer Float opening/closing count reconciliations (`1010-Cash Drawer`).
3. **Policy-Based Payment Checkout (`L1-03`)**:
   - Enforces **Pay-First** (pre-paid QRIS/VA) vs **Open Tab** (post-paid table bill) checkout policies.
   - Real-time ASPI QRIS modal with payment status webhook listener.
   - Mandatory `X-Idempotency-Key` (UUID v4) on every checkout POST (`POST /v1/company-books/{book}/transactions`).
4. **Kitchen Display System (KDS) & Thermal Printer (`L1-04`)**:
   - Kitchen KDS Kanban, List, and Work Order views with preparation timers (Green < 5m, Yellow < 10m, Red > 10m).
   - Interactive recipe Bill of Materials (BOM) & step-by-step SOP preparation drawers.
   - Web USB / Network ESC/POS thermal chit printer helper.

---

## 📐 Engineering Standards & Modularity Guard

`hfe-pos` adheres strictly to **`POS-ENG-STD-001`**:
- **Modularity Review Trigger**: No hand-maintained `.ts` or `.tsx` file in `src/` may exceed **500 lines of code** (`scripts/check-modularity.py`).
- **Connector Integrity**: `connector.manifest.json` must validate clean against HCB schema (`scripts/validate-connector.py`).
- **Idempotency**: All monetary transactions submit a unique client UUID v4 idempotency key.
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
