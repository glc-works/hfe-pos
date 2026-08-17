#!/usr/bin/env python3
"""Headless Agent Town & Game Simulation Engine.
Simulates autonomous multi-actor business lifecycles, POS cashiering,
roasting BOM shrinkage, period close, and continuous double-entry ledger invariants.
"""

import sys
import os
import time
import json
import random
import argparse
from typing import Dict, List, Any, Optional

STATE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "town_state.json")

class JournalEntry:
    def __init__(self, tick: int, description: str):
        self.tick = tick
        self.description = description
        self.debits: List[Dict[str, Any]] = []
        self.credits: List[Dict[str, Any]] = []

    def add_debit(self, account: str, name: str, amount: int):
        self.debits.append({"account": account, "name": name, "amount": amount})

    def add_credit(self, account: str, name: str, amount: int):
        self.credits.append({"account": account, "name": name, "amount": amount})

    def is_balanced(self) -> bool:
        return sum(d["amount"] for d in self.debits) == sum(c["amount"] for c in self.credits)


class HeadlessTownSimulation:
    """Core simulation engine simulating virtual city business operations & double-entry ledger."""

    def __init__(self, days: int = 30, actors: int = 5, speed: str = "warp", seed: int = 42):
        self.days = days
        self.actor_count = actors
        self.speed = speed
        self.rng = random.Random(seed)
        self.ticks = max(50, days * 2)

        # Operational metrics
        self.total_orders = 0
        self.total_revenue = 0
        self.tax_collected = 0
        self.cogs_incurred = 0
        self.green_beans_kg = 50.0 + (days * 2.5)
        self.roasted_beans_kg = 5.0
        self.journal_entries: List[JournalEntry] = []

        # Floor tables
        self.tables = {
            f"T{i:02d}": {"capacity": 4, "status": "FREE", "seated": 0, "order_id": None}
            for i in range(1, 9)
        }

        # Autonomous Town Actors
        available_roles = [
            "Cashier (Siti)", "Barista (Budi)", "Chef (Wayan)",
            "Roaster (Agus)", "Manager (Dewi)", "Auditor (Santoso)",
            "VIP Guest (Alex)", "Supplier (Gayo)"
        ]
        self.actors = [
            {"id": f"ACT_{i+1:02d}", "name": available_roles[i % len(available_roles)], "actions": 0}
            for i in range(actors)
        ]

        # Initial Founder Opening Capital Float (Day 0)
        entry = JournalEntry(0, "Founder Opening Capital Float")
        entry.add_debit("1110", "Kas Laci Tunai", 5_000_000)
        entry.add_credit("3110", "Modal Pemilik", 5_000_000)
        self.journal_entries.append(entry)

    def _tick_roasting(self, tick: int):
        if self.green_beans_kg >= 10.0:
            batch_green = 10.0
            shrinkage = 0.15  # 15% shrinkage during roasting
            batch_roasted = batch_green * (1.0 - shrinkage)  # 8.5 kg
            green_cost = 90_000 * int(batch_green)  # Rp 900.000
            self.green_beans_kg -= batch_green
            self.roasted_beans_kg += batch_roasted

            entry = JournalEntry(tick, f"Roasting BOM Batch 10kg -> {batch_roasted:.1f}kg (15% shrinkage)")
            entry.add_debit("1420", "Persediaan Kopi Sangrai (Roasted)", green_cost)
            entry.add_credit("1410", "Persediaan Biji Hijau (Green)", green_cost)
            self.journal_entries.append(entry)

    def _tick_pos_order(self, tick: int):
        free_tables = [tid for tid, t in self.tables.items() if t["status"] == "FREE"]
        if free_tables:
            tid = self.rng.choice(free_tables)
            seated = self.rng.randint(1, 4)
            self.tables[tid].update({"status": "OCCUPIED", "seated": seated, "order_id": f"ORD-{tick:04d}"})

        occupied = [tid for tid, t in self.tables.items() if t["status"] == "OCCUPIED"]
        if occupied:
            tid = self.rng.choice(occupied)
            seated = self.tables[tid]["seated"]
            subtotal = seated * self.rng.randint(35_000, 80_000)
            tax = int(subtotal * 0.10)  # 10% PB1 Local Restaurant Tax
            cogs = int(subtotal * 0.32)
            total = subtotal + tax

            self.total_orders += 1
            self.total_revenue += subtotal
            self.tax_collected += tax
            self.cogs_incurred += cogs

            # 1. Sales & PB1 Tax Revenue Entry
            entry = JournalEntry(tick, f"POS Order {self.tables[tid]['order_id']} at {tid}")
            entry.add_debit("1120", "Bank QRIS Settlement", total)
            entry.add_credit("4110", "Pendapatan Penjualan F&B", subtotal)
            entry.add_credit("2120", "Hutang Pajak Restoran PB1", tax)
            self.journal_entries.append(entry)

            # 2. COGS & Inventory Reduction Entry
            cogs_entry = JournalEntry(tick, f"COGS Recognition for {self.tables[tid]['order_id']}")
            cogs_entry.add_debit("5110", "Beban Pokok Penjualan (HPP)", cogs)
            cogs_entry.add_credit("1420", "Persediaan Kopi Sangrai", cogs)
            self.journal_entries.append(cogs_entry)

            # Free table for next cycle
            self.tables[tid].update({"status": "FREE", "seated": 0, "order_id": None})

    def _tick_month_end(self, tick: int):
        depreciation = 250_000
        entry = JournalEntry(tick, f"Month-End Depreciation Close Tick {tick}")
        entry.add_debit("6120", "Beban Penyusutan Mesin Espresso", depreciation)
        entry.add_credit("1720", "Akumulasi Penyusutan Aset", depreciation)
        self.journal_entries.append(entry)

    def run(self) -> Dict[str, Any]:
        for tick in range(1, self.ticks + 1):
            if self.speed == "fast":
                time.sleep(0.01)

            if tick % 6 == 1:
                self._tick_roasting(tick)

            self._tick_pos_order(tick)

            if tick % 25 == 0 or tick == self.ticks:
                self._tick_month_end(tick)

            for actor in self.actors:
                actor["actions"] += self.rng.randint(1, 4)

        # Invariant Verification: Debits == Credits
        total_debits = sum(sum(d["amount"] for d in e.debits) for e in self.journal_entries)
        total_credits = sum(sum(c["amount"] for c in e.credits) for e in self.journal_entries)
        unbalanced = [e for e in self.journal_entries if not e.is_balanced()]

        if unbalanced:
            raise ValueError(f"Ledger invariant failed: {len(unbalanced)} unbalanced entries")
        if total_debits != total_credits:
            raise ValueError(f"Ledger unbalanced: Debits ({total_debits}) != Credits ({total_credits})")

        telemetry = {
            "simulation": "HeadlessTownSimulation",
            "days_simulated": self.days,
            "ticks_executed": self.ticks,
            "speed": self.speed,
            "actors_count": len(self.actors),
            "actors": self.actors,
            "total_orders": self.total_orders,
            "total_revenue": self.total_revenue,
            "tax_collected": self.tax_collected,
            "cogs_incurred": self.cogs_incurred,
            "gross_profit": self.total_revenue - self.cogs_incurred,
            "inventory": {
                "green_beans_kg": round(self.green_beans_kg, 2),
                "roasted_beans_kg": round(self.roasted_beans_kg, 2)
            },
            "table_occupancy": {tid: t["status"] for tid, t in self.tables.items()},
            "ledger_balance": {
                "total_debits": total_debits,
                "total_credits": total_credits,
                "journal_entries_count": len(self.journal_entries),
                "balanced": total_debits == total_credits and len(unbalanced) == 0
            }
        }

        # Persist telemetry for town status queries
        try:
            with open(STATE_FILE, "w", encoding="utf-8") as f:
                json.dump(telemetry, f, indent=2)
        except Exception:
            pass

        return telemetry


