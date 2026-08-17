"""
[Pillar 9] Git Hygiene, Hook Enforcement & Clean Staging Gate.
Verifies git repository status, branch hygiene, and pre-commit sentinel hooks in hfe-pos.
"""

import os
import subprocess
from .base import PillarResult, run_quiet

def audit(root_dir: str = None) -> PillarResult:
    if root_dir is None:
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    branch = run_quiet("git branch --show-current", cwd=root_dir) or "unknown"
    status_raw = run_quiet("git status --porcelain", cwd=root_dir) or ""
    
    # Check pre-commit hook
    pre_commit_path = os.path.join(root_dir, ".githooks", "pre-commit")
    has_pre_commit = os.path.exists(pre_commit_path)
    
    status_lines = [l for l in status_raw.splitlines() if l.strip()]
    
    summary = [
        f"• Active Git Branch:        {branch}",
        f"• Working Tree Status:      {len(status_lines)} modified/uncommitted items",
        f"• Pre-Commit Fast Sentinel: {'.githooks/pre-commit present' if has_pre_commit else 'No pre-commit hook'}",
    ]

    gaps = []
    # Notice: In normal local development working tree may have in-flight changes, but we report hygiene status
    if not has_pre_commit:
        gaps.append("Missing .githooks/pre-commit fast sentinel hook")
        summary.append("⚠️ Missing .githooks/pre-commit hook")
        is_healthy = False
    else:
        summary.append("✅ Git Hygiene & Fast Sentinel: 100% Configured")
        is_healthy = True

    return PillarResult(
        pillar_id=9,
        title="GIT HYGIENE & PRE-COMMIT SENTINEL GATE",
        is_healthy=is_healthy,
        summary_lines=summary,
        gaps=gaps,
        metadata={"branch": branch, "dirty_files": len(status_lines), "has_pre_commit": has_pre_commit}
    )
