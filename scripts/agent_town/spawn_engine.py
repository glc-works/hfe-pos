#!/usr/bin/env python3
"""Spawn Engine for Headless World.Hfeit.
Generates stochastic and scheduled customer traffic, supply chain deliveries,
and regulatory authority inspections based on continuous time and store state.
"""

import sys
import os
import random
from enum import Enum
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any


class CustomerArchetype(str, Enum):
    VIP = "VIP"
    STUDENT = "STUDENT"
    ARISAN = "ARISAN"
    FOOD_BLOGGER = "FOOD_BLOGGER"


@dataclass
class SpawnEvent:
    event_id: str
    event_type: str
    hour: float
    description: str
    payload: Dict[str, Any] = field(default_factory=dict)


@dataclass
class SupplyShipment:
    shipment_id: str
    supplier_name: str
    item_code: str
    item_name: str
    quantity_kg: float
    unit_cost_idr: int
    total_amount_idr: int
    origin_region: str
    status: str = "PENDING_DELIVERY"
    tracking_ref: str = ""


@dataclass
class AuthorityInspection:
    inspection_id: str
    authority_name: str
    audit_type: str
    scheduled_hour: float
    scope: str
    required_documents: List[str]
    status: str = "SCHEDULED"


# Archetype behavioral blueprints
ARCHETYPE_CONFIGS: Dict[CustomerArchetype, Dict[str, Any]] = {
    CustomerArchetype.VIP: {
        "party_size_range": (1, 2),
        "budget_range": (150_000, 450_000),
        "preferences": ["Single Origin V60", "Geisha Natural", "Truffle Croissant"],
        "dwell_mins_range": (35, 75),
        "split_bill_prob": 0.05,
        "tender_preference": "CARD",
        "tip_rate": 0.15,
    },
    CustomerArchetype.STUDENT: {
        "party_size_range": (1, 4),
        "budget_range": (35_000, 75_000),
        "preferences": ["Aren Latte", "Iced Americano", "Roti Bakar Kaya"],
        "dwell_mins_range": (90, 180),
        "split_bill_prob": 0.85,
        "tender_preference": "QRIS_SNAP_BI",
        "tip_rate": 0.0,
    },
    CustomerArchetype.ARISAN: {
        "party_size_range": (4, 8),
        "budget_range": (120_000, 300_000),
        "preferences": ["Aren Latte", "Single Origin V60", "Pastry Platter", "Red Velvet Cake"],
        "dwell_mins_range": (60, 135),
        "split_bill_prob": 0.90,
        "tender_preference": "QRIS_SNAP_BI",
        "tip_rate": 0.05,
    },
    CustomerArchetype.FOOD_BLOGGER: {
        "party_size_range": (1, 2),
        "budget_range": (90_000, 220_000),
        "preferences": ["Signature Cold Brew", "Aren Latte Special", "Pastry Art Platter"],
        "dwell_mins_range": (30, 60),
        "split_bill_prob": 0.10,
        "tender_preference": "QRIS_SNAP_BI",
        "tip_rate": 0.10,
    },
}


