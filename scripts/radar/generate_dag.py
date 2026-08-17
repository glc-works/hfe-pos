#!/usr/bin/env python3
"""
scripts/radar/generate_dag.py — Semantic DAG Generator for hfex-rad0
Registers all dimensions, 9 pillars, tool nodes, arbitrary depth Experience Plans (L0..LN),
and 86 Vitest test suites into scripts/radar/semantic_dag.json.
"""

import os
import glob
import json
import re
from plan_scanner import scan_plans

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DAG_PATH = os.path.join(ROOT_DIR, "scripts", "radar", "semantic_dag.json")

spec = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "version": "2.1.0",
    "name": "HFE-POS Unified 2D Semantic & Topological DAG Specification (hfex-rad0)",
    "dimensions": {
        "PILLAR": {
            "name": "Experience & Capability Pillar",
            "values": ["CORE", "BOARD", "ADMIN", "POS", "ORDER", "CARD", "BOOK"]
        },
        "SURFACE": {
            "name": "Hardware Viewport & Surface",
            "values": ["MOBILE_360", "TABLET_768", "DESKTOP_1024", "KIOSK"]
        },
        "TIER": {
            "name": "6-Tier Atomic Architecture Layer",
            "values": ["TIER1_TOKENS", "TIER2_REACT_ARIA", "TIER3_DOMAIN_SLOTS", "TIER4_WIDGET_CLUSTERS", "TIER5_LAYOUTS", "TIER6_VIEWS"]
        },
        "CADENCE": {
            "name": "Google Test Size Standard",
            "values": ["SMALL", "MEDIUM", "LARGE"]
        },
        "EXECUTION_LOOP": {
            "name": "Developer Feedback Loop Cadence",
            "values": ["INNER", "OUTER", "LIVE"]
        }
    },
    "nodes": []
}

# 1. Hub Root
spec["nodes"].append({
    "id": "hub-root",
    "title": "Master Radar & Experience Orchestrator (hfex-rad0)",
    "level": 0,
    "node_type": "HUB",
    "path": "scripts/hfex-rad0.py",
    "parents": [],
    "dimensions": {
        "PILLAR": "CORE",
        "SURFACE": "DESKTOP_1024",
        "TIER": "TIER6_VIEWS",
        "CADENCE": "MEDIUM",
        "EXECUTION_LOOP": "OUTER"
    }
})

# 2. 9 Pillar Audit Nodes
pillars = [
    ("p1-modularity", "P1: Modularity & 500-Line Limit Gate", "scripts/radar/p1_modularity.py", "CORE", "TIER3_DOMAIN_SLOTS"),
    ("p2-react-aria", "P2: Tier 2 React Aria & Headless Primitives", "scripts/radar/p2_react_aria.py", "CORE", "TIER2_REACT_ARIA"),
    ("p3-spatial-isolation", "P3: Defensive Spatial Isolation & Anti-Collision Matrix", "scripts/radar/p3_spatial_isolation.py", "POS", "TIER5_LAYOUTS"),
    ("p4-vitest-suites", "P4: Vitest 86-Suite Test Suite Runner", "scripts/radar/p4_vitest_suites.py", "CORE", "TIER3_DOMAIN_SLOTS"),
    ("p5-openapi-parity", "P5: OpenAPI Contract & Connector Manifest Parity", "scripts/radar/p5_openapi_parity.py", "BOOK", "TIER3_DOMAIN_SLOTS"),
    ("p6-tabular-monetary", "P6: Tabular Monetary Presentation & Zero-Jitter Currency", "scripts/radar/p6_tabular_monetary.py", "CORE", "TIER1_TOKENS"),
    ("p7-capacity-utilisation", "P7: F&B Capacity Utilisation & Anti-Zigzag Standard", "scripts/radar/p7_capacity_utilisation.py", "POS", "TIER4_WIDGET_CLUSTERS"),
    ("p8-bundle-budget", "P8: Vite Build Bundle Budget & Chunk Size Gate", "scripts/radar/p8_bundle_budget.py", "CORE", "TIER1_TOKENS"),
    ("p9-git-hygiene", "P9: Git Hygiene & Pre-Commit Fast Sentinel", "scripts/radar/p9_git_hygiene.py", "ADMIN", "TIER6_VIEWS")
]

