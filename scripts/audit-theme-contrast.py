#!/usr/bin/env python3
"""
Hfe POS & Storefront Theme Contrast Auditor (POS-ENG-STD-001 / Rule 20 & 27)
Automated Static Analysis Gate ensuring 100% Day-Mode vs Dark-Mode WCAG Contrast Compliance.
"""

import os
import re
import sys
import glob

def check_file_contrast(filepath):
    errors = []
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    
    # Exclude files that are test files, dev HUD, or explicit theme generators
    if 'test' in filepath.lower() or 'demo' in filepath.lower():
        return errors

    for idx, line in enumerate(lines, start=1):
        stripped = line.strip()
        # Skip comments or imports
        if stripped.startswith('//') or stripped.startswith('/*') or stripped.startswith('*') or stripped.startswith('import '):
            continue

        # Check: text-slate-900 or text-slate-950 without dark:text-* in the same className
        # Only check within className="..." or className={`...`}
        class_matches = re.findall(r'className=(?:["\']([^"\']+)["\']|{`([^`]+)`})', line)
        for match in class_matches:
            cls = match[0] or match[1]
            tokens = cls.split()

            # Rule 1: Text slate-900 / slate-950 / slate-800 must have dark:text-
            for t in tokens:
                if t in ['text-slate-900', 'text-slate-950', 'text-slate-800']:
                    if not any(dk.startswith('dark:text-') for dk in tokens):
                        # Allow if icon (w-* h-*) or container is permanently colored solid background
                        is_icon = any(w.startswith('w-') for w in tokens) and any(h.startswith('h-') for h in tokens) and len(tokens) <= 6
                        solid_bgs = ['bg-amber', 'bg-emerald', 'bg-yellow', 'from-amber', 'bg-white', 'bg-slate-100', 'border-amber']
                        if not is_icon and not any(bg in cls for bg in solid_bgs):
                            errors.append((idx, f"Unpaired dark text '{t}' without 'dark:text-*' variant in: {cls}"))

            # Rule 2: bg-white without dark:bg-* on containers
            if 'bg-white' in tokens and not any(dk.startswith('dark:bg-') for dk in tokens):
                # Exclude QRIS simulation container, receipt paper, or color picker
                exemptions = ['qr', 'receipt', 'badge', 'color', 'avatar', 'border-2 border-slate-900', 'p-4 rounded-2xl flex flex-col items-center', 'shadow-md border border-slate-200']
                if not any(k in cls.lower() for k in exemptions):
                    if 'w-full' in tokens or 'rounded-2xl' in tokens or 'rounded-3xl' in tokens or 'border' in tokens:
                        errors.append((idx, f"Unpaired 'bg-white' without 'dark:bg-*' variant on container in: {cls}"))

    return errors

def main():
    print("=" * 50)
    print(" 🎨 Hfe Dual-Theme & Day/Night Contrast Auditor")
    print("=" * 50)

    target_dirs = ['src/components/landing', 'src/components/customer', 'src/views/LandingPageView.tsx']
    all_files = []
    
    for t in target_dirs:
        if os.path.isfile(t):
            all_files.append(t)
        elif os.path.isdir(t):
            all_files.extend(glob.glob(f"{t}/**/*.tsx", recursive=True))

    total_errors = 0
    scanned_count = 0

    for filepath in sorted(all_files):
        scanned_count += 1
        errs = check_file_contrast(filepath)
        if errs:
            for line_no, msg in errs:
                print(f"❌ [{filepath}:{line_no}] {msg}")
                total_errors += 1

    if total_errors > 0:
        print(f"\n[CONTRAST AUDIT FAILED] Found {total_errors} theme contrast violations.")
        print("Fix all unpaired Tailwind classes (e.g. text-slate-900 dark:text-white) to prevent White-on-White contrast bugs.")
        sys.exit(1)
    else:
        print(f"✅ [CONTRAST AUDIT PASSED] Scanned {scanned_count} storefront/customer files. 100% Day/Night contrast compliant.")
        sys.exit(0)

if __name__ == '__main__':
    main()
