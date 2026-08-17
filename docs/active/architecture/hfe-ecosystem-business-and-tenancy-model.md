# HFE Ecosystem: Business Model, Product Topology & Multi-Tenancy Architecture

**Document ID:** `GLC-ARCH-TENANCY-001`  
**Status:** Approved Technical & Commercial Standard  
**Effective Date:** 2026-08-17  
**Corporate Entity:** PT HFE IT  

---

## 1. Executive Summary & Corporate Topology

**PT HFE IT** operates a 2-tier B2B2B commerce and financial technology platform:
1. **HFE Core (Engine Provider)**: The headless financial kernel, double-entry ledger, Connect Hub marketplace, and multi-tenant compliance engine.
2. **HFE-IT Experience (Platform Operator)**: The unified frontend experience platform operating the retail, guest, personal, and storefront surfaces.

```mermaid
graph TD
    PT["PT HFE IT (Corporate Entity)"] --> T1["Tenant 1: HFE Core (Engine Provider)"]
    PT --> T2["Tenant 2: HFE-IT Experience (Platform Operator)"]
    
    T1 -- "Revenue Stream 1: Engine Usage (API Calls & Monthly)" --> T2
    T2 -- "Revenue Stream 2: SaaS Subscription / Transaction Fee" --> M["Merchant User Companies"]
    
    T2 --> P2["Produk 2: Hfeit POS"]
    T2 --> P3["Produk 3: Hfeit ORDER"]
    T2 --> P4["Produk 4: Hfeit BOARD"]
    T2 --> P5["Produk 5: Hfeit CARD"]
```

---

## 2. Product Portfolio Breakdown

| Product ID | Product Name | Description & Primary Capabilities | Target User Persona | Revenue Model |
| :--- | :--- | :--- | :--- | :--- |
| **Produk 1** | **HFE Core** | Headless Financial Posting Kernel, TigerBeetle Engine, 50-Connector Connect Hub, Tax Engine, Multi-Tenant Database. | Platform Operators, Core System Engineers | **Revenue Stream 1**: B2B Engine Usage (Per API mutation / monthly engine license). |
| **Produk 2** | **Hfeit POS** | Fast Cashier Register, Numpad, Cash Drawer Shift Sessions, Table Floorplans, KDS Kitchen Display, Local Stocktake. | Cashiers, Baristas, Store Managers | **Revenue Stream 2**: Monthly SaaS per register/outlet or transaction take-rate. |
| **Produk 3** | **Hfeit ORDER** | O2O Omnichannel Guest Dining, QR Table Self-Service Ordering, Instant Menu Cart, Payment Gateway (QRIS/Card). | Dine-in Restaurant Guests, Takeaway Customers | Included in SaaS Bundle / Small micro-fee per QR order. |
| **Produk 4** | **Hfeit BOARD** | Merchant Digital Storefront, Visual Menu Showcase, Brand Profile (Evolution of the Sekeding concept). | General Public, Online Customers | Included in Merchant Showcase Suite. |
| **Produk 5** | **Hfeit CARD** | Personal Consumer Loyalty Wallet, Digital Member Pass, Points Balance, Personal Receipts History. | Loyal Individual Consumers & Members | Loyalty Engine Module / Add-on. |

---

## 3. Multi-Tenancy & Provisioning Architecture

### 3.1 Tenant 1 (HFE Core Engine)
- **Role**: Root System Operator.
- **Tenant Scope**: Stores global connector catalog (50 connectors), baseline Chart of Accounts (CoA) templates, national jurisdictional tax profiles (DJP, Batam FTZ), and developer API documentation (Scalar OAS 3.1).
- **Security**: Strictly locked to Super-Admin credentials. Merchant tenants cannot read or mutate Tenant 1 system data.

### 3.2 Tenant 2 (HFE-IT Experience Platform Operator)
- **Role**: Master Tenant User / Reseller Account inside HFE Core.
- **Tenant Scope**: Owns and orchestrates the merchant ecosystem.
- **Provisioning Flow**:
  1. When a new Merchant (e.g. *"Restoran Kopi ABC"*) signs up on HFE-IT Experience:
  2. HFE-IT Experience invokes the HFE Core provisioning endpoint:
     ```http
     POST /api/v2/company-books/provision
     Content-Type: application/json
     
     {
       "company_name": "Restoran Kopi ABC",
       "billing_parent_tenant_id": "TENANT-2-EXPERIENCE",
       "coa_template": "ID_FNB_STANDARD",
       "tax_profile": "ID_PPN_11"
     }
     ```
  3. HFE Core creates a new isolated `Company` with its own `company_book_id UUID`.
  4. The merchant operates POS, ORDER, BOARD, and CARD within their own isolated book boundaries.
  5. At the end of the billing cycle:
     - **HFE Core** meters engine compute/posting volume and invoices **Tenant 2 (HFE-IT Experience)**.
     - **HFE-IT Experience** bills the **Merchant** according to its merchant subscription/transaction pricing.

---

## 4. Architectural Invariants & Hard Constraints

