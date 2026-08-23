#!/usr/bin/env python3
"""
Repository Hygiene & Git Index Guard (POS-ENG-STD-001)
Ensures zero generated, build, vendor, or temporary artifacts are tracked in git index.
"""
import sys
import subprocess
import os

FORBIDDEN_PREFIXES = [
    "node_modules/",
    "storybook-static/",
    "coverage/",
    "playwright-report/",
    "test-results/",
    ".astro/",
    "packages/storefront-astro/dist/",
    "packages/storefront-astro/.astro/",
]

FORBIDDEN_EXTENSIONS = [
    ".zip",
    ".tar.gz",
    ".tgz",
    ".DS_Store",
    ".tsbuildinfo",
]

# Dist is forbidden everywhere except the vendored immutable @hfe/sdk package
def is_forbidden_dist(path: str) -> bool:
    if path.startswith("packages/hfe-sdk/dist/"):
        return False
    if "dist/" in path:
        return True
    return False

def check_hygiene() -> int:
    try:
        raw_files = subprocess.check_output(["git", "ls-files"]).decode("utf-8").splitlines()
    except Exception as e:
        print(f"Error running git ls-files: {e}", file=sys.stderr)
        return 1

    violations = []
    
    for f in raw_files:
        # Check forbidden prefixes
        for prefix in FORBIDDEN_PREFIXES:
            if f.startswith(prefix):
                violations.append((f, f"Prohibited directory prefix '{prefix}'"))
                break
        
        # Check forbidden extensions
        for ext in FORBIDDEN_EXTENSIONS:
            if f.endswith(ext):
                violations.append((f, f"Prohibited file extension '{ext}'"))
                break

        # Check dist files
        if is_forbidden_dist(f):
            violations.append((f, "Prohibited compiled dist artifact"))

    if violations:
        print("❌ [HYGIENE FAILED] The following forbidden artifacts are tracked in Git index:")
        for file_path, reason in violations[:30]:
            print(f"  - {file_path} ({reason})")
        if len(violations) > 30:
            print(f"  ... and {len(violations) - 30} more violations.")
        print("\nRun 'git rm -r --cached <path>' to untrack these artifacts while keeping local files.")
        return 1

    print(f"🔍 Scanned {len(raw_files)} tracked files in Git index.")
    print("✅ [HYGIENE PASSED] Repository Git index is clean of forbidden build/vendor artifacts.")
    return 0

if __name__ == "__main__":
    sys.exit(check_hygiene())
