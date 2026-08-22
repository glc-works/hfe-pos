#!/usr/bin/env python3
"""
Test Results 3-Turn Rolling Rotation Manager (Anti-Pileup Invariant)
Retains strictly the last 3 test runs in `test-results/history/`, pruning older runs automatically.
"""

import os
import shutil
import time
from datetime import datetime
from pathlib import Path

MAX_RUNS_RETAINED = 3
PROJECT_ROOT = Path(__file__).resolve().parent.parent
TEST_RESULTS_DIR = PROJECT_ROOT / "test-results"
HISTORY_DIR = TEST_RESULTS_DIR / "history"

def rotate_test_results():
    if not TEST_RESULTS_DIR.exists():
        return

    HISTORY_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Archive current run artifacts
    timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    run_archive_dir = HISTORY_DIR / f"run_{timestamp_str}"
    run_archive_dir.mkdir(exist_ok=True)

    # Move any unarchived test artifact folders
    for item in TEST_RESULTS_DIR.iterdir():
        if item.name != "history" and item.is_dir():
            dest = run_archive_dir / item.name
            shutil.move(str(item), str(dest))

    # Copy playwright report
    report_dir = PROJECT_ROOT / "playwright-report"
    if report_dir.exists():
        shutil.copytree(str(report_dir), str(run_archive_dir / "playwright-report"), dirs_exist_ok=True)

    # 2. Prune old runs, keeping only MAX_RUNS_RETAINED
    all_runs = sorted(
        [d for d in HISTORY_DIR.iterdir() if d.is_dir() and d.name.startswith("run_")],
        key=lambda p: p.stat().st_mtime
    )

    if len(all_runs) > MAX_RUNS_RETAINED:
        runs_to_delete = all_runs[:-MAX_RUNS_RETAINED]
        for old_run in runs_to_delete:
            shutil.rmtree(str(old_run), ignore_errors=True)
            print(f"[Rotation] Pruned old test run: {old_run.name}")

    active_runs = sorted(
        [d for d in HISTORY_DIR.iterdir() if d.is_dir() and d.name.startswith("run_")],
        key=lambda p: p.stat().st_mtime,
        reverse=True
    )

    # 3. Generate summary log
    summary_file = HISTORY_DIR / "SUMMARY.md"
    lines = [
        "# 📜 Test Results Rolling Buffer (Last 3 Turns Retained)",
        "",
        f"> Policy: Max {MAX_RUNS_RETAINED} historical runs kept. Older runs are automatically overwritten.",
        "",
        "| Rank | Run Folder | Created At | Files Stored |",
        "|---|---|---|---|"
    ]

    for idx, run_dir in enumerate(active_runs, 1):
        mtime = datetime.fromtimestamp(run_dir.stat().st_mtime).strftime("%Y-%m-%d %H:%M:%S")
        num_files = sum(1 for _ in run_dir.rglob("*") if _.is_file())
        lines.append(f"| Run #{idx} {'(Latest)' if idx == 1 else ''} | `{run_dir.name}` | {mtime} | {num_files} files |")

    lines.append("")
    summary_file.write_text("\n".join(lines), encoding="utf-8")
    print(f"[Rotation] Active test history maintained ({len(active_runs)}/{MAX_RUNS_RETAINED} runs).")

if __name__ == "__main__":
    rotate_test_results()
