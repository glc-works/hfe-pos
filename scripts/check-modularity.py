#!/usr/bin/env python3
"""
check-modularity.py — Modularity Guard for Hfe POS

Scans TypeScript (.ts, .tsx) files in src/ to ensure no file exceeds
the 500-line threshold defined in POS-ENG-STD-001 (Rule 1).
"""

import argparse
import os
import sys

MAX_LINE_LIMIT = 500
EXCLUDE_DIRS = {"node_modules", "dist", ".git", ".storybook"}


def check_modularity(target_dir: str, max_lines: int) -> int:
    violations = []
    scanned_files = 0

    if not os.path.exists(target_dir):
        print(f"[MODULARITY ERROR] Target directory '{target_dir}' does not exist.", file=sys.stderr)
        return 1

    for root, dirs, files in os.walk(target_dir):
        # Skip excluded directories in-place
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

        for file_name in files:
            if (file_name.endswith(".ts") or file_name.endswith(".tsx")) and not file_name.endswith(".d.ts"):
                scanned_files += 1
                full_path = os.path.join(root, file_name)
                try:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        line_count = len(f.readlines())
                    if line_count > max_lines:
                        violations.append((full_path, line_count))
                except Exception as e:
                    print(f"[MODULARITY WARNING] Failed to read {full_path}: {e}", file=sys.stderr)

    print(f"Scanned {scanned_files} TypeScript file(s) in '{target_dir}'.")

    if violations:
        print(f"\n[MODULARITY FAIL] {len(violations)} file(s) exceed maximum limit of {max_lines} lines:\n")
        for filepath, count in violations:
            print(f"  - {filepath}: {count} lines (limit: {max_lines})")
        print("\nRule 1 Violation (POS-ENG-STD-001): Split large files into focused domain modules.")
        return 1

    print(f"[MODULARITY PASSED] All scanned files are within the {max_lines}-line threshold.")
    return 0


def main():
    parser = argparse.ArgumentParser(description="Check TypeScript modularity line limit guard.")
    parser.add_argument("--dir", default="src", help="Directory to scan (default: src)")
    parser.add_argument(
        "--max-lines",
        type=int,
        default=MAX_LINE_LIMIT,
        help=f"Max line limit (default: {MAX_LINE_LIMIT})",
    )
    args = parser.parse_args()

    sys.exit(check_modularity(args.dir, args.max_lines))


if __name__ == "__main__":
    main()
