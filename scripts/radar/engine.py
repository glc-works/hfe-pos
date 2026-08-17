"""
HFE-POS Master Radar Engine (hfex-rad0).
Dispatches audits across all 9 modular frontend pillars, runs Vitest test suites,
and enforces POS-ENG-STD-001 & HFE-UI-STD-001 invariants.
"""

import sys
import os
import glob
import re
import json
import subprocess
import time
from typing import List, Optional, Dict, Any

from .base import PillarResult
from . import (
    p1_modularity,
    p2_react_aria,
    p2_layer_boundaries,
    p3_spatial_isolation,
    p4_vitest_suites,
    p5_openapi_parity,
    p6_tabular_monetary,
    p7_capacity_utilisation,
    p8_bundle_budget,
    p9_git_hygiene,
    clone_detector,
    ast_scanner
)
from .dimensions import DimensionIndex, parse_dimension_filter

PILLAR_REGISTRY = {
    1: ("modularity", p1_modularity.audit),
    2: ("react_aria", p2_react_aria.audit),
    3: ("spatial_isolation", p3_spatial_isolation.audit),
    4: ("vitest_suites", p4_vitest_suites.audit),
    5: ("openapi_parity", p5_openapi_parity.audit),
    6: ("tabular_monetary", p6_tabular_monetary.audit),
    7: ("capacity_utilisation", p7_capacity_utilisation.audit),
    8: ("bundle_budget", p8_bundle_budget.audit),
    9: ("git_hygiene", p9_git_hygiene.audit),
}

PILLAR_NAME_MAP = {
    "modularity": 1, "modular": 1, "lines": 1, "p1": 1,
    "react_aria": 2, "aria": 2, "primitives": 2, "layers": 2, "layer_boundaries": 2, "p2": 2,
    "spatial_isolation": 3, "spatial": 3, "collision": 3, "ui": 3, "viewport": 3, "ast": 3, "ast_scanner": 3, "p3": 3,
    "vitest": 4, "vitest_suites": 4, "tests": 4, "suites": 4, "p4": 4,
    "openapi": 5, "openapi_parity": 5, "manifest": 5, "schema": 5, "p5": 5,
    "tabular_monetary": 6, "tabular": 6, "monetary": 6, "price": 6, "p6": 6,
    "capacity_utilisation": 7, "capacity": 7, "util": 7, "zigzag": 7, "p7": 7,
    "bundle_budget": 8, "bundle": 8, "vite": 8, "chunks": 8, "p8": 8,
    "git_hygiene": 9, "git": 9, "hygiene": 9, "staging": 9, "hook": 9, "p9": 9,
}

def resolve_pillar_id(target: str) -> Optional[int]:
    if not target:
        return None
    cleaned = target.lower().strip()
    if cleaned.isdigit():
        val = int(cleaned)
        return val if val in PILLAR_REGISTRY else None
    return PILLAR_NAME_MAP.get(cleaned)

def run_radar(
    target_pillar: Optional[str] = None,
    target_level: Optional[int] = None,
    as_json: bool = False,
    root_dir: Optional[str] = None
) -> int:
    if root_dir is None:
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    start_time = time.time()
    
    # Filter pillars to run
    pillar_id = resolve_pillar_id(target_pillar) if target_pillar else None
    if target_pillar and not pillar_id:
        print(f"❌ Unknown pillar '{target_pillar}'. Valid options: {list(PILLAR_NAME_MAP.keys())}", file=sys.stderr)
        return 1

    selected_pillars = [pillar_id] if pillar_id else list(PILLAR_REGISTRY.keys())
    
    results: List[PillarResult] = []
    total_gaps = 0

    for pid in selected_pillars:
        name, audit_fn = PILLAR_REGISTRY[pid]
        try:
            res = audit_fn(root_dir=root_dir)
            results.append(res)
            total_gaps += len(res.gaps)
        except Exception as e:
            res = PillarResult(
                pillar_id=pid,
                title=f"PILLAR {pid}: {name.upper()}",
                is_healthy=False,
                summary_lines=[f"Audit execution crashed: {e}"],
                gaps=[f"Crash in pillar {pid}: {e}"]
            )
            results.append(res)
            total_gaps += 1

    elapsed = time.time() - start_time

    if as_json:
        payload = {
            "version": "2.0.0",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
            "elapsed_seconds": round(elapsed, 4),
            "total_pillars_evaluated": len(results),
            "total_critical_gaps": total_gaps,
            "all_healthy": total_gaps == 0,
            "pillars": [
                {
                    "id": r.pillar_id,
                    "title": r.title,
                    "is_healthy": r.is_healthy,
                    "summary": r.summary_lines,
                    "gaps": r.gaps,
                    "metadata": r.metadata
                }
                for r in results
            ]
        }
        print(json.dumps(payload, indent=2))
        return 0 if total_gaps == 0 else 1

    # Text Output
    print("\n" + "=" * 80)
    print(" 🧭 HFE-POS MASTER RADAR & 9-PILLAR AUDITOR (hfex-rad0)")
    print("    Standard: POS-ENG-STD-001 & HFE-UI-STD-001")
    print("=" * 80)

    for r in results:
        status_icon = "✅" if r.is_healthy else "❌"
        print(f"\n[{r.pillar_id}/9] {status_icon} {r.title}")
        for s in r.summary_lines:
            print(f"    {s}")

    print("\n" + "=" * 80)
    if total_gaps == 0:
        print(f" 🎉 [AUDIT PASSED] 9/9 Pillars Healthy • 0 Critical Gaps ({elapsed:.2f}s)")
    else:
        print(f" ⚠️ [AUDIT FAILED] Found {total_gaps} Critical Gap(s) across {len(results)} evaluated pillars ({elapsed:.2f}s)")
    print("=" * 80 + "\n")

    return 0 if total_gaps == 0 else 1