for pid, title, path, pillar_dim, tier_dim in pillars:
    spec["nodes"].append({
        "id": pid,
        "title": title,
        "level": 1,
        "node_type": "PILLAR",
        "path": path,
        "parents": ["hub-root"],
        "dimensions": {
            "PILLAR": pillar_dim,
            "SURFACE": "DESKTOP_1024",
            "TIER": tier_dim,
            "CADENCE": "MEDIUM",
            "EXECUTION_LOOP": "OUTER"
        }
    })

# 3. Static Quality, Build, and Tool Nodes
tools = [
    ("tool-modularity-scan", "Modularity Checker Tool", "scripts/check-modularity.py", "p1-modularity", "CORE", "DESKTOP_1024", "TIER3_DOMAIN_SLOTS", "SMALL", "INNER"),
    ("tool-ui-standards-audit", "UI Standards & Viewport Auditor", "scripts/audit-hfe-ui-standards.py", "p3-spatial-isolation", "POS", "MOBILE_360", "TIER5_LAYOUTS", "SMALL", "INNER"),
    ("tool-manifest-validate", "Connector Manifest Validator", "scripts/validate-connector.py", "p5-openapi-parity", "BOOK", "DESKTOP_1024", "TIER3_DOMAIN_SLOTS", "SMALL", "INNER"),
    ("tool-contract-check", "Hfe Contract & Health Gate", "scripts/hfe-contract-check.sh", "p5-openapi-parity", "BOOK", "DESKTOP_1024", "TIER3_DOMAIN_SLOTS", "MEDIUM", "OUTER"),
    ("tool-ci-local", "Local CI Gate Runner", "scripts/ci-local.sh", "hub-root", "ADMIN", "DESKTOP_1024", "TIER6_VIEWS", "MEDIUM", "OUTER"),
    ("tool-inspect-pillars", "Playwright Multi-Pillar Visual Inspector", "scripts/inspect-all-pillars.cjs", "p3-spatial-isolation", "POS", "DESKTOP_1024", "TIER6_VIEWS", "LARGE", "LIVE"),
    ("tool-clone-detector", "Structural Clone & Duplicate Component Detector", "scripts/radar/clone_detector.py", "p1-modularity", "CORE", "DESKTOP_1024", "TIER2_REACT_ARIA", "LARGE", "LIVE"),
    ("tool-typecheck", "TypeScript Compiler Typecheck (tsc --noEmit)", "tsconfig.json", "hub-root", "CORE", "DESKTOP_1024", "TIER1_TOKENS", "MEDIUM", "OUTER"),
    ("tool-build", "Vite Production Build (vite build)", "vite.config.ts", "p8-bundle-budget", "CORE", "DESKTOP_1024", "TIER1_TOKENS", "MEDIUM", "OUTER")
]

for tid, title, path, parent, pillar_dim, surface_dim, tier_dim, cadence_dim, loop_dim in tools:
    spec["nodes"].append({
        "id": tid,
        "title": title,
        "level": 1,
        "node_type": "TOOL",
        "path": path,
        "parents": [parent],
        "dimensions": {
            "PILLAR": pillar_dim,
            "SURFACE": surface_dim,
            "TIER": tier_dim,
            "CADENCE": cadence_dim,
            "EXECUTION_LOOP": loop_dim
        }
    })

# 4. Scan & Index Experience Plans (L0..LN Arbitrary Depth)
plan_nodes = scan_plans(ROOT_DIR)
for p in plan_nodes:
    spec["nodes"].append(p)

