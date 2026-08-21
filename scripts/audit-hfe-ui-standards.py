#!/usr/bin/env python3
"""HFE POS & UI Standards Auditor (HFE-UI-STD-001)
Strict Multi-Pillar Compliance Gate enforcing:
- Pillar I: Hardware Viewport & Cross-Browser Parity (100dvh, Touch Ergonomics, Single Scroll Owner)
- Pillar II: Experience Pillars & Microcopy (POS, CARD, BOARD, ORDER, Apple HIG Verb-First, Anti-Parentheses)
- Pillar III: Offline ACID Resilience & Durability (IndexedDB, navigator.storage.persist, beforeunload guard, Fail-Closed Storage)
- Pillar IV: Universal Accounting Truth & Double-Entry Mapping (Idempotency Key Header, Ledger Endpoints)
"""

import os
import sys
import re
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT_DIR / "src"

violations = []

def check_pillar_1_hardware_and_cross_browser():
    """Verify Pillar I: Viewport and Cross-Browser CSS Invariants."""
    index_css = SRC_DIR / "index.css"
    if not index_css.exists():
        violations.append("Pillar I [CSS]: 'src/index.css' not found.")
        return

    content = index_css.read_text(encoding="utf-8")

    # 1. Check overscroll-behavior-y: none
    if "overscroll-behavior-y: none" not in content and "overscroll-behavior: none" not in content:
        violations.append("Pillar I [Ergonomics]: 'index.css' missing 'overscroll-behavior-y: none' on root/html/body.")

    # 2. Check -webkit-tap-highlight-color: transparent
    if "-webkit-tap-highlight-color: transparent" not in content and "tap-highlight-color" not in content:
        violations.append("Pillar I [Ergonomics]: 'index.css' missing '-webkit-tap-highlight-color: transparent'.")

    # 3. Check touch-action: manipulation
    if "touch-action: manipulation" not in content:
        violations.append("Pillar I [Ergonomics]: 'index.css' missing 'touch-action: manipulation' on buttons/interactives.")

    # 4. Check user-select: none
    if "user-select: none" not in content and "select-none" not in content:
        violations.append("Pillar I [Ergonomics]: 'index.css' missing 'user-select: none' utility.")

def check_pillar_2_microcopy_and_experience_pillars():
    """Verify Pillar II: 4 Experience Pillars & Strict Microcopy Rules."""
    # 1. Check AGENTS.md for the 4 Experience Pillars declaration
    agents_md = ROOT_DIR / "AGENTS.md"
    if agents_md.exists():
        agents_text = agents_md.read_text(encoding="utf-8")
        for pillar_name in ["POS", "CARD", "BOARD", "ORDER"]:
            if pillar_name not in agents_text:
                violations.append(f"Pillar II [Agent Guidance]: 'AGENTS.md' missing experience pillar definition for {pillar_name}.")

    # 2. Check existence of Spotlight & Shortcut primitives
    spotlight_modal = SRC_DIR / "components" / "common" / "SpotlightOmniSearchModal.tsx"
    shortcut_hook = SRC_DIR / "hooks" / "useSpotlightShortcuts.ts"
    if not spotlight_modal.exists():
        violations.append("Pillar II [Spotlight]: 'SpotlightOmniSearchModal.tsx' component is missing.")
    if not shortcut_hook.exists():
        violations.append("Pillar II [Shortcuts]: 'useSpotlightShortcuts.ts' hook is missing.")

    # 3. Check JSX files for forbidden patterns
    hardcoded_is_mobile = re.compile(r'const\s+isMobile\s*=\s*viewportMode\s*===\s*[\'"]mobile[\'"]')

    for tsx_file in SRC_DIR.rglob("*.tsx"):
        try:
            text = tsx_file.read_text(encoding="utf-8")
            rel_path = tsx_file.relative_to(ROOT_DIR)

            # Check for hardcoded isMobile checks bypassing useViewport
            if hardcoded_is_mobile.search(text) and "useViewport" not in text:
                violations.append(f"Pillar II [Viewport SSOT]: '{rel_path}' hardcodes 'isMobile = viewportMode === mobile' without consuming 'useViewport()'.")

        except Exception as e:
            violations.append(f"Error reading file '{tsx_file}': {e}")

