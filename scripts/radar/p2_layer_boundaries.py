"""
[Pillar 2 Sentinel] 6-Tier Monotonic Downward Import Boundary Sentinel.
Enforces POS-ENG-STD-001 & HFE-UI-STD-001 Tier Isolation:
- Tier 1: Tokens, Theme, Utils, Types, Data, i18n
- Tier 2: React Aria Atoms & Headless Primitives (src/ui/, src/components/ui/)
- Tier 3: Domain Slot Widgets & Context/Hooks (src/components/shared/, src/components/common/, src/context/, src/hooks/, src/services/)
- Tier 4: Widget Clusters & Domain Assemblies (src/components/tables/, src/components/pos/, etc.)
- Tier 5: Master Layout Templates (src/layouts/)
- Tier 6: Smart Screens & Top-Level Views (src/views/, src/App.tsx, src/main.tsx)

Rule: Monotonic Downward Import Rule: Lower Tiers MUST NOT import from Higher Tiers (Tier N -> Tier <= N only).
Specifically:
- Tier 2 (Atoms in src/ui/) MUST NOT import from Tier 3, 4, 5, or 6.
- Tier 1 (Tokens) MUST NOT import from Tier 2, 3, 4, 5, 6.
- Tier 3 MUST NOT import from Tier 4, 5, 6.
- Tier 4 MUST NOT import from Tier 5, 6.
- Tier 5 MUST NOT import from Tier 6.
"""

import os
import sys
import glob
import re
import json
from typing import List, Dict, Tuple, Optional, Any
from dataclasses import dataclass, field

try:
    from .base import PillarResult
except ImportError:
    from base import PillarResult

TIER_DESCRIPTIONS = {
    1: "Tier 1 (Tokens, Types, Utils, i18n, Data)",
    2: "Tier 2 (React Aria Atoms & Headless Primitives)",
    3: "Tier 3 (Domain Slots, Shared Widgets, Context, Hooks, Services)",
    4: "Tier 4 (Widget Clusters & Domain Component Assemblies)",
    5: "Tier 5 (Master Layout Templates)",
    6: "Tier 6 (Smart Screens & Top-Level Views)"
}

@dataclass
class LayerViolation:
    source_file: str
    source_tier: int
    target_file: str
    target_tier: int
    import_path: str
    line_number: int = 0
    message: str = ""

def get_file_tier(rel_path: str) -> Optional[int]:
    """Classifies a source file path into one of the 6 canonical architecture tiers."""
    p = rel_path.replace("\\", "/")
    if p.startswith("src/tests/") or p.endswith(".stories.tsx") or p.endswith(".d.ts"):
        return None  # Test / Storybook Documentation tier

    if (
        p == "src/index.css" or
        p.startswith("src/types/") or
        p.startswith("src/lib/") or
        p.startswith("src/utils/") or
        p.startswith("src/i18n/") or
        p.startswith("src/data/")
    ):
        return 1

    if p.startswith("src/ui/") or p.startswith("src/components/ui/"):
        return 2

    if (
        p.startswith("src/components/shared/") or
        p.startswith("src/components/common/") or
        p.startswith("src/context/") or
        p.startswith("src/hooks/") or
        p.startswith("src/services/") or
        p.startswith("src/sdk/")
    ):
        return 3

    if p.startswith("src/components/"):
        return 4

    if p.startswith("src/layouts/"):
        return 5

    if p.startswith("src/views/") or p == "src/App.tsx" or p == "src/main.tsx":
        return 6

    return None

def resolve_target_file(source_file: str, import_str: str, root_dir: str) -> Optional[str]:
    """Resolves an import string to a relative workspace path."""
    if import_str.startswith("@/"):
        target = "src/" + import_str[2:]
    elif import_str.startswith("."):
        source_dir = os.path.dirname(source_file)
        target = os.path.normpath(os.path.join(source_dir, import_str)).replace("\\", "/")
    else:
        return None  # Third-party / external package

    # Check potential file extensions
    for ext in ["", ".ts", ".tsx", ".d.ts", "/index.ts", "/index.tsx"]:
        candidate = target + ext
        full_candidate = os.path.join(root_dir, candidate)
        if os.path.exists(full_candidate) and not os.path.isdir(full_candidate):
            return candidate

    return target

