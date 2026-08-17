#!/usr/bin/env python3
"""World.Hfeit Master Autonomous Simulation CLI Runner.
Simulates multi-day commercial operations, POS transactions, Roasting BOMs,
drama events, and double-entry accounting integrity with optional novel narration.
"""

import sys
import os
import time
import json
import random
import argparse
from typing import Dict, List, Any, Optional, Tuple

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from novel_story_engine import NovelStoryEngine, format_idr

STATE_FILE = os.path.join(CURRENT_DIR, "town_state.json")

DRAMA_TEMPLATES = [
    (
        "Mesin Espresso Steam Wand Mampet",
        "Katup uap mesin espresso tersumbat kerak susu saat antrean pagi.",
        "Barista Siti melakukan rapid descaling dalam 2 menit tanpa membatalkan tiket.",
        "JRN-REP-01 (Debit 6130 Beban Maintenance Rp 50.000 / Credit 1110 Kas Tunai Rp 50.000)",
        50_000
    ),
    (
        "Kunjungan Food Critic Terkemuka",
        "Blogger kuliner VIP memesan V60 Gayo & memotret latte art Mas Budi.",
        "Pelayanan ramah menghasilkan ulasan 5-bintang & kepuasan pelanggan naik +15%.",
        None,
        0
    ),
    (
        "Lonjakan 4-Way Split Bill QRIS",
        "Rombongan 6 eksekutif meminta pembagian tagihan 4-way split bill secara bersamaan.",
        "POS Cashier membagi QRIS & Cash terpisah dalam satu transaksi konsisten.",
        "JRN-POS-SPLIT (Debit 1120 Bank QRIS / Credit 4110 Penjualan F&B)",
        0
    ),
    (
        "Pengiriman Biji Kopi Gayo PSAK 69",
        "Koperasi Gayo mengirim 20 kg biji hijau dengan sertifikat organik.",
        "Roaster Agus menimbang biji masuk dan mencatat nilai wajar panen.",
        "JRN-INV-GRN (Debit 1410 Persediaan Biji Hijau / Credit 2110 Hutang Dagang Rp 1.600.000)",
        0
    ),
    (
        "Uji Petik Kepatuhan Pajak PB1 Pemda",
        "Petugas Bapenda melakukan pengecekan kepatuhan penyetoran pajak resto 10%.",
        "Auditor Santoso menunjukkan rekonsiliasi QRIS kliring otomatis 100% cocok.",
        None,
        0
    ),
]


class LedgerJournal:
    """Double-entry journal container tracking financial balance invariant."""
    def __init__(self):
        self.entries: List[Dict[str, Any]] = []

    def post(self, desc: str, debits: List[Tuple[str, int]], credits: List[Tuple[str, int]]):
        tot_d = sum(amt for _, amt in debits)
        tot_c = sum(amt for _, amt in credits)
        if tot_d != tot_c:
            raise ValueError(f"Ledger unbalanced in '{desc}': Debits ({tot_d}) != Credits ({tot_c})")
        self.entries.append({"description": desc, "debits": debits, "credits": credits, "amount": tot_d})

    def total_debits(self) -> int:
        return sum(sum(amt for _, amt in e["debits"]) for e in self.entries)

    def total_credits(self) -> int:
        return sum(sum(amt for _, amt in e["credits"]) for e in self.entries)