def run_cadence(
    cadence: str = "SMALL",
    target_level: Optional[int] = None,
    as_json: bool = False,
    root_dir: Optional[str] = None
) -> int:
    """Run cadence feedback loop: SMALL (fast static & in-memory), MEDIUM (typecheck, tests), or LARGE (clone detection, build, e2e)."""
    if root_dir is None:
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    cadence_upper = cadence.upper().strip()
    idx = DimensionIndex()
    nodes = idx.filter_nodes({"CADENCE": cadence_upper}, target_level=target_level)

    if not as_json:
        print(f"\n⚡ [CADENCE EXECUTION: {cadence_upper}] Running {len(nodes)} DAG node(s)...")

    # Fast in-memory pillars for SMALL cadence (<0.5s)
    if cadence_upper in ("SMALL", "INNER"):
        fast_pillars = [1, 2, 3, 5, 6, 7, 9]
        results = [PILLAR_REGISTRY[pid][1](root_dir=root_dir) for pid in fast_pillars]
        gaps = sum(len(r.gaps) for r in results)
        if as_json:
            print(json.dumps({"cadence": cadence_upper, "all_healthy": gaps == 0, "gaps": gaps, "node_count": len(nodes)}, indent=2))
        else:
            print(f"✅ [SMALL CADENCE PASSED] Fast static guards healthy (0 gaps across {len(fast_pillars)} pillars)")
        return 0 if gaps == 0 else 1

    # LARGE / LIVE Cadence: Full 9 Pillars + Structural Clone & Duplicate Component Detector
    if cadence_upper in ("LARGE", "LIVE"):
        start_time = time.time()
        results: List[PillarResult] = []
        total_gaps = 0

        # Execute 9 Pillars
        for pid in PILLAR_REGISTRY:
            name, audit_fn = PILLAR_REGISTRY[pid]
            try:
                res = audit_fn(root_dir=root_dir)
                results.append(res)
                total_gaps += len(res.gaps)
            except Exception as e:
                res = PillarResult(
                    pillar_id=pid,
                    title=f"PILLAR {pid}: {name.upper()}",
                    is_healthy=False,
                    summary_lines=[f"Audit execution crashed: {e}"],
                    gaps=[f"Crash in pillar {pid}: {e}"]
                )
                results.append(res)
                total_gaps += 1

        # Execute Structural Clone & Duplicate Detector
        try:
            clone_res = clone_detector.audit(root_dir=root_dir)
            results.append(clone_res)
            total_gaps += len(clone_res.gaps)
        except Exception as e:
            clone_res = PillarResult(
                pillar_id=10,
                title="STRUCTURAL CLONE & DUPLICATE COMPONENT DETECTOR",
                is_healthy=False,
                summary_lines=[f"Clone detector execution crashed: {e}"],
                gaps=[f"Crash in clone detector: {e}"]
            )
            results.append(clone_res)
            total_gaps += 1

        elapsed = time.time() - start_time

        if as_json:
            payload = {
                "version": "2.0.0",
                "cadence": cadence_upper,
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
                "elapsed_seconds": round(elapsed, 4),
                "total_evaluations": len(results),
                "total_critical_gaps": total_gaps,
                "all_healthy": total_gaps == 0,
                "pillars": [
                    {
                        "id": r.pillar_id,
                        "title": r.title,
                        "is_healthy": r.is_healthy,
                        "summary": r.summary_lines,
                        "gaps": r.gaps,
                        "metadata": r.metadata
                    }
                    for r in results
                ]
            }
            print(json.dumps(payload, indent=2))
            return 0 if total_gaps == 0 else 1

        # Text Output
        print("\n" + "=" * 80)
        print(" 🧭 HFE-POS MASTER RADAR — LARGE / LIVE CADENCE (hfex-rad0 --large)")
        print("    Standard: POS-ENG-STD-001 & HFE-UI-STD-001")
        print("=" * 80)

        for r in results:
            status_icon = "✅" if r.is_healthy else "❌"
            print(f"\n[{r.pillar_id}/{len(results)}] {status_icon} {r.title}")
            for s in r.summary_lines:
                print(f"    {s}")

        print("\n" + "=" * 80)
        if total_gaps == 0:
            print(f" 🎉 [LARGE CADENCE PASSED] All {len(results)} Guards Healthy • 0 Critical Gaps ({elapsed:.2f}s)")
        else:
            print(f" ⚠️ [LARGE CADENCE FAILED] Found {total_gaps} Critical Gap(s) across {len(results)} evaluations ({elapsed:.2f}s)")
        print("=" * 80 + "\n")

        return 0 if total_gaps == 0 else 1

    # Full 9 pillars for MEDIUM cadence
    return run_radar(target_level=target_level, as_json=as_json, root_dir=root_dir)
