"""
[Pillar 3 Sentinel] AST Structural Pattern & Defensive UI Invariant Scanner.
Scans TSX/TS source files across the 6-Tier Architecture using AST pattern matching & regex token inspection:
- AST-001 (RAW-BUTTON-INPUT): Raw <button> or <input> in Tier 3/4/5/6 components (must use <Button> or <Input> from @/ui / @/components/ui).
- AST-002 (RAW-CURRENCY-FORMAT): Raw currency string formatting (Rp { or $ outside of <PriceTag />).
- AST-003 (UNCONSTRAINED-FLEX-ROW): Unconstrained flex rows with dynamic text without truncate / min-w-0 / sub-containers.
- AST-004 (STATIC-PAX-TEXT): Table cards rendering static Pax text instead of dynamic seatedGuests/maxCapacity via <CapacityBadge />.
"""

import os
import sys
import glob
import re
import json
from dataclasses import dataclass, field, asdict
from typing import List, Dict, Tuple, Optional, Any

try:
    from .base import PillarResult
except ImportError:
    from base import PillarResult

@dataclass
class ASTViolation:
    rule_id: str
    file_path: str
    line_number: int
    message: str
    suggested_fix: str
    snippet: str = ""

# Canonical rules catalog
RULES_CATALOG = {
    "AST-001": {
        "name": "RAW-BUTTON-INPUT",
        "description": "Raw <button> or <input> elements in Tier 3/4/5/6 components must use accessible <Button> or <Input> from @/ui",
        "severity": "WARNING"
    },
    "AST-002": {
        "name": "RAW-CURRENCY-FORMAT",
        "description": "Raw currency string templates (Rp { or $) outside of <PriceTag /> or monetary formatters",
        "severity": "WARNING"
    },
    "AST-003": {
        "name": "UNCONSTRAINED-FLEX-ROW",
        "description": "Unconstrained flex rows with dynamic text without truncate / min-w-0 / sub-containers",
        "severity": "WARNING"
    },
    "AST-004": {
        "name": "STATIC-PAX-TEXT",
        "description": "Table cards rendering static Pax text instead of dynamic seatedGuests/maxCapacity via <CapacityBadge />",
        "severity": "WARNING"
    }
}

def get_tier(rel_path: str) -> Optional[int]:
    """Classifies file into 6 canonical tiers."""
    p = rel_path.replace("\\", "/")
    if p.startswith("src/tests/") or p.endswith(".stories.tsx") or p.endswith(".d.ts"):
        return None
    if p == "src/index.css" or p.startswith("src/types/") or p.startswith("src/lib/") or p.startswith("src/utils/") or p.startswith("src/i18n/") or p.startswith("src/data/"):
        return 1
    if p.startswith("src/ui/") or p.startswith("src/components/ui/"):
        return 2
    if p.startswith("src/components/shared/") or p.startswith("src/components/common/") or p.startswith("src/context/") or p.startswith("src/hooks/") or p.startswith("src/services/") or p.startswith("src/sdk/"):
        return 3
    if p.startswith("src/components/"):
        return 4
    if p.startswith("src/layouts/"):
        return 5
    if p.startswith("src/views/") or p == "src/App.tsx" or p == "src/main.tsx":
        return 6
    return None