class WorldSimulator:
    """Master simulation orchestrator for multi-day World.Hfeit commercial town."""

    def __init__(
        self,
        days: int = 1,
        speed: str = "warp",
        hours_mode: str = "default",
        drama_rate: float = 0.35,
        novel: bool = False,
        seed: int = 42
    ):
        self.days = days
        self.speed = speed
        self.hours_mode = hours_mode
        self.drama_rate = drama_rate
        self.novel = novel
        self.rng = random.Random(seed)

        self.open_hour, self.close_hour = 7, 22
        if hours_mode == "24h":
            self.open_hour, self.close_hour = 0, 23
        elif "-" in hours_mode:
            try:
                parts = hours_mode.replace("custom", "").strip().split("-")
                self.open_hour = int(parts[0].split(":")[0])
                self.close_hour = int(parts[1].split(":")[0])
            except Exception:
                self.open_hour, self.close_hour = 7, 22

        self.cash = 5_000_000
        self.green_beans_kg = 50.0 + (days * 10.0)
        self.roasted_beans_kg = 8.5
        self.total_shrinkage_kg = 0.0
        self.total_orders = 0
        self.total_revenue = 0
        self.total_cogs = 0
        self.total_tax = 0
        self.ledger = LedgerJournal()

        # Day 0 Initial Capital Float
        self.ledger.post("Opening Capital Float", [("1110 (Kas)", 5_000_000)], [("3110 (Modal)", 5_000_000)])

    def _sleep_step(self):
        if self.speed == "slow":
            time.sleep(0.5)
        elif self.speed == "fast":
            time.sleep(0.05)

    def run_day(self, day: int) -> Dict[str, Any]:
        day_rev, day_cogs, day_tax, day_orders, day_shrink = 0, 0, 0, 0, 0.0

        if self.novel:
            print(NovelStoryEngine.chapter_header(day, "07:00 WIB", f"HARI KE-{day} : OPERASIONAL KAFE"))
            print(NovelStoryEngine.dialogue("Mas Budi", "Store Owner", "Buka kunci gerbang, nyalakan lampu kasir, bismillah hari baru!", "proud"))
            print(NovelStoryEngine.dialogue("Siti", "Barista", "Shift pagi siap! Saldo kas laci Rp 5.000.000 pas.", "happy"))
            self._sleep_step()

        for hour in range(24):
            is_open = (self.open_hour <= hour <= self.close_hour)

            # 1. Roasting Session
            if is_open and hour in [8, 15] and self.green_beans_kg >= 10.0:
                green_batch = 10.0
                shrink = green_batch * 0.15
                roasted_gain = green_batch - shrink
                cost = int(green_batch * 90_000)

                self.green_beans_kg -= green_batch
                self.roasted_beans_kg += roasted_gain
                self.total_shrinkage_kg += shrink
                day_shrink += shrink

                self.ledger.post(f"Roasting BOM Day {day} H{hour}", [("1420 (Roasted)", cost)], [("1410 (Green)", cost)])
                if self.novel:
                    print(NovelStoryEngine.dialogue("Agus", "Roaster", f"Roasting 10kg biji Gayo -> {roasted_gain:.1f}kg. Susut 1.5kg (PSAK 69).", "busy"))
                    self._sleep_step()

            # 2. Hourly POS Sales Traffic
            if is_open:
                rush = 2.5 if hour in [8, 9, 12, 13, 19, 20] else 1.0
                for _ in range(int(self.rng.randint(2, 5) * rush)):
                    if self.roasted_beans_kg >= 0.04:
                        self.roasted_beans_kg -= 0.04
                        subtotal = self.rng.randint(35_000, 75_000)
                        tax = int(subtotal * 0.10)
                        cogs = int(subtotal * 0.32)
                        tot = subtotal + tax

                        self.cash += tot
                        day_rev += subtotal
                        day_cogs += cogs
                        day_tax += tax
                        day_orders += 1

                        self.ledger.post(
                            f"POS Sale #{day_orders} Day {day}",
                            [("1120 (Bank/Kas)", tot), ("5110 (HPP)", cogs)],
                            [("4110 (Penjualan)", subtotal), ("2120 (PB1)", tax), ("1420 (Persediaan)", cogs)]
                        )

            # 3. Drama Events Simulation
            if is_open and self.rng.random() < self.drama_rate:
                ev_name, ev_desc, ev_res, ev_jrn, ev_cost = self.rng.choice(DRAMA_TEMPLATES)
                if ev_cost > 0:
                    self.cash -= ev_cost
                    self.ledger.post(f"Drama Day {day}", [("6130 (Beban Maintenance)", ev_cost)], [("1110 (Kas)", ev_cost)])
                if self.novel:
                    print(NovelStoryEngine.drama(ev_name, ev_desc, ev_res, ev_jrn))
                    self._sleep_step()

        # Day End Close: Depreciation
        depr = 250_000
        self.ledger.post(f"Depr Day {day}", [("6120 (Beban Penyusutan)", depr)], [("1720 (Akumulasi Depr)", depr)])

        self.total_revenue += day_rev
        self.total_cogs += day_cogs
        self.total_tax += day_tax
        self.total_orders += day_orders

        day_summary = {
            "day": day,
            "orders_count": day_orders,
            "daily_revenue": day_rev,
            "daily_cogs": day_cogs,
            "tax_collected": day_tax,
            "gross_profit": day_rev - day_cogs,
            "cash_on_hand": self.cash,
            "shrinkage_kg": day_shrink
        }

        balanced = (self.ledger.total_debits() == self.ledger.total_credits())
        if not balanced:
            raise ValueError(f"Ledger out of balance on day {day}!")

        if self.novel:
            print(NovelStoryEngine.day_recap(day_summary, balanced, "Wajar Tanpa Pengecualian (Unqualified Clean Opinion)"))
            self._sleep_step()

        return day_summary

    def run(self) -> Dict[str, Any]:
        daily_reports = [self.run_day(d) for d in range(1, self.days + 1)]
        tot_d = self.ledger.total_debits()
        tot_c = self.ledger.total_credits()

        telemetry = {
            "simulation": "WorldSimulator",
            "days_simulated": self.days,
            "speed": self.speed,
            "hours_mode": self.hours_mode,
            "drama_rate": self.drama_rate,
            "total_orders": self.total_orders,
            "total_revenue": self.total_revenue,
            "tax_collected": self.total_tax,
            "cogs_incurred": self.total_cogs,
            "gross_profit": self.total_revenue - self.total_cogs,
            "ending_cash": self.cash,
            "inventory": {
                "green_beans_kg": round(self.green_beans_kg, 2),
                "roasted_beans_kg": round(self.roasted_beans_kg, 2),
                "total_shrinkage_kg": round(self.total_shrinkage_kg, 2)
            },
            "ledger_balance": {
                "total_debits": tot_d,
                "total_credits": tot_c,
                "journal_entries_count": len(self.ledger.entries),
                "balanced": (tot_d == tot_c)
            },
            "daily_reports": daily_reports
        }

        try:
            with open(STATE_FILE, "w", encoding="utf-8") as f:
                json.dump(telemetry, f, indent=2)
        except Exception:
            pass

        return telemetry