def get_latest_telemetry() -> Dict[str, Any]:
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    # Fallback to instantaneous 30-day simulation if no state exists
    sim = HeadlessTownSimulation(days=30, actors=5, speed="warp")
    return sim.run()


def format_idr(amount: int) -> str:
    return f"Rp {amount:,.0f}".replace(",", ".")


def print_telemetry_report(t: Dict[str, Any]):
    print("=" * 75)
    print(" 🏙️  HEADLESS AGENT TOWN — SIMULATION & TELEMETRY REPORT")
    print("=" * 75)
    print(f" • Simulation Mode:     {t.get('simulation')} ({t.get('speed', 'warp').upper()})")
    print(f" • Days Simulated:       {t.get('days_simulated')} days ({t.get('ticks_executed')} virtual ticks)")
    print(f" • Autonomous Actors:    {t.get('actors_count')} active agents")
    print("-" * 75)
    print(" 📊 COMMERCIAL & FINANCIAL OUTCOMES:")
    print(f"   - Total Orders:       {t.get('total_orders')} orders completed")
    print(f"   - Total Revenue:      {format_idr(t.get('total_revenue', 0))}")
    print(f"   - PB1 Tax Collected:  {format_idr(t.get('tax_collected', 0))} (10% Resto Tax)")
    print(f"   - COGS (HPP):         {format_idr(t.get('cogs_incurred', 0))}")
    print(f"   - Gross Profit:       {format_idr(t.get('gross_profit', 0))}")
    print("-" * 75)
    print(" ☕ ROASTING & INVENTORY TELEMETRY:")
    inv = t.get("inventory", {})
    print(f"   - Green Beans Stock:  {inv.get('green_beans_kg', 0):.2f} kg")
    print(f"   - Roasted Coffee:     {inv.get('roasted_beans_kg', 0):.2f} kg (PSAK 69 15% shrinkage applied)")
    print("-" * 75)
    print(" ⚖️  DOUBLE-ENTRY LEDGER INTEGRITY:")
    ledger = t.get("ledger_balance", {})
    balanced = ledger.get("balanced", False)
    status_icon = "✅ VERIFIED BALANCED" if balanced else "❌ UNBALANCED"
    print(f"   - Total Debits:       {format_idr(ledger.get('total_debits', 0))}")
    print(f"   - Total Credits:      {format_idr(ledger.get('total_credits', 0))}")
    print(f"   - Journal Entries:    {ledger.get('journal_entries_count')} postings")
    print(f"   - Ledger Invariant:   {status_icon} (Debits == Credits: {balanced})")
    print("=" * 75)


def main():
    parser = argparse.ArgumentParser(description="Headless Agent Town & Game Simulation Runner")
    parser.add_argument("--days", type=int, default=30, help="Number of virtual days to simulate (default: 30)")
    parser.add_argument("--actors", type=int, default=5, help="Number of autonomous actors (default: 5)")
    parser.add_argument("--speed", choices=["warp", "fast"], default="warp", help="Simulation speed: warp or fast")
    parser.add_argument("--json", action="store_true", help="Output raw telemetry JSON")
    parser.add_argument("--status", action="store_true", help="Display latest town telemetry status")

    args = parser.parse_args()

    if args.status:
        telemetry = get_latest_telemetry()
    else:
        sim = HeadlessTownSimulation(days=args.days, actors=args.actors, speed=args.speed)
        telemetry = sim.run()

    if args.json:
        print(json.dumps(telemetry, indent=2))
    else:
        print_telemetry_report(telemetry)


if __name__ == "__main__":
    main()
