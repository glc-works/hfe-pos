"""
[Pillar 10] Tooling Health — Script Reference & Skill Command Integrity Gate.
Verifies that all commands referenced in agent skills and launcher scripts
actually resolve to existing files in the repository.
"""

import os
import re
import glob
from .base import PillarResult


def _extract_script_refs(filepath: str) -> list[tuple[str, int, str]]:
    """Extract python3/bash script references from a file, returning (path, line_no, raw_line)."""
    refs = []
    try:
        with open(filepath, "r", encoding="utf-8", errors="replace") as f:
            for line_no, line in enumerate(f, 1):
                # Match: python3 scripts/xxx.py or bash scripts/xxx.sh
                for m in re.finditer(r'(?:python3|bash)\s+(scripts/[\w./-]+\.(?:py|sh))', line):
                    refs.append((m.group(1), line_no, line.strip()))
                # Match: node scripts/xxx.cjs or npx ... scripts/xxx.cjs
                for m in re.finditer(r'(?:node)\s+(scripts/[\w./-]+\.cjs)', line):
                    refs.append((m.group(1), line_no, line.strip()))
    except (OSError, UnicodeDecodeError):
        pass
    return refs


def _is_comment_line(line: str) -> bool:
    """Check if a line is a comment (bash # or markdown annotation)."""
    stripped = line.lstrip()
    return stripped.startswith("#") or stripped.startswith("⚠️") or stripped.startswith("//")


def audit(root_dir: str = None) -> PillarResult:
    if root_dir is None:
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    # Scan sources: agent skills, start.sh, AGENTS.md
    scan_patterns = [
        os.path.join(root_dir, ".agents", "skills", "**", "SKILL.md"),
        os.path.join(root_dir, "scripts", "start.sh"),
        os.path.join(root_dir, "AGENTS.md"),
        os.path.join(root_dir, "CLAUDE.md"),
    ]

    source_files = []
    for pat in scan_patterns:
        source_files.extend(glob.glob(pat, recursive=True))

    broken_refs = []
    annotated_refs = 0
    valid_refs = 0
    total_refs = 0

    for src in source_files:
        refs = _extract_script_refs(src)
        for script_path, line_no, raw_line in refs:
            total_refs += 1
            abs_path = os.path.join(root_dir, script_path)
            if os.path.isfile(abs_path):
                valid_refs += 1
            elif _is_comment_line(raw_line):
                # Engine-only annotated references are acceptable
                annotated_refs += 1
            else:
                rel_src = os.path.relpath(src, root_dir)
                broken_refs.append(f"{rel_src}:{line_no} → {script_path}")

    # Check for naming convention: no hfe-*.py without x (should be hfex-*.py)
    naming_violations = []
    scripts_dir = os.path.join(root_dir, "scripts")
    if os.path.isdir(scripts_dir):
        for entry in os.listdir(scripts_dir):
            if entry.endswith(".py") and entry.startswith("hfe-") and not entry.startswith("hfex-"):
                naming_violations.append(entry)

    # Check for hardcoded absolute paths in shell scripts
    hardcoded_paths = 0
    shell_scripts = glob.glob(os.path.join(scripts_dir, "*.sh")) if os.path.isdir(scripts_dir) else []
    for sh in shell_scripts:
        try:
            with open(sh, "r", encoding="utf-8", errors="replace") as f:
                for line_no, line in enumerate(f, 1):
                    if re.search(r'/Users/\w+/', line) and not line.lstrip().startswith("#"):
                        hardcoded_paths += 1
        except (OSError, UnicodeDecodeError):
            pass

    # Aggregate results
    gaps = []
    for br in broken_refs:
        gaps.append(f"Broken reference: {br}")
    for nv in naming_violations:
        gaps.append(f"Naming violation: scripts/{nv} should use hfex- prefix")
    if hardcoded_paths > 0:
        gaps.append(f"Found {hardcoded_paths} hardcoded absolute path(s) in shell scripts")

    is_healthy = len(gaps) == 0

    summary = [
        f"• Script References Scanned:  {total_refs} across {len(source_files)} source files",
        f"• Valid References:            {valid_refs}",
        f"• Engine-Only (Annotated):     {annotated_refs}",
        f"• Broken References:           {len(broken_refs)}",
        f"• Naming Convention (hfex-*):  {'✅ Clean' if not naming_violations else f'❌ {len(naming_violations)} violation(s)'}",
        f"• Hardcoded Absolute Paths:    {'✅ 0' if hardcoded_paths == 0 else f'❌ {hardcoded_paths}'}",
    ]

    if is_healthy:
        summary.append("✅ Tooling Health & Script Integrity: 100% Compliant")
    else:
        for g in gaps:
            summary.append(f"❌ {g}")

    return PillarResult(
        pillar_id=10,
        title="TOOLING HEALTH & SCRIPT REFERENCE INTEGRITY GATE",
        is_healthy=is_healthy,
        summary_lines=summary,
        gaps=gaps,
        metadata={
            "total_refs": total_refs,
            "valid_refs": valid_refs,
            "annotated_refs": annotated_refs,
            "broken_refs": len(broken_refs),
            "naming_violations": naming_violations,
            "hardcoded_paths": hardcoded_paths,
        }
    )
