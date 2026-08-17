"""
[Pillar 1] Modularity & Hand-Maintained File Line Budget (<500 lines).
Scans all TypeScript source files in src/ to ensure compliance with POS-ENG-STD-001 (Rule 1).
"""

import os
import glob
from .base import PillarResult

MAX_LINE_LIMIT = 500
EXCLUDE_DIRS = {"node_modules", "dist", ".git", ".storybook"}

def audit(root_dir: str = None) -> PillarResult:
    if root_dir is None:
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    src_dir = os.path.join(root_dir, "src")
    scanned_files = 0
    max_lines = 0
    max_file = ""
    violations = []
    
    if os.path.exists(src_dir):
        for root, dirs, files in os.walk(src_dir):
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            for file_name in files:
                if (file_name.endswith(".ts") or file_name.endswith(".tsx")) and not file_name.endswith(".d.ts"):
                    scanned_files += 1
                    full_path = os.path.join(root, file_name)
                    rel_path = os.path.relpath(full_path, root_dir)
                    try:
                        with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                            lines = len(f.readlines())
                        if lines > max_lines:
                            max_lines = lines
                            max_file = rel_path
                        if lines > MAX_LINE_LIMIT:
                            violations.append((rel_path, lines))
                    except Exception:
                        pass
    
    summary = [
        f"• Source Directory:         src/ ({scanned_files} TypeScript files scanned)",
        f"• Modularity Threshold:     <500 lines (Target: <400 lines)",
        f"• Maximum Observed Lines:   {max_lines} lines ({max_file})",
    ]
    
    gaps = []
    if violations:
        summary.append(f"⚠️ {len(violations)} file(s) exceed 500-line modularity threshold:")
        for vp, vc in violations[:5]:
            summary.append(f"   - {vp}: {vc} lines")
            gaps.append(f"Modularity violation: {vp} ({vc} lines > {MAX_LINE_LIMIT})")
        is_healthy = False
    else:
        summary.append("✅ Modularity Standard: 100% Compliant (0 files exceed 500 lines)")
        is_healthy = True
        
    return PillarResult(
        pillar_id=1,
        title="MODULARITY & SOURCE FILE LINE LIMIT GATE (<500 lines)",
        is_healthy=is_healthy,
        summary_lines=summary,
        gaps=gaps,
        metadata={"scanned_files": scanned_files, "max_lines": max_lines, "violations": len(violations)}
    )
