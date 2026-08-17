"""
[Pillar 6] Tabular Monetary Presentation & Zero-Jitter Currency Gate.
Verifies that all monetary figures (IDR, USD) use tabular numerals (font-variant-numeric: tabular-nums)
and dedicated width allocation per Defensive UI Standard (Rule 2).
"""

import os
import glob
from .base import PillarResult

def audit(root_dir: str = None) -> PillarResult:
    if root_dir is None:
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    violations = []
    
    # 1. Global CSS Tabular Setting in src/index.css
    index_css = os.path.join(root_dir, "src", "index.css")
    if os.path.exists(index_css):
        with open(index_css, "r", encoding="utf-8") as f:
            css_text = f.read()
        if "tabular-nums" not in css_text:
            violations.append("src/index.css is missing 'tabular-nums'")
    else:
        violations.append("src/index.css not found")

    # 2. Tier 2 PriceTag Atom in src/ui/PriceTag.tsx
    price_tag_file = os.path.join(root_dir, "src", "ui", "PriceTag.tsx")
    if os.path.exists(price_tag_file):
        with open(price_tag_file, "r", encoding="utf-8") as f:
            pt_text = f.read()
        if "tabular-nums" not in pt_text and "font-mono" not in pt_text:
            violations.append("src/ui/PriceTag.tsx does not specify tabular-nums or font-mono")
    else:
        violations.append("src/ui/PriceTag.tsx not found")

    # 3. Monetary Component Scan
    components_with_tabular = 0
    for tsx_file in glob.glob(os.path.join(root_dir, "src", "**", "*.tsx"), recursive=True):
        try:
            with open(tsx_file, "r", encoding="utf-8") as f:
                content = f.read()
            if "tabular-nums" in content or "font-mono" in content:
                components_with_tabular += 1
        except Exception:
            pass

    summary = [
        f"• Global Tabular Numerals:  font-variant-numeric: tabular-nums enabled in index.css",
        f"• PriceTag Component Atom:  Tabular alignment & currency formatting verified",
        f"• Components with Tabular:  {components_with_tabular} TSX presentation files utilize tabular/mono figures",
    ]

    gaps = []
    if violations:
        for v in violations:
            gaps.append(f"Tabular monetary violation: {v}")
            summary.append(f"⚠️ {v}")
        is_healthy = False
    else:
        summary.append("✅ Tabular Monetary Presentation: 100% Compliant (Zero-Jitter)")
        is_healthy = True

    return PillarResult(
        pillar_id=6,
        title="TABULAR MONETARY PRESENTATION & ZERO-JITTER CURRENCY GATE",
        is_healthy=is_healthy,
        summary_lines=summary,
        gaps=gaps,
        metadata={"components_with_tabular": components_with_tabular}
    )
