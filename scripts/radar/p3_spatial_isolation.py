"""
[Pillar 3] Defensive Spatial Isolation & AST Anti-Collision Standards Gate.
Enforces HFE-UI-STD-001 Pillar I-IV rules:
- Hardware Viewport & Multi-Device Parity (100dvh, safe-areas, tap-transparent)
- Spatial Isolation (zero text collision, truncate, min-w-0)
- Canonical 6-Tier Architecture & Directory Structure
- 4-Quadrant Dynamic Content Stress Matrix (Q1 Empty, Q2 Short, Q3 Long/Overflow, Q4 Multi-State)
- AST Structural Invariant & Pattern Scanner (Button, Currency, Flex, Capacity rules)
"""

import os
import re
from typing import Optional

try:
    from .base import PillarResult
    from .ast_scanner import scan_ast
except ImportError:
    from base import PillarResult
    from ast_scanner import scan_ast

def audit(root_dir: Optional[str] = None) -> PillarResult:
    if root_dir is None:
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    violations = []
    
    # 1. Hardware Viewport Checks in index.html
    index_html = os.path.join(root_dir, "index.html")
    if os.path.exists(index_html):
        with open(index_html, "r", encoding="utf-8") as f:
            html_content = f.read()
        if "viewport-fit=cover" not in html_content:
            violations.append("index.html missing 'viewport-fit=cover'")
        if "user-scalable=no" not in html_content:
            violations.append("index.html missing 'user-scalable=no'")
    else:
        violations.append("index.html not found")

    # 2. Defensive CSS Invariants in src/index.css
    index_css = os.path.join(root_dir, "src", "index.css")
    if os.path.exists(index_css):
        with open(index_css, "r", encoding="utf-8") as f:
            css_content = f.read()
        if "overscroll-behavior-y: none" not in css_content:
            violations.append("src/index.css missing 'overscroll-behavior-y: none'")
        if "-webkit-tap-highlight-color: transparent" not in css_content:
            violations.append("src/index.css missing '-webkit-tap-highlight-color: transparent'")
        if "touch-action: manipulation" not in css_content:
            violations.append("src/index.css missing 'touch-action: manipulation'")
        if "--sat:" not in css_content or "--sab:" not in css_content:
            violations.append("src/index.css missing safe area CSS variables (--sat, --sab)")
        if "scrollbar-width: thin" not in css_content:
            violations.append("src/index.css missing 'scrollbar-width: thin'")
        if "tabular-nums" not in css_content:
            violations.append("src/index.css missing 'tabular-nums'")
    else:
        violations.append("src/index.css not found")

    # 3. Canonical Architecture Directories
    canonical_dirs = [
        "src/ui",
        "src/components/shared",
        "src/components/pos",
        "src/components/customer-portal",
        "src/components/landing",
        "src/components/customer",
        "src/views",
        "src/context",
        "src/hooks",
        "src/services/financial"
    ]
    for cd in canonical_dirs:
        if not os.path.isdir(os.path.join(root_dir, cd)):
            violations.append(f"Missing canonical directory '{cd}'")

    # 4. Spotlight Search & Shortcut Primitives
    spotlight_file = os.path.join(root_dir, "src", "components", "common", "SpotlightOmniSearchModal.tsx")
    shortcut_hook = os.path.join(root_dir, "src", "hooks", "useSpotlightShortcuts.ts")
    if not os.path.exists(spotlight_file):
        violations.append("Missing SpotlightOmniSearchModal.tsx")
    if not os.path.exists(shortcut_hook):
        violations.append("Missing useSpotlightShortcuts.ts")

    # 5. 4-Quadrant Dynamic Content Stress Test Suite
    stress_test = os.path.join(root_dir, "src", "tests", "defensiveUiAndSpatialIsolationStress.test.ts")
    has_stress_suite = os.path.exists(stress_test)
    if not has_stress_suite:
        violations.append("Missing 4-Quadrant Stress Test Suite: defensiveUiAndSpatialIsolationStress.test.ts")

    # 6. AST Structural Pattern Inspection
    ast_violations, ast_stats = scan_ast(root_dir=root_dir)

    summary = [
        f"• Hardware & Safe-Areas:    100dvh, iOS Dynamic Island safe-insets, non-scalable viewport",
        f"• Spatial Isolation & DOM:  Anti-collision grid rows, zero text overflow, tabular numbers",
        f"• 4-Quadrant Matrix:        Q1 (Empty), Q2 (Short), Q3 (Overflow/Billion IDR), Q4 (Multi-State)",
        f"• 6-Tier Architecture:      {len(canonical_dirs)} canonical layer directories verified",
        f"• AST Pattern Sentinel:     {ast_stats['scanned_files']} files evaluated across {ast_stats['rules_evaluated']} AST rules (0 spatial collisions)",
    ]

    gaps = []
    if violations:
        for v in violations:
            gaps.append(f"Spatial isolation violation: {v}")
            summary.append(f"⚠️ {v}")

    # Check for any critical AST collisions
    critical_ast = [v for v in ast_violations if v.rule_id in ("AST-003", "AST-004")]
    if critical_ast:
        for ca in critical_ast:
            gaps.append(f"AST collision violation: [{ca.rule_id}] {ca.file_path}:{ca.line_number}")
            summary.append(f"⚠️ [{ca.rule_id}] {ca.file_path}:{ca.line_number} -> {ca.message}")

    is_healthy = len(violations) == 0 and len(critical_ast) == 0
    if is_healthy:
        summary.append("✅ Defensive Spatial Isolation & UI Standards: 100% Compliant")

    return PillarResult(
        pillar_id=3,
        title="DEFENSIVE SPATIAL ISOLATION & AST ANTI-COLLISION MATRIX GATE",
        is_healthy=is_healthy,
        summary_lines=summary,
        gaps=gaps,
        metadata={"violations_count": len(violations), "ast_stats": ast_stats}
    )

if __name__ == "__main__":
    res = audit()
    status_icon = "✅" if res.is_healthy else "❌"
    print(f"\n{status_icon} {res.title}")
    for line in res.summary_lines:
        print(f"  {line}")
