#!/usr/bin/env python3
"""Novel Narrative Story Engine for World.Hfeit.
Transforms raw simulation events into rich ANSI literary chapters,
character dialogues, emotional narrative arcs, and audit recaps.
"""

from typing import Dict, Any, Optional

# ANSI Color & Styling Tokens
BOLD = "\033[1m"
DIM = "\033[2m"
ITALIC = "\033[3m"
GREEN = "\033[32m"
BLUE = "\033[34m"
CYAN = "\033[36m"
YELLOW = "\033[33m"
MAGENTA = "\033[35m"
RED = "\033[31m"
RESET = "\033[0m"

MOOD_ICONS = {
    "happy": "😊",
    "excited": "🤩",
    "stressed": "😰",
    "busy": "⚡",
    "proud": "☕",
    "thoughtful": "🧐",
    "relieved": "😌",
    "solemn": "⚖️",
    "neutral": "💬"
}

ROLE_COLORS = {
    "Store Owner": CYAN,
    "Barista": GREEN,
    "Chef": YELLOW,
    "Roaster": MAGENTA,
    "Auditor": BLUE,
    "Customer": YELLOW,
    "Supplier": GREEN,
    "System": DIM
}


def format_idr(amount: int) -> str:
    """Format integer amount as Indonesian Rupiah."""
    return f"Rp {amount:,.0f}".replace(",", ".")


def format_chapter_header(day: int, current_time: str, title: str) -> str:
    """Format a novel chapter header with timestamp and divider."""
    divider = "═" * 78
    lines = [
        f"\n{BOLD}{BLUE}{divider}{RESET}",
        f"{BOLD}{CYAN} 📖 BABAK {day} — [{current_time}] : {title.upper()}{RESET}",
        f"{BOLD}{BLUE}{divider}{RESET}"
    ]
    return "\n".join(lines)


def format_dialogue(speaker: str, role: str, message: str, mood: str = "neutral") -> str:
    """Format character dialogue with persona colors and mood emoji."""
    icon = MOOD_ICONS.get(mood.lower(), "💬")
    color = ROLE_COLORS.get(role, CYAN)
    header = f" {BOLD}{color}[{role.upper()}] {speaker}{RESET} {icon}:"
    body = f"   {ITALIC}\"{message}\"{RESET}"
    return f"{header}\n{body}"


def format_drama_event(
    event_type: str,
    description: str,
    resolution: str,
    journal_ref: Optional[str] = None
) -> str:
    """Format an unexpected operational drama event with literary flare and accounting impact."""
    box_top = f" ┌─── ⚡ DRAMA OPERASIONAL: {event_type.upper()} " + "─" * max(10, 45 - len(event_type))
    lines = [
        f"{BOLD}{YELLOW}{box_top}{RESET}",
        f" │  {BOLD}Situasi:{RESET}    {description}",
        f" │  {BOLD}Resolusi:{RESET}   {GREEN}{resolution}{RESET}"
    ]
    if journal_ref:
        lines.append(f" │  {BOLD}Jurnal Ref:{RESET} {DIM}{journal_ref}{RESET}")
    lines.append(f"{BOLD}{YELLOW} └" + "─" * 70 + f"{RESET}")
    return "\n".join(lines)


def format_day_end_recap(
    financial_summary: Dict[str, Any],
    debits_credits_check: bool,
    audit_opinion: str = "Wajar Tanpa Pengecualian (Unqualified Clean Opinion)"
) -> str:
    """Format evening day-end closing recap and audit balance verification."""
    divider = "─" * 78
    day = financial_summary.get("day", 1)
    rev = format_idr(financial_summary.get("daily_revenue", 0))
    cogs = format_idr(financial_summary.get("daily_cogs", 0))
    tax = format_idr(financial_summary.get("tax_collected", 0))
    gross = format_idr(financial_summary.get("gross_profit", 0))
    cash = format_idr(financial_summary.get("cash_on_hand", 0))
    orders = financial_summary.get("orders_count", 0)
    shrinkage = financial_summary.get("shrinkage_kg", 0.0)

    status_badge = f"{GREEN}✅ LEDGER BALANCED (Debits == Credits){RESET}" if debits_credits_check else f"{RED}❌ LEDGER UNBALANCED{RESET}"

    lines = [
        f"\n{BOLD}{MAGENTA}{divider}{RESET}",
        f"{BOLD}{MAGENTA} 🌙 PENUTUPAN BUKU HARIAN & REKAP AUDIT (HARI KE-{day}){RESET}",
        f"{BOLD}{MAGENTA}{divider}{RESET}",
        f"  • Total Transaksi POS:    {BOLD}{orders}{RESET} pesanan terselesaikan",
        f"  • Pendapatan Kotor (Rev): {BOLD}{CYAN}{rev}{RESET}",
        f"  • Beban Pokok (COGS/HPP): {BOLD}{YELLOW}{cogs}{RESET}",
        f"  • Pajak PB1 (10% Pemda):  {BOLD}{YELLOW}{tax}{RESET}",
        f"  • Laba Kotor (Gross):     {BOLD}{GREEN}{gross}{RESET}",
        f"  • Kas & Bank Terkumpul:   {BOLD}{CYAN}{cash}{RESET}",
        f"  • Susut Roasting Biji:    {BOLD}{shrinkage:.2f} kg{RESET} (PSAK 69 15% Shrinkage)",
        f"{DIM}{divider}{RESET}",
        f"  • Status Jurnal Ganda:    {status_badge}",
        f"  • Opini Auditor KAP:      {BOLD}{BLUE}{audit_opinion}{RESET}",
        f"{BOLD}{MAGENTA}{divider}{RESET}\n"
    ]
    return "\n".join(lines)


class NovelStoryEngine:
    """Literary narration helper for generating contextual simulation vignettes."""

    @staticmethod
    def chapter_header(day: int, current_time: str, title: str) -> str:
        return format_chapter_header(day, current_time, title)

    @staticmethod
    def dialogue(speaker: str, role: str, message: str, mood: str = "neutral") -> str:
        return format_dialogue(speaker, role, message, mood)

    @staticmethod
    def drama(event_type: str, description: str, resolution: str, journal_ref: Optional[str] = None) -> str:
        return format_drama_event(event_type, description, resolution, journal_ref)

    @staticmethod
    def day_recap(summary: Dict[str, Any], balanced: bool, opinion: str) -> str:
        return format_day_end_recap(summary, balanced, opinion)
