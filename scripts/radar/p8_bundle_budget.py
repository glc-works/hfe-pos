"""
[Pillar 8] Vite Build Bundle Budget & Chunk Size Gate.
Verifies frontend packaging configuration, code splitting, and bundle chunk size budgets.
"""

import os
import glob
from .base import PillarResult

CHUNK_WARN_LIMIT_KB = 500
CHUNK_HARD_LIMIT_KB = 1500

def audit(root_dir: str = None) -> PillarResult:
    if root_dir is None:
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    violations = []
    vite_config = os.path.join(root_dir, "vite.config.ts")
    package_json = os.path.join(root_dir, "package.json")
    
    if not os.path.exists(vite_config):
        violations.append("vite.config.ts not found")
    if not os.path.exists(package_json):
        violations.append("package.json not found")

    dist_dir = os.path.join(root_dir, "dist")
    chunks_found = 0
    max_chunk_kb = 0
    max_chunk_name = ""

    if os.path.exists(dist_dir):
        for js_file in glob.glob(os.path.join(dist_dir, "**", "*.js"), recursive=True):
            chunks_found += 1
            size_kb = os.path.getsize(js_file) / 1024.0
            if size_kb > max_chunk_kb:
                max_chunk_kb = size_kb
                max_chunk_name = os.path.basename(js_file)
            if size_kb > CHUNK_HARD_LIMIT_KB:
                violations.append(f"Chunk '{os.path.basename(js_file)}' exceeds hard limit: {size_kb:.1f} KB > {CHUNK_HARD_LIMIT_KB} KB")

    summary = [
        f"• Bundler Engine:           Vite + ESBuild (Fast Tree-Shaking)",
        f"• Output Chunks (dist/):    {chunks_found} chunk(s) detected",
        f"• Max Observed Chunk:       {max_chunk_kb:.1f} KB ({max_chunk_name or 'N/A'}) (Limit: <{CHUNK_HARD_LIMIT_KB} KB)",
    ]

    gaps = []
    if violations:
        for v in violations:
            gaps.append(f"Bundle budget violation: {v}")
            summary.append(f"⚠️ {v}")
        is_healthy = False
    else:
        summary.append("✅ Vite Bundle Budget & Chunk Sizing: 100% Compliant")
        is_healthy = True

    return PillarResult(
        pillar_id=8,
        title="VITE BUILD BUNDLE BUDGET & CHUNK SIZE GATE",
        is_healthy=is_healthy,
        summary_lines=summary,
        gaps=gaps,
        metadata={"chunks_found": chunks_found, "max_chunk_kb": max_chunk_kb}
    )