def print_cli_summary(t: Dict[str, Any]):
    print("\n" + "=" * 78)
    print(" 🏙️  WORLD.HFEIT — MASTER SIMULATION TELEMETRY")
    print("=" * 78)
    print(f" • Periode:             {t.get('days_simulated')} Hari (Mode Kecepatan: {t.get('speed', 'warp').upper()})")
    print(f" • Jam Operasional:     {t.get('hours_mode')} | Drama Rate: {t.get('drama_rate')}")
    print("-" * 78)
    print(" 📊 RINGKASAN KOMERSIAL:")
    print(f"   - Total Pesanan:     {t.get('total_orders')} transaksi terselesaikan")
    print(f"   - Total Omzet:       {format_idr(t.get('total_revenue', 0))}")
    print(f"   - Setoran Pajak PB1: {format_idr(t.get('tax_collected', 0))} (10% Resto)")
    print(f"   - Total Beban HPP:   {format_idr(t.get('cogs_incurred', 0))}")
    print(f"   - Laba Kotor:        {format_idr(t.get('gross_profit', 0))}")
    print(f"   - Saldo Kas Akhir:   {format_idr(t.get('ending_cash', 0))}")
    print("-" * 78)
    print(" ☕ INVENTARIS & SUSUT SANGRAI (PSAK 69):")
    inv = t.get("inventory", {})
    print(f"   - Sisa Green Beans:  {inv.get('green_beans_kg', 0):.2f} kg")
    print(f"   - Sisa Roasted:      {inv.get('roasted_beans_kg', 0):.2f} kg")
    print(f"   - Total Susut Oven:  {inv.get('total_shrinkage_kg', 0):.2f} kg (15% Shrinkage)")
    print("-" * 78)
    print(" ⚖️  INTEGRITAS BUKU BESAR (DOUBLE-ENTRY LEDGER):")
    led = t.get("ledger_balance", {})
    bal = led.get("balanced", False)
    status_icon = "✅ SEIMBANG & TERVERIFIKASI (WTP)" if bal else "❌ TIDAK SEIMBANG"
    print(f"   - Total Debet:       {format_idr(led.get('total_debits', 0))}")
    print(f"   - Total Kredit:      {format_idr(led.get('total_credits', 0))}")
    print(f"   - Jumlah Jurnal:     {led.get('journal_entries_count')} entri")
    print(f"   - Status Invarian:   {status_icon}")
    print("=" * 78 + "\n")


def main():
    parser = argparse.ArgumentParser(description="World.Hfeit Master Autonomous Simulation CLI Runner")
    parser.add_argument("--days", type=int, default=1, help="Number of 24-hour days to simulate (default: 1)")
    parser.add_argument("--speed", choices=["slow", "fast", "warp"], default="warp", help="Speed: slow, fast, warp")
    parser.add_argument("--hours", type=str, default="default", help="Operating hours: default, 24h, or <open>-<close>")
    parser.add_argument("--drama-rate", type=float, default=0.35, help="Drama probability rate (0.0 to 1.0, default: 0.35)")
    parser.add_argument("--novel", action="store_true", help="Print full literary narrative novel chapters with dialogues")
    parser.add_argument("--fuzz", action="store_true", help="Run Property-Based Fuzzer & Chaos Invariant Stress Test")
    parser.add_argument("--iterations", type=int, default=10000, help="Number of fuzzing iterations (default: 10000)")
    parser.add_argument("--seed", type=int, default=None, help="Deterministic seed for fuzzing reproduction")
    parser.add_argument("--json", action="store_true", help="Output raw telemetry JSON summary")
    parser.add_argument("--status", action="store_true", help="Display latest persisted state")

    args = parser.parse_args()

    if args.fuzz:
        try:
            from fuzz_engine import run_fuzzer_cli
        except ImportError:
            from scripts.agent_town.fuzz_engine import run_fuzzer_cli
        sys.exit(run_fuzzer_cli(iterations=args.iterations, seed=args.seed))

    if args.status and os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                telemetry = json.load(f)
        except Exception:
            sim = WorldSimulator(days=args.days, speed=args.speed, hours_mode=args.hours, drama_rate=args.drama_rate, novel=args.novel)
            telemetry = sim.run()
    else:
        sim = WorldSimulator(
            days=args.days,
            speed=args.speed,
            hours_mode=args.hours,
            drama_rate=args.drama_rate,
            novel=args.novel
        )
        telemetry = sim.run()

    if args.json:
        print(json.dumps(telemetry, indent=2))
    elif not args.novel:
        print_cli_summary(telemetry)


if __name__ == "__main__":
    main()
