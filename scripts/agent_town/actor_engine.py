#!/usr/bin/env python3
"""Actor Engine for Headless World.Hfeit.
Implements continuous 24-hour state machines for Barista, Customer,
Roaster, and Farmer agents with accounting and capacity rules.
"""

from enum import Enum
from typing import Dict, List, Optional, Any, Tuple


class BaristaState(str, Enum):
    SLEEP = "SLEEP"
    COMMUTE = "COMMUTE"
    OPEN_SHIFT = "OPEN_SHIFT"
    BREWING = "BREWING"
    CASHIERING = "CASHIERING"
    NIGHT_CLEANING = "NIGHT_CLEANING"
    CLOSE_SHIFT = "CLOSE_SHIFT"


class CustomerState(str, Enum):
    ENTERING = "ENTERING"
    SEATED = "SEATED"
    ORDERED = "ORDERED"
    EATING = "EATING"
    PAYING = "PAYING"
    LEFT = "LEFT"


MENU_CATALOG: Dict[str, Dict[str, Any]] = {
    "Single Origin V60": {"price": 45_000, "cogs": 12_000, "category": "COFFEE"},
    "Geisha Natural": {"price": 85_000, "cogs": 28_000, "category": "COFFEE"},
    "Aren Latte": {"price": 38_000, "cogs": 10_000, "category": "COFFEE"},
    "Aren Latte Special": {"price": 42_000, "cogs": 11_500, "category": "COFFEE"},
    "Iced Americano": {"price": 32_000, "cogs": 7_000, "category": "COFFEE"},
    "Signature Cold Brew": {"price": 48_000, "cogs": 13_000, "category": "COFFEE"},
    "Truffle Croissant": {"price": 55_000, "cogs": 22_000, "category": "PASTRY"},
    "Roti Bakar Kaya": {"price": 28_000, "cogs": 8_500, "category": "PASTRY"},
    "Pastry Platter": {"price": 95_000, "cogs": 38_000, "category": "PASTRY"},
    "Pastry Art Platter": {"price": 110_000, "cogs": 44_000, "category": "PASTRY"},
    "Red Velvet Cake": {"price": 48_000, "cogs": 16_000, "category": "PASTRY"},
}


class DynamicOperatingHoursResolver:
    """Resolves merchant operating schedule and triggers daytime/nocturnal tasks."""

    def __init__(self, settings: Optional[Dict[str, Any]] = None):
        self.settings = settings or {"open": 7, "close": 23, "24_hours": False}

    def is_open(self, hour: float) -> bool:
        if self.settings.get("24_hours", False):
            return True
        open_h = self.settings.get("open", 7)
        close_h = self.settings.get("close", 23)
        h = hour % 24.0
        return open_h <= h < close_h

    def resolve_nocturnal_tasks(self, hour: float) -> List[Dict[str, Any]]:
        """Executes overnight batch operations when physical store is closed."""
        tasks = []
        h = int(hour) % 24
        if not self.is_open(hour):
            if h == 0:
                tasks.append({"type": "COLD_BREW_STEEPING", "desc": "Start 16h cold brew extraction (10kg batch)"})
            elif h == 2:
                tasks.append({"type": "PHYSICAL_STOCKTAKE", "desc": "Perform nocturnal barcode RFID count"})
            elif h == 4:
                tasks.append({"type": "DEPRECIATION_AMORTIZATION", "desc": "Post machine straight-line depreciation"})
        return tasks


class BaristaAgent:
    """Autonomous barista with 24-hour shift schedule and cash drawer float."""

    def __init__(self, agent_id: str, name: str = "Budi Santoso"):
        self.agent_id = agent_id
        self.name = name
        self.state: BaristaState = BaristaState.SLEEP
        self.cash_float_idr = 0
        self.shift_locked = False

    def tick(self, hour: float, pending_orders: int = 0) -> Dict[str, Any]:
        h = hour % 24.0
        prev_state = self.state
        if 0.0 <= h < 6.0:
            self.state = BaristaState.SLEEP
        elif 6.0 <= h < 6.5:
            self.state = BaristaState.COMMUTE
        elif 6.5 <= h < 7.0:
            self.state = BaristaState.OPEN_SHIFT
            self.cash_float_idr = 500_000  # Rp 500k standard register float
            self.shift_locked = False
        elif 7.0 <= h < 22.0:
            self.state = BaristaState.BREWING if pending_orders > 0 else BaristaState.CASHIERING
        elif 22.0 <= h < 22.75:
            self.state = BaristaState.NIGHT_CLEANING
        elif 22.75 <= h < 23.25:
            self.state = BaristaState.CLOSE_SHIFT
            self.shift_locked = True
        else:
            self.state = BaristaState.SLEEP

        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "state": self.state.value,
            "state_changed": prev_state != self.state,
            "cash_float_idr": self.cash_float_idr,
            "shift_locked": self.shift_locked,
        }