class ASTScanner:
    def __init__(self, root_dir: Optional[str] = None):
        if root_dir is None:
            root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.root_dir = root_dir
        self.src_dir = os.path.join(self.root_dir, "src")

    def scan_file(self, rel_path: str) -> List[ASTViolation]:
        """Scans a single file for all AST invariant rules."""
        full_path = os.path.join(self.root_dir, rel_path)
        if not os.path.exists(full_path):
            return []

        tier = get_tier(rel_path)
        is_test_or_story = "src/tests/" in rel_path or rel_path.endswith(".stories.tsx") or rel_path.endswith(".d.ts")
        if is_test_or_story:
            return []

        violations: List[ASTViolation] = []

        try:
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                lines = f.readlines()
        except Exception:
            return []

        # 1. Rule AST-001: Raw <button> or <input> in Tier 3/4/5/6 components
        if tier and tier >= 3:
            for idx, line in enumerate(lines, start=1):
                stripped = line.strip()
                if stripped.startswith("//") or stripped.startswith("/*") or stripped.startswith("*"):
                    continue
                raw_btn_match = re.search(r"<(button|input)\b([^>]*)>", line)
                if raw_btn_match:
                    tag_name = raw_btn_match.group(1)
                    violations.append(ASTViolation(
                        rule_id="AST-001",
                        file_path=rel_path,
                        line_number=idx,
                        message=f"Raw <{tag_name}> in Tier {tier} component '{rel_path}'",
                        suggested_fix=f"Replace <{tag_name}> with accessible <{tag_name.capitalize()}> from @/ui or @/components/ui",
                        snippet=stripped
                    ))

        # 2. Rule AST-002: Raw currency string formatting outside of <PriceTag /> or formatPrice
        is_currency_util = (
            "src/utils/currencyFormatter" in rel_path or
            "src/ui/PriceTag" in rel_path or
            "src/i18n/" in rel_path or
            "src/data/" in rel_path or
            "src/context/LanguageContext" in rel_path
        )
        if not is_currency_util:
            currency_pattern = re.compile(r"""(?:Rp\.?\s*\{|Rp\.?\s*\$\{|\$\{[^}]*price[^}]*\}|Rp\s+[0-9]{1,3}(?:\.[0-9]{3})+|\bIDR\s+[0-9])""")
            for idx, line in enumerate(lines, start=1):
                stripped = line.strip()
                if stripped.startswith("//") or stripped.startswith("/*") or stripped.startswith("*"):
                    continue
                if "<PriceTag" in line or "formatPrice" in line or "formatCompactPrice" in line:
                    continue
                m = currency_pattern.search(line)
                if m:
                    violations.append(ASTViolation(
                        rule_id="AST-002",
                        file_path=rel_path,
                        line_number=idx,
                        message=f"Raw currency string formatting '{m.group(0)}' outside of <PriceTag />",
                        suggested_fix="Use <PriceTag amount={...} /> or formatPrice() utility to enforce tabular-nums",
                        snippet=stripped
                    ))

        # 3. Rule AST-003: Unconstrained flex rows with dynamic text without truncate / min-w-0 / sub-containers
        # Ignore Tier 1/2 primitives which have self-contained width bounds
        if tier and tier >= 3:
            for idx, line in enumerate(lines, start=1):
                stripped = line.strip()
                if stripped.startswith("//") or stripped.startswith("/*") or stripped.startswith("*"):
                    continue
                # Match horizontal unconstrained flex rows that render unconstrained dynamic variable text
                if (
                    "flex" in line and
                    "flex-col" not in line and
                    "min-w-0" not in line and
                    "truncate" not in line and
                    "overflow-hidden" not in line and
                    "shrink-0" not in line
                ):
                    # Check if line contains unconstrained dynamic variable interpolation
                    var_match = re.search(r"<(?:span|div|p|h\d)[^>]*>\{([a-zA-Z0-9_.]+(?:name|title|guest|customer|item)[a-zA-Z0-9_.]*)\}</(?:span|div|p|h\d)>", line, re.IGNORECASE)
                    if var_match:
                        violations.append(ASTViolation(
                            rule_id="AST-003",
                            file_path=rel_path,
                            line_number=idx,
                            message=f"Unconstrained dynamic text '{{{var_match.group(1)}}}' lacks 'truncate' / 'min-w-0' spatial isolation",
                            suggested_fix="Wrap in a sub-container with 'min-w-0' and 'truncate' to prevent DOM text collision",
                            snippet=stripped
                        ))

        # 4. Rule AST-004: Table cards rendering static Pax text instead of dynamic seatedGuests/maxCapacity via <CapacityBadge />
        if "src/components/tables/" in rel_path or "TableCard" in rel_path:
            static_pax_re = re.compile(r"""(?:>\s*\d+\s*(?:Pax|pax|Kursi|kursi)\s*<|['"`]\d+\s*(?:Pax|pax|Kursi|kursi)['"`])""")
            for idx, line in enumerate(lines, start=1):
                stripped = line.strip()
                if stripped.startswith("//") or stripped.startswith("/*") or stripped.startswith("*"):
                    continue
                if "<CapacityBadge" in line:
                    continue
                m = static_pax_re.search(line)
                if m:
                    violations.append(ASTViolation(
                        rule_id="AST-004",
                        file_path=rel_path,
                        line_number=idx,
                        message=f"Table card renders static capacity text '{m.group(0)}' instead of dynamic CapacityBadge",
                        suggested_fix="Use <CapacityBadge seatedGuests={table.seatedGuests} maxCapacity={table.capacity} />",
                        snippet=stripped
                    ))

        return violations

    def scan_all(self, target_rule: Optional[str] = None) -> List[ASTViolation]:
        """Scans all TypeScript source files across the workspace."""
        all_files = sorted([
            os.path.relpath(p, self.root_dir).replace("\\", "/")
            for p in glob.glob(os.path.join(self.src_dir, "**", "*.*"), recursive=True)
            if (p.endswith(".ts") or p.endswith(".tsx")) and not p.endswith(".d.ts")
        ])

        violations: List[ASTViolation] = []
        for rel_path in all_files:
            v_list = self.scan_file(rel_path)
            if target_rule:
                v_list = [v for v in v_list if v.rule_id == target_rule.upper()]
            violations.extend(v_list)

        return violations