class SpawnEngine:
    """Manages spawning of customer agents, supply deliveries, and authority audits."""

    def __init__(self, seed: int = 42):
        self.rng = random.Random(seed)
        self.spawn_counter = 0
        self.shipment_counter = 0
        self.audit_counter = 0

    def get_hourly_traffic_factor(self, hour: float) -> float:
        """Returns baseline traffic multiplier (0.0 - 1.0) based on 24h circadian curve."""
        h = hour % 24.0
        if 0.0 <= h < 6.0:
            return 0.02  # Nocturnal closed/quiet
        elif 6.0 <= h < 7.0:
            return 0.20  # Pre-opening
        elif 7.0 <= h < 10.0:
            return 0.85  # Morning commuter rush
        elif 10.0 <= h < 12.0:
            return 0.50  # Mid-morning lull
        elif 12.0 <= h < 14.0:
            return 0.95  # Lunch peak rush
        elif 14.0 <= h < 17.0:
            return 0.65  # Afternoon work & arisan
        elif 17.0 <= h < 21.0:
            return 0.90  # Evening social hangout
        elif 21.0 <= h < 23.0:
            return 0.35  # Late night wind-down
        else:
            return 0.08  # Closing transition

    def _select_archetype_for_hour(self, hour: float) -> CustomerArchetype:
        """Weighted archetype selection matching time of day."""
        h = hour % 24.0
        if 7.0 <= h < 11.0:
            weights = {CustomerArchetype.VIP: 0.40, CustomerArchetype.STUDENT: 0.40, CustomerArchetype.FOOD_BLOGGER: 0.15, CustomerArchetype.ARISAN: 0.05}
        elif 11.0 <= h < 15.0:
            weights = {CustomerArchetype.VIP: 0.30, CustomerArchetype.ARISAN: 0.35, CustomerArchetype.FOOD_BLOGGER: 0.20, CustomerArchetype.STUDENT: 0.15}
        elif 15.0 <= h < 18.0:
            weights = {CustomerArchetype.STUDENT: 0.45, CustomerArchetype.ARISAN: 0.35, CustomerArchetype.VIP: 0.10, CustomerArchetype.FOOD_BLOGGER: 0.10}
        else:
            weights = {CustomerArchetype.STUDENT: 0.40, CustomerArchetype.VIP: 0.30, CustomerArchetype.FOOD_BLOGGER: 0.20, CustomerArchetype.ARISAN: 0.10}

        archetypes = list(weights.keys())
        probabilities = [weights[a] for a in archetypes]
        return self.rng.choices(archetypes, weights=probabilities, k=1)[0]

    def spawn_customer(self, current_hour: float, store_traffic_level: float = 1.0) -> Optional[Any]:
        """Evaluates traffic and conditionally returns a CustomerAgent or profile."""
        traffic_prob = self.get_hourly_traffic_factor(current_hour) * min(1.5, max(0.1, store_traffic_level))
        if self.rng.random() > traffic_prob:
            return None

        self.spawn_counter += 1
        archetype = self._select_archetype_for_hour(current_hour)
        config = ARCHETYPE_CONFIGS[archetype]

        p_min, p_max = config["party_size_range"]
        party_size = self.rng.randint(p_min, p_max)
        b_min, b_max = config["budget_range"]
        budget_per_pax = self.rng.randint(b_min, b_max)
        total_budget = budget_per_pax * party_size

        d_min, d_max = config["dwell_mins_range"]
        dwell_time = self.rng.randint(d_min, d_max)

        split_bill = self.rng.random() < config["split_bill_prob"] and party_size > 1
        tender = config["tender_preference"]
        if self.rng.random() < 0.25:  # 25% random fallback to alternate tender
            tender = self.rng.choice(["QRIS_SNAP_BI", "CASH", "CARD"])

        # Lazy import of CustomerAgent to prevent circular dependencies
        try:
            from scripts.agent_town.actor_engine import CustomerAgent
            return CustomerAgent(
                agent_id=f"CUST-{self.spawn_counter:04d}",
                archetype=archetype,
                party_size=party_size,
                budget_idr=total_budget,
                preferences=list(config["preferences"]),
                dwell_mins=dwell_time,
                split_bill=split_bill,
                tender_type=tender,
            )
        except ImportError:
            try:
                from actor_engine import CustomerAgent
                return CustomerAgent(
                    agent_id=f"CUST-{self.spawn_counter:04d}",
                    archetype=archetype,
                    party_size=party_size,
                    budget_idr=total_budget,
                    preferences=list(config["preferences"]),
                    dwell_mins=dwell_time,
                    split_bill=split_bill,
                    tender_type=tender,
                )
            except ImportError:
                return {
                    "agent_id": f"CUST-{self.spawn_counter:04d}",
                    "archetype": archetype.value,
                    "party_size": party_size,
                    "budget_idr": total_budget,
                    "preferences": config["preferences"],
                    "dwell_mins": dwell_time,
                    "split_bill": split_bill,
                    "tender_type": tender,
                }

    def spawn_supply_delivery(self, inventory_status: Dict[str, Any]) -> Optional[SupplyShipment]:
        """Spawns green bean shipment if stock is below safe threshold."""
        green_kg = inventory_status.get("green_beans_kg", 100.0)
        reorder_threshold = inventory_status.get("reorder_threshold_kg", 30.0)

        if green_kg <= reorder_threshold:
            self.shipment_counter += 1
            batch_kg = 100.0  # Standard 100kg batch order
            unit_cost = 90_000  # Rp 90.000 / kg Arabica Gayo Grade 1
            total_amount = int(batch_kg * unit_cost)

            return SupplyShipment(
                shipment_id=f"SHP-GAYO-{self.shipment_counter:04d}",
                supplier_name="Koperasi Petani Kopi Gayo Mandiri",
                item_code="RAW-COF-GAYO-01",
                item_name="Biji Hijau Kopi Gayo Arabica Specialty (Green Beans)",
                quantity_kg=batch_kg,
                unit_cost_idr=unit_cost,
                total_amount_idr=total_amount,
                origin_region="Takengon, Aceh Tengah",
                status="DISPATCHED",
                tracking_ref=f"TRK-SUM-{self.shipment_counter:06d}",
            )
        return None

    def spawn_authority_check(self, day_index: int, current_hour: float) -> Optional[AuthorityInspection]:
        """Spawns scheduled or surprise municipal tax or independent financial audits."""
        h = current_hour % 24.0

        # Bapenda PB1 Local Restaurant Tax Audit (Monthly or surprise bi-weekly check at business hours 10-15)
        if day_index % 14 == 0 and 10.0 <= h < 11.0 and self.audit_counter == 0:
            self.audit_counter += 1
            return AuthorityInspection(
                inspection_id=f"AUD-BAPENDA-{day_index:03d}",
                authority_name="Bapenda Daerah Khusus Ibukota (PB1 Tax Inspectorate)",
                audit_type="BAPENDA_PB1_AUDIT",
                scheduled_hour=h,
                scope="Verifikasi Pajak Restoran 10% (PB1), Rekonsiliasi Z-Report Kasir vs Setoran Bank SNAP BI",
                required_documents=["Z-Report POS", "Buku Kas Laci", "Rekening Koran QRIS Settlement", "Faktur Pajak"],
            )

        # KAP Santoso Year-End Forensic Financial Audit (Day 30 at 14:00)
        if day_index % 30 == 0 and 14.0 <= h < 15.0:
            self.audit_counter += 1
            return AuthorityInspection(
                inspection_id=f"AUD-KAP-SANTOSO-{day_index:03d}",
                authority_name="Kantor Akuntan Publik (KAP) Santoso & Rekan",
                audit_type="YEAR_END_FORENSIC_AUDIT",
                scheduled_hour=h,
                scope="Forensic Audit Tutup Buku Tahunan, Verifikasi Debet/Kredit SAK-EMKM, Opname Stok Gudang",
                required_documents=["Neraca Saldo Penutup", "Jurnal Umum", "Berita Acara Stock Opname", "Daftar Aset Tetap"],
            )

        return None