class CustomerAgent:
    """Simulates guest table selection, dynamic ordering, and split-bill settlement."""

    def __init__(
        self,
        agent_id: str,
        archetype: Any,
        party_size: int,
        budget_idr: int,
        preferences: List[str],
        dwell_mins: int = 45,
        split_bill: bool = False,
        tender_type: str = "QRIS_SNAP_BI",
    ):
        self.agent_id = agent_id
        self.archetype = archetype if isinstance(archetype, str) else archetype.value
        self.party_size = party_size
        self.budget_idr = budget_idr
        self.preferences = preferences
        self.dwell_mins = dwell_mins
        self.split_bill = split_bill
        self.tender_type = tender_type
        self.state: CustomerState = CustomerState.ENTERING
        self.table_id: Optional[str] = None
        self.order_items: List[Dict[str, Any]] = []
        self.subtotal_idr = 0
        self.pb1_tax_idr = 0
        self.total_bill_idr = 0

    def select_table(self, tables: Dict[str, Dict[str, Any]]) -> Optional[str]:
        """Selects optimal table minimizing wasted capacity ratio 👥 seated/max."""
        candidates = []
        for tid, t in tables.items():
            if t.get("status") == "FREE" and t.get("capacity", 4) >= self.party_size:
                waste = t["capacity"] - self.party_size
                candidates.append((waste, tid, t["capacity"]))

        if not candidates:
            return None

        candidates.sort(key=lambda x: x[0])
        best_tid, max_cap = candidates[0][1], candidates[0][2]
        self.table_id = best_tid
        self.state = CustomerState.SEATED
        tables[best_tid].update({
            "status": "OCCUPIED",
            "seated": self.party_size,
            "capacity_label": f"👥 {self.party_size}/{max_cap} Kursi",
            "customer_id": self.agent_id,
        })
        return best_tid

    def place_order(self) -> Dict[str, Any]:
        """Selects items matching preferences and budget, computes PB1 tax (10%)."""
        items = []
        rem_budget = self.budget_idr
        for _ in range(self.party_size):
            chosen = next((p for p in self.preferences if p in MENU_CATALOG and MENU_CATALOG[p]["price"] <= rem_budget), "Aren Latte")
            item_data = MENU_CATALOG.get(chosen, {"price": 38_000, "cogs": 10_000})
            items.append({"name": chosen, "price": item_data["price"], "cogs": item_data["cogs"]})
            rem_budget -= item_data["price"]

        self.order_items = items
        self.subtotal_idr = sum(i["price"] for i in items)
        self.pb1_tax_idr = int(self.subtotal_idr * 0.10)  # PB1 10% Local Restaurant Tax
        self.total_bill_idr = self.subtotal_idr + self.pb1_tax_idr
        self.state = CustomerState.ORDERED
        return {
            "order_id": f"ORD-{self.agent_id}",
            "customer_id": self.agent_id,
            "items": self.order_items,
            "subtotal_idr": self.subtotal_idr,
            "pb1_tax_idr": self.pb1_tax_idr,
            "total_bill_idr": self.total_bill_idr,
        }

    def settle_bill(self) -> Dict[str, Any]:
        """Executes payment with split-bill support across party members."""
        self.state = CustomerState.PAYING
        per_pax = (self.total_bill_idr // self.party_size) if self.party_size > 0 else self.total_bill_idr
        splits = []
        if self.split_bill and self.party_size > 1:
            for i in range(self.party_size):
                splits.append({"pax_index": i + 1, "amount_idr": per_pax, "tender": self.tender_type, "status": "SETTLED"})
        else:
            splits.append({"pax_index": 1, "amount_idr": self.total_bill_idr, "tender": self.tender_type, "status": "SETTLED"})

        self.state = CustomerState.LEFT
        return {
            "customer_id": self.agent_id,
            "table_id": self.table_id,
            "total_bill_idr": self.total_bill_idr,
            "split_count": len(splits),
            "splits": splits,
            "tender": self.tender_type,
        }


class RoasterAgent:
    """Manages BOM roasting batches with 15% oven shrinkage and truck logistics."""

    def __init__(self, agent_id: str = "ROAST-01", name: str = "Agus Roaster"):
        self.agent_id = agent_id
        self.name = name
        self.roast_count = 0

    def roast_batch(self, green_beans_kg: float, batch_size_kg: float = 100.0) -> Tuple[float, float, Dict[str, Any]]:
        """Applies 15% moisture shrinkage (100kg green -> 85kg roasted)."""
        if green_beans_kg < batch_size_kg:
            return green_beans_kg, 0.0, {"error": "INSUFFICIENT_STOCK"}

        shrinkage_rate = 0.15  # 15% standard oven shrinkage
        roasted_output_kg = batch_size_kg * (1.0 - shrinkage_rate)  # 85.0 kg
        unit_green_cost = 90_000
        total_green_cost = int(batch_size_kg * unit_green_cost)  # Rp 9.000.000
        cost_per_roasted_kg = int(total_green_cost / roasted_output_kg)

        self.roast_count += 1
        new_green_stock = green_beans_kg - batch_size_kg
        journal = {
            "event": f"Roasting Batch #{self.roast_count}: 100kg BOM",
            "batch_input_kg": batch_size_kg,
            "roasted_output_kg": roasted_output_kg,
            "shrinkage_pct": 15.0,
            "debit_account": "1420",
            "debit_name": "Persediaan Kopi Sangrai (Roasted Beans)",
            "credit_account": "1410",
            "credit_name": "Persediaan Biji Hijau (Green Beans)",
            "amount_idr": total_green_cost,
            "unit_cost_roasted_idr": cost_per_roasted_kg,
            "dispatch_truck": f"TRK-DISP-{self.roast_count:03d}",
        }
        return new_green_stock, roasted_output_kg, journal


class FarmerAgent:
    """Biological asset management and harvest revaluation under PSAK 69 / IAS 41."""

    def __init__(self, agent_id: str = "FARM-GAYO-01", coop_name: str = "Koperasi Gayo Organik"):
        self.agent_id = agent_id
        self.coop_name = coop_name
        self.hectares = 25.0

    def harvest_and_revalue(self, cherry_kg: float, fair_value_per_kg: int = 14_000) -> Dict[str, Any]:
        """Converts biological asset to agricultural produce at point of harvest."""
        total_fair_value = int(cherry_kg * fair_value_per_kg)
        point_of_sale_costs = int(total_fair_value * 0.05)  # 5% transport/sorting costs
        net_fair_value = total_fair_value - point_of_sale_costs

        return {
            "standard": "PSAK 69 / IAS 41 Agriculture",
            "asset_type": "Biological Asset -> Agricultural Produce (Coffee Cherries)",
            "harvest_kg": cherry_kg,
            "fair_value_per_kg_idr": fair_value_per_kg,
            "net_fair_value_idr": net_fair_value,
            "journal": {
                "debit_account": "1405",
                "debit_name": "Persediaan Ceri Kopi Hasil Panen",
                "credit_account": "4410",
                "credit_name": "Keuntungan Revaluasi Nilai Wajar Aset Biologis",
                "amount_idr": net_fair_value,
            },
        }


def test_actor_engine():
    print("Testing ActorEngine...")
    resolver = DynamicOperatingHoursResolver({"open": 7, "close": 23, "24_hours": False})
    assert resolver.is_open(8.0) is True and not resolver.is_open(23.5)
    nocturnal = resolver.resolve_nocturnal_tasks(0.0)
    assert len(nocturnal) == 1 and nocturnal[0]["type"] == "COLD_BREW_STEEPING"
    print("  ✓ Dynamic operating hours and nocturnal tasks verified.")

    barista = BaristaAgent("BAR-01", "Budi")
    assert barista.tick(3.0)["state"] == "SLEEP" and barista.tick(6.2)["state"] == "COMMUTE"
    open_shift = barista.tick(6.7)
    assert open_shift["state"] == "OPEN_SHIFT" and open_shift["cash_float_idr"] == 500_000
    assert barista.tick(12.0, pending_orders=2)["state"] == "BREWING"
    assert barista.tick(15.0, pending_orders=0)["state"] == "CASHIERING"
    close_shift = barista.tick(23.0)
    assert close_shift["state"] == "CLOSE_SHIFT" and close_shift["shift_locked"] is True
    print("  ✓ Barista 24h state machine and cash float verified.")

    tables = {"T01": {"capacity": 2, "status": "FREE"}, "T02": {"capacity": 4, "status": "FREE"}, "T03": {"capacity": 8, "status": "FREE"}}
    cust = CustomerAgent("CUST-001", "VIP", party_size=3, budget_idr=300_000, preferences=["Single Origin V60"], split_bill=True)
    assert cust.select_table(tables) == "T02"
    assert tables["T02"]["capacity_label"] == "👥 3/4 Kursi"
    print("  ✓ Customer table selection (👥 3/4 Kursi) verified.")

    order = cust.place_order()
    assert order["subtotal_idr"] > 0 and order["pb1_tax_idr"] == int(order["subtotal_idr"] * 0.10)
    assert cust.settle_bill()["split_count"] == 3
    print("  ✓ Customer ordering & split-bill settlement verified.")

    roaster = RoasterAgent("ROAST-01")
    new_green, roasted_out, roast_j = roaster.roast_batch(green_beans_kg=120.0, batch_size_kg=100.0)
    assert new_green == 20.0 and roasted_out == 85.0 and roast_j["amount_idr"] == 9_000_000
    print("  ✓ Roaster 100kg -> 85kg (15% shrinkage) verified.")

    farmer = FarmerAgent("FARM-01")
    harvest = farmer.harvest_and_revalue(cherry_kg=500.0, fair_value_per_kg=14_000)
    assert harvest["net_fair_value_idr"] == 6_650_000 and harvest["journal"]["debit_account"] == "1405"
    print("  ✓ Farmer PSAK 69 / IAS 41 cherry harvest revaluation verified.")
    print("All ActorEngine tests passed successfully!")


if __name__ == "__main__":
    test_actor_engine()
