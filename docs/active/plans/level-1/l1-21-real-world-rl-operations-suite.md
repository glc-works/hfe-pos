---
okf_version: "0.2"
type: Strategic Plan Level 1
title: Real-World RL Operations Suite (Printer Station Routing, GS1 Barcode Scale Parser, Equal N-Way Split & Consignment Inventory)
description: Strategic plan for bridging real-world operational gaps in F&B and Retail, featuring multi-station printer routing (Bar, Kitchen, Pastry), GS1 EAN-13 price-embedded barcode scale parser (fresh fruit/meat), equal N-way bill splitting, complimentary item logging, retail returns/exchanges, and consignment inventory tracking.
tags: [plan, level-1, pos, rl-ops, printer-routing, gs1-barcode, equal-split, complimentary, consignment]
parent_level_0: hfe-pos-suite-master-plan
status: Approved
---

# Level 1 Strategic Plan: Real-World RL Operations Suite

## 1. Domain Outcome
Delivers the **Real-World RL Operations Suite** for `hfe-pos` (`glc-works/hfe-pos`), bridging 10 critical operational gaps identified from real-world F&B and Retail floor operations.

Empowers store operators to handle real-world scenarios:
- **F&B RL Ops**: Station printer routing (Bar vs Kitchen vs Pastry printers), equal N-way bill splitting (dividing bill equally among N guests), complimentary/house treat item logging with subledger expense posting, and service charge sequence rules.
- **Retail RL Ops**: GS1 / EAN-13 price-embedded barcode scale parsing (selling fresh meat/fruit by weight), customer price-checker terminal mode, retail item return & exchange workflows, and supplier consignment inventory tracking resolved through HCB Core REST APIs (`/v1/pos/rl-ops`).

---

## 2. Capability Scope

```
 🏬 REAL-WORLD RL OPERATIONS LIFECYCLE
 ├─ ☕ F&B REAL-WORLD OPERATIONS
 │     - Multi-Station Printer Routing Rules (Bar Printer vs Kitchen Printer vs Pastry Printer)
 │     - Equal N-Way Bill Split (Divides bill equally into N equal parts, e.g. Rp 400k / 4 = Rp 100k)
 │     - Complimentary / House Treat Item Logging (`6-5200-COMPLIMENTARY-EXPENSE`)
 │     - Open Tab Pre-Authorization & Card Hold Tracking
 │
 └─ 🛒 RETAIL REAL-WORLD OPERATIONS
       - GS1 / EAN-13 Price-Embedded Barcode Scale Parser (`20xxxxxxxxx` -> SKU + Weight kg + Price)
       - Customer Price-Checker Terminal Mode (`/price-check` route)
       - Retail Item Return & Exchange Workflow (`POST /v1/returns` with store credit / refund)
       - Supplier Consignment Inventory Tagging (Pay-on-sale consignment accounting)
```

---

## 3. Dependent Level 2 Plans
- `docs/active/plans/level-2/l2-pos-25-station-printer-routing-gs1-barcode-scale-consignment-engine.md`

---

## 4. Verification Criteria
- GS1 barcode parser correctly extracts SKU `00123`, Weight `1.250 kg`, and Price `Rp 12.500` from `2000123012504`.
- Station printer router directs beverage items to Bar Printer and food items to Kitchen Printer.
- Equal N-way bill split calculates zero-remainder payment splits clean.