def test_spawn_engine():
    engine = SpawnEngine(seed=123)
    print("Testing SpawnEngine...")

    # 1. Test circadian traffic factors
    assert engine.get_hourly_traffic_factor(2.0) == 0.02
    assert engine.get_hourly_traffic_factor(8.0) == 0.85
    assert engine.get_hourly_traffic_factor(13.0) == 0.95
    assert engine.get_hourly_traffic_factor(20.0) == 0.90
    print("  ✓ Circadian traffic curves verified.")

    # 2. Test Customer Spawning
    spawned = 0
    for hour in range(7, 23):
        for _ in range(5):
            cust = engine.spawn_customer(float(hour), store_traffic_level=1.2)
            if cust:
                spawned += 1
    assert spawned > 0, "Should spawn multiple customers during store hours"
    print(f"  ✓ Customer spawning active ({spawned} customers spawned in simulation).")

    # 3. Test Supply Shipment Trigger
    low_inv = {"green_beans_kg": 15.0, "reorder_threshold_kg": 30.0}
    shipment = engine.spawn_supply_delivery(low_inv)
    assert shipment is not None
    assert shipment.quantity_kg == 100.0
    assert shipment.total_amount_idr == 9_000_000
    print("  ✓ Supply delivery trigger (100kg Arabica Gayo) verified.")

    # 4. Test Authority Inspection Trigger
    audit = engine.spawn_authority_check(day_index=14, current_hour=10.5)
    assert audit is not None
    assert audit.audit_type == "BAPENDA_PB1_AUDIT"
    print("  ✓ Bapenda PB1 tax inspection trigger verified.")

    print("All SpawnEngine tests passed successfully!")


if __name__ == "__main__":
    test_spawn_engine()
