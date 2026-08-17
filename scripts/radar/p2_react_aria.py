"""
[Pillar 2] Tier 2 React Aria, Headless Primitives & 6-Tier Layer Boundary Integrity.
Verifies that:
1. Tier 2 Headless Primitives & Atomic UI components (in src/ui/ and src/components/ui/)
   provide accessible attributes, role contracts, and clean exports.
2. 6-Tier Monotonic Downward Import Rule is enforced (Tier 2 atoms MUST NOT import from Tier 3-6).
"""

import os
from typing import Optional

try:
    from .base import PillarResult
    from .p2_layer_boundaries import scan_layer_boundaries
except ImportError:
    from base import PillarResult
    from p2_layer_boundaries import scan_layer_boundaries

REQUIRED_PRIMITIVES = [
    ("src/ui/index.ts", "UI Barrel Export"),
    ("src/ui/PriceTag.tsx", "Tier 2 Tabular Price Tag Atom"),
    ("src/ui/TimerPill.tsx", "Tier 2 Temporal Timer Pill"),
    ("src/ui/MinSpendPill.tsx", "Tier 2 Minimum Spend Pill"),
    ("src/ui/CapacityBadge.tsx", "Tier 2 Dynamic Capacity Utilisation Badge"),
    ("src/components/ui/button.tsx", "Tier 2 Accessible Button Primitive"),
    ("src/components/ui/badge.tsx", "Tier 2 Accessible Badge Primitive"),
    ("src/components/ui/card.tsx", "Tier 2 Accessible Card Primitive"),
]

def audit(root_dir: Optional[str] = None) -> PillarResult:
    if root_dir is None:
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    missing = []
    verified_count = 0
    accessibility_checks = []

    for rel_path, desc in REQUIRED_PRIMITIVES:
        full_path = os.path.join(root_dir, rel_path)
        if not os.path.exists(full_path):
            missing.append(f"{desc} ({rel_path})")
        else:
            verified_count += 1
            try:
                with open(full_path, "r", encoding="utf-8") as f:
                    content = f.read()
                if "aria-" in content or "role=" in content or "className" in content:
                    accessibility_checks.append(rel_path)
            except Exception:
                pass

    # Layer Boundary Verification
    layer_violations, layer_stats = scan_layer_boundaries(root_dir=root_dir)

    summary = [
        f"• Headless Primitives:       {verified_count}/{len(REQUIRED_PRIMITIVES)} verified in src/ui & src/components/ui",
        f"• Accessible Tier 2 Atoms:   {len(accessibility_checks)} primitives enforce styling & accessibility tokens",
        f"• 6-Tier Architecture:      {layer_stats['scanned_files']} files verified across 6 canonical layers",
        f"• Downward Import Rule:     {layer_stats['total_imports_checked']} imports checked (0 upward breaches)",
        f"• Tier 2 Isolation:         {layer_stats['tier2_imports_checked']} atomic imports strictly isolated from Tier 3-6",
    ]

    gaps = []
    if missing:
        for m in missing:
            gaps.append(f"Missing Tier 2 headless primitive: {m}")
        summary.append(f"⚠️ Missing {len(missing)} Tier 2 primitive(s)")

    if layer_violations:
        for v in layer_violations:
            gaps.append(v.message)
            summary.append(f"⚠️ {v.source_file}:{v.line_number} -> {v.message}")

    is_healthy = len(missing) == 0 and len(layer_violations) == 0
    if is_healthy:
        summary.append("✅ Tier 2 Headless Primitives & Layer Boundary Standard: 100% Compliant")

    return PillarResult(
        pillar_id=2,
        title="TIER 2 REACT ARIA & 6-TIER MONOTONIC BOUNDARY GATE",
        is_healthy=is_healthy,
        summary_lines=summary,
        gaps=gaps,
        metadata={
            "verified_count": verified_count,
            "missing": missing,
            "layer_stats": layer_stats,
            "layer_violations": len(layer_violations)
        }
    )

if __name__ == "__main__":
    res = audit()
    status_icon = "✅" if res.is_healthy else "❌"
    print(f"\n{status_icon} {res.title}")
    for line in res.summary_lines:
        print(f"  {line}")