def scan_ast(root_dir: Optional[str] = None, target_rule: Optional[str] = None) -> Tuple[List[ASTViolation], Dict[str, Any]]:
    """Helper function to execute AST scan and aggregate metrics."""
    scanner = ASTScanner(root_dir=root_dir)
    violations = scanner.scan_all(target_rule=target_rule)

    stats: Dict[str, Any] = {
        "scanned_files": 0,
        "rules_evaluated": len(RULES_CATALOG),
        "total_violations": len(violations),
        "by_rule": {}
    }

    for rid in RULES_CATALOG:
        stats["by_rule"][rid] = sum(1 for v in violations if v.rule_id == rid)

    all_files = [
        p for p in glob.glob(os.path.join(scanner.src_dir, "**", "*.*"), recursive=True)
        if (p.endswith(".ts") or p.endswith(".tsx")) and not p.endswith(".d.ts")
    ]
    stats["scanned_files"] = len(all_files)

    return violations, stats

def audit(root_dir: Optional[str] = None) -> PillarResult:
    """Audit function integrating AST Scanner into Radar Pillar results."""
    violations, stats = scan_ast(root_dir=root_dir)

    summary = [
        f"• AST Pattern Scanner:      {stats['scanned_files']} files scanned across 4 structural invariant rules",
        f"• Rule AST-001 (Buttons):   {stats['by_rule']['AST-001']} raw elements cataloged in higher tiers",
        f"• Rule AST-002 (Currency):  {stats['by_rule']['AST-002']} unformatted monetary strings",
        f"• Rule AST-003 (Flex Grid): {stats['by_rule']['AST-003']} unconstrained dynamic flex rows",
        f"• Rule AST-004 (Capacity):  {stats['by_rule']['AST-004']} static pax labels in table cards",
    ]

    # For radar audit health, critical structural invariant checks (Capacity & Flex Collisions) are enforced
    critical_gaps = [
        f"[{v.rule_id}] {v.file_path}:{v.line_number} -> {v.message}"
        for v in violations
        if v.rule_id in ("AST-003", "AST-004")
    ]

    is_healthy = len(critical_gaps) == 0
    if is_healthy:
        summary.append("✅ AST Structural Pattern Invariants: 100% Compliant (0 Spatial Collisions)")
    else:
        summary.append(f"⚠️ Found {len(critical_gaps)} critical AST structural drift violation(s)")

    return PillarResult(
        pillar_id=3,
        title="AST STRUCTURAL PATTERN & DEFENSIVE UI INVARIANTS GATE",
        is_healthy=is_healthy,
        summary_lines=summary,
        gaps=critical_gaps,
        metadata=stats
    )

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="HFE-POS AST Structural Drift & Defensive UI Pattern Scanner")
    parser.add_argument("--json", action="store_true", help="Output violations as JSON")
    parser.add_argument("--rule", "-r", type=str, default=None, help="Filter by Rule ID (e.g. AST-001, AST-002, AST-003, AST-004)")
    parser.add_argument("--file", "-f", type=str, default=None, help="Scan a specific file")
    args = parser.parse_args()

    scanner = ASTScanner()
    if args.file:
        v_list = scanner.scan_file(args.file)
        if args.rule:
            v_list = [v for v in v_list if v.rule_id == args.rule.upper()]
        stats = {"scanned_files": 1, "total_violations": len(v_list)}
    else:
        v_list, stats = scan_ast(target_rule=args.rule)

    if args.json:
        payload = {
            "version": "1.0.0",
            "stats": stats,
            "violations": [asdict(v) for v in v_list]
        }
        print(json.dumps(payload, indent=2))
        sys.exit(0)

    print("\n" + "=" * 80)
    print(" 🔬 HFE-POS AST STRUCTURAL PATTERN SCANNER (hfex-rad0)")
    print("=" * 80)
    print(f" Files Scanned:      {stats.get('scanned_files', len(v_list))}")
    print(f" Total Violations:   {len(v_list)}")
    print("-" * 80)

    for v in v_list[:20]:
        print(f" • [{v.rule_id}] {v.file_path}:{v.line_number}")
        print(f"   Message: {v.message}")
        print(f"   Fix:     {v.suggested_fix}")
        if v.snippet:
            print(f"   Snippet: {v.snippet[:100]}")
        print()

    if len(v_list) > 20:
        print(f" ... and {len(v_list) - 20} more violation(s). Use --json to view all.")
    print("=" * 80 + "\n")
    sys.exit(0)