# 5. Map All 86 Vitest Test Suites
tests_dir = os.path.join(ROOT_DIR, "src", "tests")
test_files = sorted(glob.glob(os.path.join(tests_dir, "*.test.ts*")))

def classify_test(fname, content):
    base = os.path.basename(fname).replace(".test.tsx", "").replace(".test.ts", "")
    
    # Defaults
    pillar = "POS"
    surface = "DESKTOP_1024"
    tier = "TIER4_WIDGET_CLUSTERS"
    
    # Surface classification
    if any(k in base.lower() for k in ["mobile", "ios", "microbudget", "3row", "360"]):
        surface = "MOBILE_360"
    elif any(k in base.lower() for k in ["kds", "tablet", "768", "floorplan", "tetris"]):
        surface = "TABLET_768"
    elif any(k in base.lower() for k in ["kiosk", "customer"]):
        surface = "MOBILE_360"
        
    # Pillar classification
    if any(k in base.lower() for k in ["financial", "ledger", "book", "portcutover", "warehouse"]):
        pillar = "BOOK"
    elif any(k in base.lower() for k in ["card", "member", "loyalty"]):
        pillar = "CARD"
    elif any(k in base.lower() for k in ["board", "kds", "notification"]):
        pillar = "BOARD"
    elif any(k in base.lower() for k in ["order", "journey", "channel"]):
        pillar = "ORDER"
    elif any(k in base.lower() for k in ["admin", "onboarding", "team", "merchant", "workflow", "resi", "esg", "backoffice"]):
        pillar = "ADMIN"
    elif any(k in base.lower() for k in ["core", "idempotency", "auth", "offline", "theme", "i18n", "security", "design", "viewport", "standard", "typography", "token"]):
        pillar = "CORE"
    else:
        pillar = "POS"
        
    # Tier classification
    if any(k in base.lower() for k in ["token", "theme", "typography"]):
        tier = "TIER1_TOKENS"
    elif any(k in base.lower() for k in ["pricetag", "button", "badge", "pill", "atom"]):
        tier = "TIER2_REACT_ARIA"
    elif any(k in base.lower() for k in ["math", "adapter", "idempotency", "context", "auth", "offline", "sync", "rule", "policy"]):
        tier = "TIER3_DOMAIN_SLOTS"
    elif any(k in base.lower() for k in ["layout", "viewport", "grid", "tetris", "surface", "navigation", "drawer", "bar"]):
        tier = "TIER5_LAYOUTS"
    elif any(k in base.lower() for k in ["view", "portal", "journey", "app", "suite", "scenarios", "channel"]):
        tier = "TIER6_VIEWS"
    else:
        tier = "TIER4_WIDGET_CLUSTERS"
        
    # Extract Title from describe
    m = re.search(r"describe\((['\"`])(.+?)\1", content)
    title = m.group(2) if m else f"Unit Suite: {base}"
    
    return pillar, surface, tier, title

for path in test_files:
    fname = os.path.basename(path)
    clean_name = fname.replace(".test.tsx", "").replace(".test.ts", "")
    node_id = f"test-{clean_name}"
    rel_path = os.path.relpath(path, ROOT_DIR)
    
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
        
    pillar, surface, tier, title = classify_test(fname, content)
    
    spec["nodes"].append({
        "id": node_id,
        "title": title,
        "level": 2,
        "node_type": "TEST",
        "path": rel_path,
        "parents": ["p4-vitest-suites"],
        "dimensions": {
            "PILLAR": pillar,
            "SURFACE": surface,
            "TIER": tier,
            "CADENCE": "SMALL",
            "EXECUTION_LOOP": "INNER"
        }
    })

with open(DAG_PATH, "w", encoding="utf-8") as f:
    json.dump(spec, f, indent=2)

print(f"Generated semantic_dag.json with {len(spec['nodes'])} total nodes ({len(plan_nodes)} plans, {len(test_files)} test suites).")
