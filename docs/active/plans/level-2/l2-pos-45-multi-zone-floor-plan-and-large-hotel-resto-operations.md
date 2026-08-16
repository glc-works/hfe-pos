---
okf_version: "0.2"
type: Development Plan Level 2
title: Multi-Zone Floor Plan, Weather Relocation, Multi-Kitchen Split Routing & Hotel Folio Engine (L2-POS-45)
description: Formal specification and implementation plan for multi-zone floor plan filtering (Outdoor, Indoor AC, VIP Rooms, Poolside, Rooftop), instant 1-tap table relocation on weather changes, multi-station split ticket routing, and hotel guest room folio charging.
tags: [development-plan, level-2, hotel-resto, multi-zone, floor-plan, split-routing, room-folio, hfe-pos]
parent_level_1: l1-26-hotel-resort-and-large-scale-fnb-operations
github_issue: 45
status: Implemented
---

# Level 2 Implementation Plan: Multi-Zone Floor Plan, Weather Relocation, Multi-Kitchen Split Routing & Hotel Folio Engine (L2-POS-45)

## 1. Outcome
Delivers comprehensive operational capabilities for **Large-Scale Hotel Restaurants, Resorts, Beach Clubs, and Multi-Zone Mega-Venues (100–300 tables)** within `hfe-pos` and `headless-company-books` per the approved expert audit [`large_scale_hotel_resto_audit.md`](file:///Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656/large_scale_hotel_resto_audit.md).

## 2. Technical Specification & Zone Architecture

### 2.1. Dynamic Property Zone Data Model (`src/types/pos.ts`)
```typescript
export interface PropertyZoneConfig {
  id: string // e.g. "outdoor-garden", "indoor-ac", "vip-private", or custom UUID
  name: string // e.g. "🌿 Outdoor Garden", "❄️ Lantai 1 AC", "🏖️ Pantai Depan", "👑 Ruangan VIP Anggrek"
  icon?: string // Emoji or Lucide icon key
  tablePrefix?: string // e.g. "OUT-", "IND-", "VIP-"
  totalTables?: number
  hasDedicatedServiceStaff?: boolean
  defaultMinSpend?: number // e.g. 2500000 for VIP rooms
}
```

> **Owner Customization Invariant:** Property zones are NOT rigid hardcoded enums. Merchant owners can add, rename, re-order, or customize zone names (e.g. changing "Outdoor Garden" to "🌿 Gazebo Danau" or adding "☕ Mezzanine Bar") directly from Merchant Settings. Default seed zones are provided out-of-the-box.

### 2.2. Zone Routing & Table Operation Contracts

| Operational Capability | Technical Behavior & Contract | Component Owner |
|---|---|---|
| **Multi-Zone Table Filtering** | 1-Tap zone switcher pills filtering 100+ tables with zero visual lag (< 16ms reflow) | `PosTableFloorPlanSection.tsx` |
| **Universal Table Reassignment (Pindah Meja)** | 1-Tap table move copying active chits, tabs, and guest binding to target table with audit reason tagging (Guest Request, Rain/Weather, Bigger Pax, VIP Upgrade, Facility Issue) | `TableOpsModal.tsx` & `useTableState.ts` |
| **Multi-Station Split Routing** | Decomposes 1 order ticket into sub-chits by station (`hot-kitchen`, `cold-pantry`, `barista-bar`) | `UnifiedKdsView.tsx` & `hfeWorkflowsApi.ts` |
| **Hotel Room Folio Charge** | Verifies guest name & stay dates by room number with digital signature capture | `RoomChargeModal.tsx` & `hfeCoreApi.ts` |
| **VIP Minimum Spend Progress** | Live progress bar calculating current bill vs minimum spend threshold | `TableLiveStatusDrawer.tsx` |

---

## 3. Scope & Implementation Phases

### Phase A: Multi-Zone Floor Plan Filtering (`src/components/pos/PosTableFloorPlanSection.tsx`)
- Add Zone Switcher Bar:
  - `[ 🏢 Semua Area (123) ]`
  - `[ 🌿 Outdoor Garden (30) ]`
  - `[ ❄️ Indoor AC Dining (40) ]`
  - `[ 👑 VIP Private Rooms (8) ]`
  - `[ 🏊 Poolside Cabana (20) ]`
  - `[ 🍸 Rooftop Sky Bar (25) ]`
- Add duration seated badges (e.g. `⏱️ 45m`) and amber warning for kitchen delay > 20m.

### Phase B: Weather Relocation & Table Operation Modal (`src/components/tables/TableOpsModal.tsx`)
- Modal providing:
  - `[ ⇄ Pindah Meja / Relokasi ]`
  - `[ 👥 Gabung Meja (Merge Tabs) ]`
  - `[ ✂️ Split Bill per Seat ]`

### Phase C: Multi-Station KDS Split Routing Engine (`src/views/UnifiedKdsView.tsx`)
- Station filter tabs: `[ 🍳 Hot Kitchen ] [ 🥗 Cold Pantry ] [ 🍸 Barista & Bar ] [ 🥩 Live Grill ]`.

### Phase D: Hotel Room Charge Modal (`src/components/pos/RoomChargeModal.tsx`)
- Room search with PMS folio validation, guest signature canvas, and double-entry posting:
  - `[DEBIT] 1104 - Piutang Tamu Hotel (Guest Room Ledger Folio)`
  - `[KREDIT] 4101 - Pendapatan Penjualan Restoran`
  - `[KREDIT] 2105 - Hutang Pajak Restoran PB1 (10%)`

### Phase E: Unit Test Suite (`src/tests/multiZoneHotelResto.test.ts`)
- Tests zone filtering, emergency weather relocation state integrity, and room charge validation.

---

## 4. Verification Plan
- Unit tests pass clean with 100% assertion success (`npm run test`).
- All modified and new files strictly adhere to modularity (< 500 lines).
- Production build succeeds without errors (`./scripts/ci-local.sh`).