def scan_layer_boundaries(root_dir: Optional[str] = None) -> Tuple[List[LayerViolation], Dict[str, Any]]:
    """Scans all TypeScript source files in src/ and checks for 6-tier import boundary violations."""
    if root_dir is None:
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    src_dir = os.path.join(root_dir, "src")
    files = sorted([
        os.path.relpath(p, root_dir).replace("\\", "/")
        for p in glob.glob(os.path.join(src_dir, "**", "*.*"), recursive=True)
        if (p.endswith(".ts") or p.endswith(".tsx")) and not p.endswith(".d.ts")
    ])

    import_re = re.compile(r"^\s*(?:import|export)\s+(?:.*?from\s+)?[\x27\x22]([^\x27\x22]+)[\x27\x22]")

    violations: List[LayerViolation] = []
    tier_counts: Dict[int, int] = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
    tier2_imports_checked = 0
    total_imports_checked = 0

    for rel_path in files:
        src_tier = get_file_tier(rel_path)
        if not src_tier:
            continue
        tier_counts[src_tier] += 1

        full_path = os.path.join(root_dir, rel_path)
        try:
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                for line_idx, line in enumerate(f, start=1):
                    m = import_re.match(line)
                    if m:
                        imp_path = m.group(1)
                        total_imports_checked += 1
                        if src_tier == 2:
                            tier2_imports_checked += 1

                        target = resolve_target_file(rel_path, imp_path, root_dir)
                        if target:
                            target_tier = get_file_tier(target)
                            if target_tier and target_tier > src_tier:
                                msg = (
                                    f"Monotonic layer breach: {TIER_DESCRIPTIONS[src_tier]} in '{rel_path}' "
                                    f"imports higher-tier {TIER_DESCRIPTIONS[target_tier]} via '{imp_path}'"
                                )
                                violations.append(LayerViolation(
                                    source_file=rel_path,
                                    source_tier=src_tier,
                                    target_file=target,
                                    target_tier=target_tier,
                                    import_path=imp_path,
                                    line_number=line_idx,
                                    message=msg
                                ))
        except Exception:
            pass

    stats = {
        "scanned_files": len(files),
        "tier_counts": tier_counts,
        "total_imports_checked": total_imports_checked,
        "tier2_imports_checked": tier2_imports_checked,
        "violations_count": len(violations)
    }

    return violations, stats

def audit(root_dir: Optional[str] = None) -> PillarResult:
    """Executes Pillar 2 Layer Boundary verification."""
    violations, stats = scan_layer_boundaries(root_dir=root_dir)

    summary = [
        f"• 6-Tier Architecture:      {stats['scanned_files']} source files scanned across all 6 tiers",
        f"• Tier Distribution:        T1:{stats['tier_counts'][1]} | T2:{stats['tier_counts'][2]} | T3:{stats['tier_counts'][3]} | T4:{stats['tier_counts'][4]} | T5:{stats['tier_counts'][5]} | T6:{stats['tier_counts'][6]}",
        f"• Downward Import Rule:     {stats['total_imports_checked']} cross-file imports verified for strict monotonicity",
        f"• Tier 2 Atom Isolation:    {stats['tier2_imports_checked']} Tier 2 primitive imports strictly isolated from Tier 3-6",
    ]

    gaps = []
    if violations:
        for v in violations:
            gaps.append(v.message)
            summary.append(f"⚠️ {v.source_file}:{v.line_number} -> {v.message}")
        is_healthy = False
    else:
        summary.append("✅ 6-Tier Monotonic Layer Boundary Standard: 100% Compliant (0 Upward Imports)")
        is_healthy = True

    return PillarResult(
        pillar_id=2,
        title="TIER 2 REACT ARIA & 6-TIER MONOTONIC BOUNDARY GATE",
        is_healthy=is_healthy,
        summary_lines=summary,
        gaps=gaps,
        metadata=stats
    )

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="6-Tier Monotonic Downward Import Boundary Sentinel")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    args = parser.parse_args()

    v_list, s_dict = scan_layer_boundaries()
    if args.json:
        print(json.dumps({
            "healthy": len(v_list) == 0,
            "violations_count": len(v_list),
            "stats": s_dict,
            "violations": [
                {
                    "source_file": v.source_file,
                    "source_tier": v.source_tier,
                    "target_file": v.target_file,
                    "target_tier": v.target_tier,
                    "import_path": v.import_path,
                    "line_number": v.line_number,
                    "message": v.message
                }
                for v in v_list
            ]
        }, indent=2))
        sys.exit(0 if len(v_list) == 0 else 1)

    res = audit()
    status_icon = "✅" if res.is_healthy else "❌"
    print(f"\n{status_icon} {res.title}")
    for line in res.summary_lines:
        print(f"  {line}")
    sys.exit(0 if res.is_healthy else 1)
