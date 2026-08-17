# HFE-X Experience Platform: Scenario Reference & SSOT Pointer Index

**Standard:** `POS-ENG-STD-001` & `GLC-ARCH-TENANCY-001`  
**Master SSOT Authority:** [`headless-company-books/docs/active/scenarios/`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/)

All canonical business scenarios, YAML frontmatters, and 360° pairing matrices are exclusively authored in the master SSOT repository (`headless-company-books`).

---

## Canonical Scenario Pointers

| Scenario ID | Title | Level | Master SSOT Link | Frontend Verification Scope |
| :--- | :--- | :--- | :--- | :--- |
| **`SCN-00`** | **Master Conglomerate Lifecycle** | L0 | [`00-master-hfe-ecosystem-lifecycle.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-0/00-master-hfe-ecosystem-lifecycle.md) | Full-Suite E2E App Shell & Navigation |
| **`SCN-01-01`** | **F&B O2O Retail Lifecycle** | L1 | [`01-01-fnb-o2o-retail-lifecycle.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-1/01-01-fnb-o2o-retail-lifecycle.md) | POS Numpad, QR Dining & Table Floorplan |
| `SCN-01-01-01` | BSD Cafe POS & Split-Bill | L2 | [`01-01-01-bsd-cafe-pos-offline-splitbill.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-2/01-01-01-bsd-cafe-pos-offline-splitbill.md) | `PosTerminal.test.tsx`, `PaymentModal.test.tsx` |
| `SCN-01-01-02` | CPA Audit Practice & Switcher | L2 | [`01-01-02-kap-santoso-external-cpa-audit.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-2/01-01-02-kap-santoso-external-cpa-audit.md) | `MultiBookSwitcher.test.tsx`, `JournalEntryTable.test.tsx` |
| **`SCN-01-02`** | **Roasting Manufacturing BOM** | L1 | [`01-02-manufacturing-assembly-bom.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-1/01-02-manufacturing-assembly-bom.md) | Work Orders & Recipe Assembly |
| `SCN-01-02-01` | Nusantara Sangrai BOM Assembly | L2 | [`01-02-01-nusantara-sangrai-bom-assembly.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-2/01-02-01-nusantara-sangrai-bom-assembly.md) | `InventoryAssemblyModal.test.tsx` |
| **`SCN-01-03`** | **Sovereign Shard Migration** | L1 | [`01-03-sovereign-data-migration-cell.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-1/01-03-sovereign-data-migration-cell.md) | Admin Shard Visualizer & Zero Downtime |
| `SCN-01-03-01` | Live Shard Cutover SG to JKT | L2 | [`01-03-01-sg-to-jkt-live-shard-cutover.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-2/01-03-01-sg-to-jkt-live-shard-cutover.md) | `CellShardVisualizer.test.tsx` |
| **`SCN-01-04`** | **Cross-Border Regional Trade** | L1 | [`01-04-crossborder-trade-consolidation.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-1/01-04-crossborder-trade-consolidation.md) | Sleek Xero, DuitNow QR, FPS Settle |
| `SCN-01-04-01` | Sleek SG Xero to BOOK | L2 | [`01-04-01-sleek-xero-to-book-migration.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-2/01-04-01-sleek-xero-to-book-migration.md) | `ConnectorInstallModal.test.tsx` |
| `SCN-01-04-02` | Malaysia DuitNow & LHDN | L2 | [`01-04-02-malaysia-duitnow-lhdn-einvoice.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-2/01-04-02-malaysia-duitnow-lhdn-einvoice.md) | `TaxCompliancePortal.test.tsx` |
| `SCN-01-04-03` | Hong Kong FPS Bilateral Trade | L2 | [`01-04-03-hongkong-fps-intercompany-trade.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-2/01-04-03-hongkong-fps-intercompany-trade.md) | `CoATreeHierarchy.test.tsx` |
| **`SCN-01-05`** | **Biological Farm Accounting** | L1 | [`01-05-biological-agriculture-plantation.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-1/01-05-biological-agriculture-plantation.md) | IAS 41 Biological Asset Cards & Harvest Logs |
| `SCN-01-05-01` | Gayo 50-Ha Plantation Harvest | L2 | [`01-05-01-gayo-coffee-farm-biological-harvest.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-2/01-05-01-gayo-coffee-farm-biological-harvest.md) | `BiologicalAssetRegistry.test.tsx` |
| **`SCN-01-06`** | **Holding Wholesale Billing** | L1 | [`01-06-holding-b2b2b-wholesale-billing.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-1/01-06-holding-b2b2b-wholesale-billing.md) | Consolidated Group Statement & Metering |
| `SCN-01-06-01` | HoldCo Intercompany Eliminate | L2 | [`01-06-01-holdco-opco-intercompany-elimination.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-2/01-06-01-holdco-opco-intercompany-elimination.md) | `ConsolidatedStatementView.test.tsx` |
| `SCN-01-06-02` | Tenant 01 Wholesale Metering | L2 | [`01-06-02-tenant01-wholesale-metering-dispatch.md`](file:///Users/aldi/claudefiles/headless-company-books/docs/active/scenarios/level-2/01-06-02-tenant01-wholesale-metering-dispatch.md) | `WholesaleBillingInspector.test.tsx` |