1. **Zero Cross-Tenant Data Leakage**: Every query and mutation in HFE Core must enforce `WHERE company_book_id = $merchant_book_id`.
2. **Immutable System Definitions**: Merchants instantiate connectors and CoA templates from Tenant 1, but cannot alter the root definitions.
3. **Financial Posting Kernel Invariant**: No direct SQL updates to account balances; all financial movements must resolve through `PostingService` and double-entry debits/credits.
4. **Permanent Audit Trail**: Posted journals and finalized period close records cannot be hard-deleted; corrections must execute via reversal entries.
5. **Asset Isolation**: Connector icons and platform assets resolve through `tenant1` contact subledgers with zero untrusted external CDN dependencies.

---

## 5. Repository Topology & Mapping

- **Backend Repository (`headless-company-books`)**:
  - Contains **Produk 1 (HFE Core Engine)**.
  - Master Orchestrator: `python3 scripts/hfe-rad0.py`
- **Frontend Repository (`hfe-pos`)**:
  - Contains **HFE-X Platform (Produk 2..5: POS, ORDER, BOARD, CARD + Rebuilt BOOK)**.
  - Master Orchestrator: `python3 scripts/hfex-rad0.py`

---

## 6. Unified Contact Subledger & Dynamic Namespaced Scope (`Hfeit:<SCOPES>`)

All corporate, partner, regulator, merchant, and consumer contacts across HFE Core and HFE-IT Experience are centrally managed in **Tenant 1's Contact Subledger**. 

To prevent cross-product data duplication and cleanly track lifecycle progression, contacts are partitioned using the **`Hfeit:<SCOPES>`** dynamic namespace:

### 6.1 Canonical Scope Tokens
- `CORE`: Internal platform, cloud infrastructure, financial regulators, and connector master definitions (e.g. BCA SNAP, Xero, DJP e-Faktur, AWS).
- `MERCHANT`: Business entities originating from Full Merchant Signups (POS / Backoffice / Cashier users).
- `BOARD`: Entities originating from Storefront / Landing Page-only signups (Evolusi Sekeding).
- `CARD`: Individual consumer members originating from Digital Loyalty Card signups.

### 6.2 Multi-Scope Combinations
A single contact entity can seamlessly hold multiple scope tags as their relationship evolves, separated by commas:
- `Hfeit:CORE` — Platform master connector or bank API partner.
- `Hfeit:BOARD` — Small food stall utilizing only digital menu storefront.
- `Hfeit:CARD` — Individual consumer holding a member pass.
- `Hfeit:MERCHANT,BOARD` — Merchant running in-store POS with active online storefront.
- `Hfeit:BOARD,MERCHANT,CARD` — Full-ecosystem enterprise merchant running POS, online storefront, and issuing loyalty member cards.

---

## 7. Core Operational & Lifecycle Journeys

### 7.1 The Genesis Bootstrapping Journey (Day 0)
1. System migration boots up Tenant 1 (`BOOK-SYSTEM-ROOT` & `BOOK-HFEIT-HQ`) and Tenant 2 (`TENANT-2-EXPERIENCE`).
2. An automatic **Intercompany Wholesale Bilateral Link** is created between Tenant 1 (PT HFE IT) and Tenant 2 (HFE-IT Experience), pre-authorizing paired Accounts Receivable (in T1) and Accounts Payable (in T2).

### 7.2 The Merchant Scope Upgrade & Expansion Journey
1. A merchant initially onboarded with `Hfeit:BOARD` (storefront menu only) opts to activate physical in-store POS.
2. In the merchant dashboard, clicking "Activate POS Terminal" triggers a state machine promotion:
   `SCOPE: Hfeit:BOARD` ──► `SCOPE: Hfeit:BOARD,MERCHANT`
3. HFE Core provisions terminal register IDs and cashier shifts in the existing company book without data loss or re-onboarding.

### 7.3 Automated Month-End Wholesale Metering & Invoicing Cycle
1. **Day 30 (23:59:59 UTC)**: HFE Core automated cron calculates total compute volume across all merchant companies under Tenant 2.
2. **Wholesale Invoice Issued**: Tenant 1 issues an official B2B invoice to Tenant 2 (Posting: `Dr. Piutang Usaha Tenant 2` vs `Cr. Pendapatan Lisensi Engine HFE Core`).
3. **Day 1 (00:00:01 UTC)**: HFE-IT Experience generates and dispatches retail subscription invoices to individual merchants via Virtual Account / Card auto-debit.

### 7.4 Dunning, Grace Period & Statutory Archival Journey
1. **Days 1–7 (Active Grace Period)**: If a merchant's monthly retail payment fails, POS cashier terminals continue operating with a subtle dashboard reminder banner.
2. **Day 8+ (Read-Only Suspension)**: The company status transitions to `STATUS: SUSPENDED_READONLY`. New orders and mutations are blocked, but historical journals, reports, and tax receipts remain viewable.
3. **Statutory 10-Year Archival**: When a business permanently closes, its book transitions to `STATUS: ARCHIVED_STATUTORY` with full cryptographic tamper-proofing, strictly satisfying Indonesian statutory tax audit laws (UU KUP).
