#!/usr/bin/env python3
"""World.Hfeit Gymnasium Reinforcement Learning Environment.
Implements the standard Gymnasium / Gym interface for training autonomous RL agents,
pricing optimizers, and Monte Carlo business simulation at warp speed (10,000x).
"""

import random
from typing import Dict, Any, Tuple, Optional, List

# Discrete Action Space Enumeration
ACTION_NO_OP = 0
ACTION_SET_PRICE_PREMIUM = 1
ACTION_SET_PRICE_DISCOUNT = 2
ACTION_HIRE_BARISTA = 3
ACTION_ROAST_BATCH_BOM = 4
ACTION_ORDER_GREEN_BEANS = 5
ACTION_TRIGGER_PROMO_QRIS = 6
ACTION_REQUEST_TAX_AUDIT = 7

ACTION_NAMES = [
    "NO_OP",
    "SET_PRICE_PREMIUM",
    "SET_PRICE_DISCOUNT",
    "HIRE_BARISTA",
    "ROAST_BATCH_BOM",
    "ORDER_GREEN_BEANS",
    "TRIGGER_PROMO_QRIS",
    "REQUEST_TAX_AUDIT"
]


class DiscreteSpace:
    """Lightweight Gymnasium Discrete Action Space emulation."""
    def __init__(self, n: int):
        self.n = n

    def sample(self) -> int:
        return random.randint(0, self.n - 1)


class BoxSpace:
    """Lightweight Gymnasium Box Observation Space emulation."""
    def __init__(self, low: List[float], high: List[float]):
        self.low = low
        self.high = high
        self.shape = (len(low),)


