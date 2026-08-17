"""
CORE.Hfeit Radar Base Module for HFE-POS (hfex-rad0) — Types, Containers, and Helpers.
"""

import os
import subprocess
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any

@dataclass
class PillarResult:
    pillar_id: int
    title: str
    is_healthy: bool
    summary_lines: List[str] = field(default_factory=list)
    gaps: List[str] = field(default_factory=list)
    notices: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

def run_quiet(cmd: str, cwd: Optional[str] = None) -> Optional[str]:
    """Execute command silently and return stdout trimmed."""
    try:
        return subprocess.check_output(cmd, shell=True, cwd=cwd, stderr=subprocess.DEVNULL).decode('utf-8').strip()
    except Exception:
        return None
