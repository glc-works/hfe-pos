#!/usr/bin/env python3
"""
[Story Sync Sentinel] Storybook Living Scenario Stories & 4-Quadrant Visual Suite Auditor.
Standard: POS-ENG-STD-001 & HFE-UI-STD-001 Wave 4 Storybook Integration.
Verifies:
1. Scenario ID & CoA Preset parameter bindings.
2. Mandatory 4-Quadrant dynamic content stress matrix exports (Q1 Empty, Q2 Short, Q3 1Billion Overflow, Q4 Multi-State).
3. Interactive play() function presence for step-by-step cashier & accounting workflow simulation.
"""

import os
import sys
import glob
import re
import argparse
import json
from typing import Dict, List, Any, Optional

try:
    from .base import PillarResult
except ImportError:
    try:
        from base import PillarResult
    except ImportError:
        # Fallback standalone PillarResult dataclass
        from dataclasses import dataclass, field
        @dataclass
        class PillarResult:
            pillar_id: int
            title: str
            is_healthy: bool
            summary_lines: List[str] = field(default_factory=list)
            gaps: List[str] = field(default_factory=list)
            metadata: Dict[str, Any] = field(default_factory=dict)

EXPECTED_QUADRANTS = ["EmptyState", "ShortInitialState", "ExtremeOverflow1Billion"]

def scan_story_scenarios(root_dir: Optional[str] = None) -> Dict[str, Any]:
    if root_dir is None:
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    scenarios_dir = os.path.join(root_dir, "src", "stories", "scenarios")
    onboarding_dir = os.path.join(root_dir, "src", "stories", "onboarding")

    scenario_files = sorted(glob.glob(os.path.join(scenarios_dir, "*.stories.tsx")))
    onboarding_files = sorted(glob.glob(os.path.join(onboarding_dir, "*.stories.tsx")))

    scenarios = []
    gaps = []

    for sf in scenario_files:
        rel_path = os.path.relpath(sf, root_dir).replace("\\", "/")
        try:
            with open(sf, "r", encoding="utf-8") as f:
                content = f.read()

            # 1. Scenario ID binding check
            scenario_match = re.search(r"scenarioId:\s*['\"]([^'\"]+)['\"]", content)
            scenario_id = scenario_match.group(1) if scenario_match else None

            # 2. Preset binding check
            preset_match = re.search(r"preset:\s*['\"]([^'\"]+)['\"]", content)
            preset_id = preset_match.group(1) if preset_match else None

            # 3. 4 Quadrant exports check
            exported_quadrants = []
            if "export const EmptyState" in content:
                exported_quadrants.append("EmptyState (Q1)")
            if "export const ShortInitialState" in content:
                exported_quadrants.append("ShortInitialState (Q2)")
            if "export const ExtremeOverflow1Billion" in content:
                exported_quadrants.append("ExtremeOverflow1Billion (Q3)")
            
            # Q4 Multi-State
            q4_match = re.findall(r"export const (MultiState\w*)", content)
            if q4_match:
                for q4 in q4_match:
                    exported_quadrants.append(f"{q4} (Q4)")

            # 4. Interactive play() function check
            has_play_fn = "play:" in content or "play =" in content

            file_gaps = []
            if not scenario_id:
                file_gaps.append(f"Missing parameter binding 'scenarioId' in {rel_path}")
            if not preset_id:
                file_gaps.append(f"Missing parameter binding 'preset' in {rel_path}")
            if len(exported_quadrants) < 4:
                file_gaps.append(f"Incomplete 4-Quadrant suite (found {len(exported_quadrants)}/4) in {rel_path}")
            if not has_play_fn:
                file_gaps.append(f"Missing interactive play() function in {rel_path}")

            scenarios.append({
                "file": rel_path,
                "scenario_id": scenario_id,
                "preset_id": preset_id,
                "quadrants": exported_quadrants,
                "has_play_fn": has_play_fn,
                "gaps": file_gaps
            })

            gaps.extend(file_gaps)

        except Exception as e:
            gaps.append(f"Error reading {rel_path}: {str(e)}")

    return {
        "scenario_files_count": len(scenario_files),
        "onboarding_files_count": len(onboarding_files),
        "scenarios": scenarios,
        "gaps": gaps,
        "is_healthy": len(gaps) == 0 and len(scenario_files) >= 3
    }

def audit(root_dir: Optional[str] = None) -> PillarResult:
    if root_dir is None:
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    data = scan_story_scenarios(root_dir)
    
    summary = [
        f"• Storybook Scenarios:      {data['scenario_files_count']} living scenario stories scanned in src/stories/scenarios/",
        f"• Onboarding Stories:       {data['onboarding_files_count']} onboarding & settings suites scanned in src/stories/onboarding/",
    ]

    for sc in data["scenarios"]:
        status_symbol = "✅" if len(sc["gaps"]) == 0 else "❌"
        summary.append(
            f"  {status_symbol} {sc['scenario_id'] or 'UNKNOWN'} ({sc['preset_id'] or 'NO_PRESET'}): "
            f"{len(sc['quadrants'])}/4 Quadrants, play() {'Active' if sc['has_play_fn'] else 'Missing'}"
        )

    gaps = data["gaps"]
    if data["scenario_files_count"] < 3:
        gaps.append(f"Expected at least 3 scenario stories, found {data['scenario_files_count']}")

    is_healthy = len(gaps) == 0

    if is_healthy:
        summary.append("✅ Storybook Living Scenario Stories: 100% Compliant (4-Quadrant Suite Active)")
    else:
        summary.append(f"⚠️ {len(gaps)} Storybook scenario parity gap(s) detected")

    return PillarResult(
        pillar_id=4,
        title="STORYBOOK LIVING SCENARIO & 4-QUADRANT VISUAL SUITE GATE",
        is_healthy=is_healthy,
        summary_lines=summary,
        gaps=gaps,
        metadata=data
    )

def main():
    parser = argparse.ArgumentParser(description="Storybook Living Scenario & 4-Quadrant Visual Suite Auditor")
    parser.add_argument("--audit", action="store_true", help="Run full Storybook scenarios audit")
    parser.add_argument("--json", action="store_true", help="Output machine-readable JSON")
    args = parser.parse_args()

    res = audit()

    if args.json:
        print(json.dumps({
            "healthy": res.is_healthy,
            "title": res.title,
            "summary": res.summary_lines,
            "gaps": res.gaps,
            "metadata": res.metadata
        }, indent=2))
        sys.exit(0 if res.is_healthy else 1)

    status_icon = "✅" if res.is_healthy else "❌"
    print(f"\n{status_icon} {res.title}")
    for line in res.summary_lines:
        print(f"  {line}")
    print()

    sys.exit(0 if res.is_healthy else 1)

if __name__ == "__main__":
    main()