class WorldGymEnv:
    """Standard Gymnasium / Gym compliant environment for World.Hfeit commercial simulation."""

    def __init__(self, merchant_settings: Optional[Dict[str, Any]] = None):
        self.settings = merchant_settings or {}
        self.action_space = DiscreteSpace(8)
        self.observation_space = BoxSpace(
            low=[0.0, 0.0, 0.0, 0.0, -1e9, 0.0, 0.0],
            high=[1e9, 1e5, 1.0, 1.0, 1e9, 1e9, 1.0]
        )
        self.rng = random.Random(42)
        self.reset()

    def reset(
        self,
        seed: Optional[int] = None,
        options: Optional[Dict[str, Any]] = None
    ) -> Tuple[List[float], Dict[str, Any]]:
        """Reset the environment to the initial business state."""
        if seed is not None:
            self.rng = random.Random(seed)

        self.tick = 0
        self.day = 1
        self.hour = 7  # Store opens at 07:00 AM

        # Financial & Inventory State
        self.cash_on_hand = 5_000_000.0  # Rp 5.000.000 Initial Float
        self.green_beans_kg = 50.0       # 50 kg Green Beans
        self.roasted_beans_kg = 8.5      # 8.5 kg Roasted Coffee
        self.retained_earnings = 0.0
        self.daily_revenue = 0.0
        self.daily_cogs = 0.0
        self.daily_tax = 0.0
        self.daily_orders = 0

        # Operational Dynamics
        self.price_multiplier = 1.0
        self.baristas_count = 1
        self.customer_satisfaction = 0.95
        self.promo_boost_ticks = 0
        self.is_store_open = 1.0
        self.occupancy_rate = 0.0

        # Double-entry ledger verification totals
        self.total_debits = 5_000_000
        self.total_credits = 5_000_000

        obs = self._get_observation()
        info = {
            "day": self.day,
            "hour": self.hour,
            "balanced": self.total_debits == self.total_credits,
            "message": "Store opened with initial capital float Rp 5.000.000"
        }
        return obs, info

    def _get_observation(self) -> List[float]:
        """Return [CashOnHand, InventoryKg, TableOccupancyRate, CustomerSatisfaction, RetainedEarnings, DailyRevenue, IsStoreOpen]."""
        total_inv_kg = self.green_beans_kg + self.roasted_beans_kg
        return [
            float(self.cash_on_hand),
            float(round(total_inv_kg, 2)),
            float(round(self.occupancy_rate, 2)),
            float(round(self.customer_satisfaction, 2)),
            float(self.retained_earnings),
            float(self.daily_revenue),
            float(self.is_store_open)
        ]

    def step(self, action: int) -> Tuple[List[float], float, bool, bool, Dict[str, Any]]:
        """Execute one simulation step (1 hour virtual operational tick)."""
        self.tick += 1
        self.hour = (self.hour + 1) % 24
        if self.hour == 0:
            self.day += 1
            self.daily_revenue = 0.0
            self.daily_cogs = 0.0
            self.daily_tax = 0.0
            self.daily_orders = 0

        # Store open between 07:00 and 22:00
        self.is_store_open = 1.0 if (7 <= self.hour <= 22) else 0.0

        step_penalty = 0.0
        step_revenue = 0.0
        step_cogs = 0.0
        step_tax = 0.0
        step_orders = 0

        # 1. Process Agent Action
        if action == ACTION_SET_PRICE_PREMIUM:
            self.price_multiplier = 1.25
        elif action == ACTION_SET_PRICE_DISCOUNT:
            self.price_multiplier = 0.85
        elif action == ACTION_HIRE_BARISTA:
            if self.cash_on_hand >= 300_000:
                self.cash_on_hand -= 300_000
                self.baristas_count += 1
                self.customer_satisfaction = min(1.0, self.customer_satisfaction + 0.05)
                self.total_debits += 300_000
                self.total_credits += 300_000
            else:
                step_penalty += 100_000.0  # Cash shortfall penalty
        elif action == ACTION_ROAST_BATCH_BOM:
            if self.green_beans_kg >= 10.0:
                self.green_beans_kg -= 10.0
                roasted_gain = 10.0 * 0.85  # 15% PSAK 69 shrinkage
                self.roasted_beans_kg += roasted_gain
                self.total_debits += 900_000
                self.total_credits += 900_000
            else:
                step_penalty += 150_000.0  # Insufficient raw green beans
        elif action == ACTION_ORDER_GREEN_BEANS:
            cost = 1_600_000.0
            if self.cash_on_hand >= cost:
                self.cash_on_hand -= cost
                self.green_beans_kg += 20.0
                self.total_debits += int(cost)
                self.total_credits += int(cost)
            else:
                step_penalty += 200_000.0
        elif action == ACTION_TRIGGER_PROMO_QRIS:
            cost = 100_000.0
            if self.cash_on_hand >= cost:
                self.cash_on_hand -= cost
                self.promo_boost_ticks = 4
                self.total_debits += int(cost)
                self.total_credits += int(cost)
            else:
                step_penalty += 50_000.0
        elif action == ACTION_REQUEST_TAX_AUDIT:
            cost = 150_000.0
            if self.cash_on_hand >= cost:
                self.cash_on_hand -= cost
                self.customer_satisfaction = min(1.0, self.customer_satisfaction + 0.08)
                self.total_debits += int(cost)
                self.total_credits += int(cost)

        # 2. Simulate Customer Traffic & POS Sales
        if self.is_store_open == 1.0:
            rush_multiplier = 1.0
            if self.hour in [8, 9, 12, 13, 19, 20]:
                rush_multiplier = 2.2
            elif self.hour in [10, 11, 14, 15, 16, 17]:
                rush_multiplier = 1.2

            promo_multiplier = 1.4 if self.promo_boost_ticks > 0 else 1.0
            if self.promo_boost_ticks > 0:
                self.promo_boost_ticks -= 1

            price_effect = 0.85 if self.price_multiplier > 1.0 else (1.2 if self.price_multiplier < 1.0 else 1.0)
            traffic_intensity = rush_multiplier * promo_multiplier * price_effect * self.customer_satisfaction

            expected_customers = int(self.rng.randint(2, 6) * traffic_intensity)
            self.occupancy_rate = min(1.0, expected_customers / 8.0)

            for _ in range(expected_customers):
                coffee_needed = 0.04  # 40g roasted coffee per cup
                if self.roasted_beans_kg >= coffee_needed:
                    self.roasted_beans_kg -= coffee_needed
                    base_price = 35_000.0 * self.price_multiplier
                    tax = base_price * 0.10  # 10% PB1
                    cogs = base_price * 0.32
                    total_paid = base_price + tax

                    self.cash_on_hand += total_paid
                    step_revenue += base_price
                    step_tax += tax
                    step_cogs += cogs
                    step_orders += 1

                    self.total_debits += int(total_paid) + int(cogs)
                    self.total_credits += int(base_price) + int(tax) + int(cogs)
                else:
                    step_penalty += 30_000.0  # Stockout penalty
                    self.customer_satisfaction = max(0.2, self.customer_satisfaction - 0.02)
        else:
            self.occupancy_rate = 0.0

        # Update running aggregates
        self.daily_revenue += step_revenue
        self.daily_cogs += step_cogs
        self.daily_tax += step_tax
        self.daily_orders += step_orders
        gross_profit = step_revenue - step_cogs
        self.retained_earnings += gross_profit - step_penalty

        # Reward formula: R_t = Revenue_t - COGS_t - Penalty_t
        reward = step_revenue - step_cogs - step_penalty

        # Termination & Truncation (e.g. bankrupt or max horizon 30 days = 720 ticks)
        terminated = bool(self.cash_on_hand < 0)
        truncated = bool(self.tick >= 720)

        obs = self._get_observation()
        info = {
            "tick": self.tick,
            "day": self.day,
            "hour": self.hour,
            "action_name": ACTION_NAMES[action],
            "step_orders": step_orders,
            "step_revenue": step_revenue,
            "step_cogs": step_cogs,
            "step_penalty": step_penalty,
            "is_store_open": bool(self.is_store_open == 1.0),
            "balanced": self.total_debits == self.total_credits
        }

        return obs, reward, terminated, truncated, info