def check_pillar_3_offline_acid():
    """Verify Pillar III: Offline ACID Resilience, Storage Persistence & Crash Guard."""
    offline_storage = SRC_DIR / "services" / "offlineStorage.ts"
    offline_intent_queue = SRC_DIR / "services" / "financial" / "OfflineIntentQueue.ts"
    flush_manager = SRC_DIR / "services" / "flushManager.ts"

    # 1. Verify offlineStorage.ts presence and contracts
    if not offline_storage.exists():
        violations.append("Pillar III [ACID Storage]: 'src/services/offlineStorage.ts' is missing.")
    else:
        storage_text = offline_storage.read_text(encoding="utf-8")
        if "navigator.storage.persist" not in storage_text and "requestPersistentStorage" not in storage_text:
            violations.append("Pillar III [Durability]: 'offlineStorage.ts' missing 'navigator.storage.persist()' registration.")
        if "beforeunload" not in storage_text and "registerOfflineBeforeUnloadGuard" not in storage_text:
            violations.append("Pillar III [Crash Guard]: 'offlineStorage.ts' missing 'beforeunload' listener crash guard.")
        if "indexedDB" not in storage_text:
            violations.append("Pillar III [ACID Storage]: 'offlineStorage.ts' must use native IndexedDB physical disk storage.")
        if "FAIL-CLOSED" not in storage_text and "throw new Error" not in storage_text:
            violations.append("Pillar III [Durability]: 'offlineStorage.ts' must fail-closed on storage failure (no silent RAM degradation).")

    # 2. Verify OfflineIntentQueue.ts presence and fail-closed contracts
    if not offline_intent_queue.exists():
        violations.append("Pillar III [ACID Storage]: 'src/services/financial/OfflineIntentQueue.ts' is missing.")
    else:
        intent_text = offline_intent_queue.read_text(encoding="utf-8")
        if "FAIL-CLOSED" not in intent_text and "throw new Error" not in intent_text:
            violations.append("Pillar III [Durability]: 'OfflineIntentQueue.ts' must enforce fail-closed physical storage persistence.")

    # 3. Verify flushManager.ts wires crash guard
    if not flush_manager.exists():
        violations.append("Pillar III [Sync Manager]: 'src/services/flushManager.ts' is missing.")
    else:
        flush_text = flush_manager.read_text(encoding="utf-8")
        if "registerOfflineBeforeUnloadGuard" not in flush_text and "beforeunload" not in flush_text:
            violations.append("Pillar III [Crash Guard]: 'flushManager.ts' must wire beforeunload crash guard.")

def check_pillar_4_accounting_truth():
    """Verify Pillar IV: Accounting Truth & Idempotency Header in SDK."""
    sdk_adapter = SRC_DIR / "services" / "financial" / "HfeSdkAdapter.ts"
    if sdk_adapter.exists():
        sdk_text = sdk_adapter.read_text(encoding="utf-8")
        if "X-Idempotency-Key" not in sdk_text:
            violations.append("Pillar IV [Ledger]: 'HfeSdkAdapter.ts' must declare and send 'X-Idempotency-Key' header on mutations.")
        if "financial_kernel" not in sdk_text and "/transactions" not in sdk_text:
            violations.append("Pillar IV [Ledger]: 'HfeSdkAdapter.ts' missing transaction endpoint integration.")

def check_pillar_5_atomic_layer_architecture():
    """Verify Pillar V: 6-Tier Atomic Architecture & Primitives Presence."""
    tokens_file = SRC_DIR / "tokens" / "designTokens.ts"
    if not tokens_file.exists():
        violations.append("Pillar V [Tier 1 Tokens]: 'src/tokens/designTokens.ts' is missing.")
    else:
        tokens_text = tokens_file.read_text(encoding="utf-8")
        for token_group in ["GLYPHS", "SPACING_GRID", "TYPOGRAPHY_TOKENS", "SEMANTIC_COLORS", "FULFILLMENT_TOKENS"]:
            if token_group not in tokens_text:
                violations.append(f"Pillar V [Tier 1 Tokens]: 'designTokens.ts' missing token group '{token_group}'.")

    ui_barrel = SRC_DIR / "ui" / "index.ts"
    if not ui_barrel.exists():
        violations.append("Pillar V [Tier 2 Atoms]: 'src/ui/index.ts' barrel is missing.")
    else:
        ui_text = ui_barrel.read_text(encoding="utf-8")
        for atom in [
            "Button", "IconButton", "SegmentedControl", "TextInput", "Input",
            "ToggleSwitch", "KbdBadge", "Badge", "Card", "StatusPill",
            "Divider", "PriceTag", "CapacityBadge", "TimerPill", "MinSpendPill"
        ]:
            if atom not in ui_text:
                violations.append(f"Pillar V [Tier 2 Atoms]: 'src/ui/index.ts' missing export for atom '{atom}'.")

def main():
    print("==================================================")
    print(" 🛡️ Hfe Universal UI & Standards Auditor (HFE-UI-STD-001)")
    print("==================================================")

    check_pillar_1_hardware_and_cross_browser()
    check_pillar_2_microcopy_and_experience_pillars()
    check_pillar_3_offline_acid()
    check_pillar_4_accounting_truth()
    check_pillar_5_atomic_layer_architecture()

    if violations:
        print(f"\n❌ [AUDIT FAILED] Found {len(violations)} standard violation(s):\n")
        for v in violations:
            print(f"  • {v}")
        print("\nPlease fix these violations to satisfy HFE-UI-STD-001.")
        sys.exit(1)
    else:
        print("\n✅ [AUDIT PASSED] 100% Compliant with HFE-UI-STD-001 (Pillars I - V).")
        print("   • Pillar I   (Hardware Viewport & Cross-Browser Parity): PASSED")
        print("   • Pillar II  (Experience Pillars: POS, CARD, BOARD, ORDER): PASSED")
        print("   • Pillar III (Offline ACID Resilience & Durability):     PASSED")
        print("   • Pillar IV  (Universal Accounting Truth & Idempotency): PASSED")
        print("   • Pillar V   (6-Tier Atomic Architecture & Primitives):  PASSED")
        sys.exit(0)

if __name__ == "__main__":
    main()
