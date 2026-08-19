#!/usr/bin/env python3
"""
hfex-rad0 — Master Experience Radar & Diagnostic Orchestrator for hfe-pos.
Evaluates 9 Architectural Pillars, 2D Orthogonal Topological Matrix (Depth x Dimension),
Multi-Cadence Verification Loops (Google Test Size SMALL/MEDIUM/LARGE & INNER/OUTER/LIVE),
and Arbitrary Depth Experience Plans (Level 0 through Level N).
"""

import sys
import os
import argparse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

from radar import (
    run_radar,
    run_cadence,
    render_dimension_matrix,
    query_dimensions,
    generate_ci_matrix,
    print_tools_directory,
    print_plans_directory,
    audit_layer_boundaries,
    audit_ast,
    scan_ast,
    scan_layer_boundaries,
    DIMENSIONS
)

def main():
    parser = argparse.ArgumentParser(
        prog="hfex-rad0",
        description="hfex-rad0 — Hfe POS Master Experience Radar & Diagnostic Orchestrator (Internal Tool)",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "--pillar", "-p",
        type=str,
        default=None,
        help="Filter specific pillar (1..10 or core, pos, order, card, board, book, admin, storybook, parity, tooling)"
    )
    parser.add_argument(
        "--matrix", "-M", "-m",
        action="store_true",
        help="Render 2D Orthogonal Matrix (Topological Depth × Dimension)"
    )
    parser.add_argument(
        "--matrix-by", "-G", "--group-by",
        dest="group_by",
        type=str,
        default=None,
        help=f"Dimension to group 2D matrix by ({', '.join(DIMENSIONS.keys())})"
    )
    parser.add_argument(
        "--dim", "-D",
        type=str,
        default=None,
        help="Multi-dimensional dynamic label query (e.g. --dim PILLAR=POS or --dim SURFACE=MOBILE_360,CADENCE=SMALL)"
    )
    parser.add_argument(
        "--level", "-l",
        type=int,
        default=None,
        help="Filter specific topological level (0 to N, e.g. -l 0 for Master Hub, -l 1 for Pillars, -l 2 for Features)"
    )
    parser.add_argument(
        "--plans", "--list-plans",
        dest="list_plans",
        action="store_true",
        help="Display all indexed Experience Plans (L0..LN arbitrary depth)"
    )
    parser.add_argument(
        "--plan-matrix",
        action="store_true",
        help="Render 2D Orthogonal Matrix exclusively for Experience Plans (L0..LN)"
    )
    parser.add_argument(
        "--cadence", "-c",
        type=str,
        choices=["small", "inner", "medium", "outer", "large", "live"],
        default=None,
        help="Execute specific verification cadence (small/inner, medium/outer, large/live)"
    )
    parser.add_argument(
        "--small",
        action="store_true",
        help="Run Google SMALL / INNER Cadence (<0.5s in-memory static guards: modularity, connector, ui-standards)"
    )
    parser.add_argument(
        "--inner",
        action="store_true",
        help="Alias for --small (Hot development loop in-memory checks)"
    )
    parser.add_argument(
        "--medium", "--mid",
        dest="medium",
        action="store_true",
        help="Run Google MEDIUM / OUTER Cadence (TypeScript typecheck, ESLint, and Vitest unit suites)"
    )
    parser.add_argument(
        "--outer",
        action="store_true",
        help="Alias for --medium (Pre-commit & CI integration checks)"
    )
    parser.add_argument(
        "--large", "-L",
        action="store_true",
        help="Run Google LARGE / LIVE Cadence (Vite production build, Hfe contract sync, Playwright inspection)"
    )
    parser.add_argument(
        "--live",
        action="store_true",
        help="Alias for --large (Live runtime and bundle benchmarks)"
    )
    parser.add_argument(
        "--ci-matrix", "-C",
        action="store_true",
        help="Export GitHub Actions dynamic runner sharding matrix JSON"
    )
    parser.add_argument(
        "--list-tools", "-t",
        action="store_true",
        help="Auto-discover and display all available tools organized by Level (L0 to L5)"
    )
    parser.add_argument(
        "--ast", "--ast-scan",
        dest="ast_scan",
        action="store_true",
        help="Run AST Structural Pattern Scanner (Button, Currency, Flex, Capacity rules)"
    )
    parser.add_argument(
        "--layers", "--layer-boundaries",
        dest="layer_boundaries",
        action="store_true",
        help="Run 6-Tier Monotonic Downward Import Boundary Sentinel"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output results as machine-readable JSON for CI/CD pipelines"
    )

    args = parser.parse_args()

    if args.ast_scan:
        res = audit_ast()
        if args.json:
            import json
            from dataclasses import asdict
            violations, stats = scan_ast()
            print(json.dumps({"healthy": res.is_healthy, "stats": stats, "violations": [asdict(v) for v in violations]}, indent=2))
        else:
            status_icon = "✅" if res.is_healthy else "❌"
            print(f"\n{status_icon} {res.title}")
            for line in res.summary_lines:
                print(f"  {line}")
        sys.exit(0 if res.is_healthy else 1)

    if args.layer_boundaries:
        res = audit_layer_boundaries()
        if args.json:
            import json
            violations, stats = scan_layer_boundaries()
            print(json.dumps({"healthy": res.is_healthy, "stats": stats, "violations": [{"source": v.source_file, "target": v.target_file, "message": v.message} for v in violations]}, indent=2))
        else:
            status_icon = "✅" if res.is_healthy else "❌"
            print(f"\n{status_icon} {res.title}")
            for line in res.summary_lines:
                print(f"  {line}")
        sys.exit(0 if res.is_healthy else 1)

    if args.ci_matrix:
        sys.exit(generate_ci_matrix(as_json=True))

    if args.list_plans:
        sys.exit(print_plans_directory(target_level=args.level, target_pillar=args.pillar, as_json=args.json))

    if args.plan_matrix:
        group_by = args.group_by if args.group_by else "PILLAR"
        sys.exit(render_dimension_matrix(group_by=group_by, as_json=args.json, plan_only=True))

    if args.matrix or args.group_by is not None:
        group_by = args.group_by if args.group_by else "PILLAR"
        sys.exit(render_dimension_matrix(group_by=group_by, as_json=args.json))

    if args.cadence:
        c_map = {"small": "SMALL", "inner": "SMALL", "medium": "MEDIUM", "outer": "MEDIUM", "large": "LARGE", "live": "LARGE"}
        cad_name = c_map.get(args.cadence.lower(), "SMALL")
        sys.exit(run_cadence(cadence=cad_name, target_level=args.level, as_json=args.json))

    if args.small or args.inner:
        sys.exit(run_cadence(cadence="SMALL", target_level=args.level, as_json=args.json))

    if args.medium or args.outer:
        sys.exit(run_cadence(cadence="MEDIUM", target_level=args.level, as_json=args.json))

    if args.large or args.live:
        sys.exit(run_cadence(cadence="LARGE", target_level=args.level, as_json=args.json))

    if args.dim:
        sys.exit(query_dimensions(filter_str=args.dim, target_level=args.level, as_json=args.json))

    if args.list_tools:
        print_tools_directory(as_json=args.json)
        sys.exit(0)

    sys.exit(run_radar(target_pillar=args.pillar, target_level=args.level, as_json=args.json))

if __name__ == "__main__":
    main()
