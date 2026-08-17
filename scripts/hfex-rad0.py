#!/usr/bin/env python3
"""
hfex-rad0 — Master Experience Radar & Diagnostic Orchestrator for hfe-pos.
Evaluates 9 Architectural Pillars, 2D Orthogonal Topological Matrix (Depth x Dimension),
and Multi-Cadence Verification Loops (Google Test Size SMALL/MEDIUM/LARGE & INNER/OUTER/LIVE).
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
        help="Filter specific pillar (1..9 or core, pos, order, card, board, book, admin, storybook, parity)"
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
        help="Multi-dimensional dynamic label query (e.g. --dim PILLAR=CORE,CADENCE=SMALL or --dim SURFACE=CUSTOMER_MOBILE)"
    )
    parser.add_argument(
        "--level", "-l",
        type=int,
        default=None,
        help="Filter specific topological level (0 to 5, e.g. -l 1 for Static Guards, -l 2 for Unit Suites)"
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
        "--json",
        action="store_true",
        help="Output results as machine-readable JSON for CI/CD pipelines"
    )

    args = parser.parse_args()

    if args.ci_matrix:
        sys.exit(generate_ci_matrix(as_json=True))

    if args.matrix or args.group_by is not None:
        group_by = args.group_by if args.group_by else "PILLAR"
        sys.exit(render_dimension_matrix(group_by=group_by, as_json=args.json))

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
