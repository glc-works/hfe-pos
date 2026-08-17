#!/usr/bin/env python3
"""Unified HFE Introspection & Capability Discovery CLI (Public Distribution).
Pure Zero-Storage In-Memory Projection of HFE Canonical OpenAPI 3.1 Contract
and Arbitrary Depth Plans (L0..LN) & Scenario (L0..L2) Indexing Engine.
"""

import sys
import os
import glob
import re
import json
import argparse
import subprocess
from typing import Dict, List, Any, Optional, Set

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OPENAPI_PATHS = [
    os.path.join(REPO_ROOT, "hcb2", "service", "openapi.json"),
    os.path.join(REPO_ROOT, "docs", "active", "reference", "openapi.json"),
    os.path.join(REPO_ROOT, "hcb2", "openapi.json"),
]
PLANS_DIR = os.path.join(REPO_ROOT, "docs", "active", "plans")
SCENARIOS_DIR = os.path.join(REPO_ROOT, "docs", "active", "scenarios")

def load_spec():
    for p in OPENAPI_PATHS:
        if os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                continue
    print("Error: Could not locate canonical openapi.json", file=sys.stderr)
    sys.exit(1)

def cmd_stats(spec, args):
    paths = spec.get("paths", {})
    schemas = spec.get("components", {}).get("schemas", {})
    tag_counts, method_counts = {}, {}
    total_endpoints = 0
    for path, methods in paths.items():
        for method, op in methods.items():
            if method.lower() in ("get", "post", "put", "delete", "patch"):
                total_endpoints += 1
                method_counts[method.upper()] = method_counts.get(method.upper(), 0) + 1
                for t in op.get("tags", ["Untagged"]):
                    tag_counts[t] = tag_counts.get(t, 0) + 1

    print("=" * 60 + "\n 🏛️  HEADLESS FINANCIAL ENGINE (HFE) - API CORE STATS\n" + "=" * 60)
    print(f" • Total HTTP Endpoints: {total_endpoints}\n • Total Component Schemas (DTOs): {len(schemas)}\n • Total Capability Tags / Domains: {len(tag_counts)}\n" + "-" * 60)
    print(" Methods Breakdown:")
    for m, c in sorted(method_counts.items()):
        print(f"   - {m:<8}: {c:>4} endpoints")
    print("=" * 60)

def cmd_domains(spec, args):
    paths = spec.get("paths", {})
    tag_endpoints = {}
    for path, methods in paths.items():
        for method, op in methods.items():
            if method.lower() in ("get", "post", "put", "delete", "patch"):
                for t in op.get("tags", ["Untagged"]):
                    tag_endpoints.setdefault(t, []).append((method.upper(), path, op.get("summary", op.get("operationId", ""))))

    print("=" * 70 + "\n 🏷️  HFE CAPABILITY DOMAINS & API TAGS\n" + "=" * 70)
    for tag in sorted(tag_endpoints.keys()):
        endpoints = tag_endpoints[tag]
        print(f" 📂 {tag:<35} ({len(endpoints)} endpoints)")
        if args.verbose:
            for m, p, s in endpoints:
                print(f"    [{m:<6}] {p:<50} {s[:30]}")
    print("=" * 70)

CONCEPT_THESAURUS = {
    "pos": ["pos", "cashier", "kasir", "terminal", "retail", "shift", "drawer"],
    "kasir": ["pos", "cashier", "kasir", "terminal", "retail", "shift", "drawer"],
    "split": ["split", "tender", "settlement", "multi_tender", "biller"],
    "qris": ["qris", "payment", "bayar", "qr", "snap"],
    "faktur": ["faktur", "tax", "pajak", "vat", "commercial_invoice", "efaktur"],
    "jurnal": ["journal", "posting", "ledger", "entry", "book"],
    "rekonsiliasi": ["reconciliation", "match", "statement", "bank", "settle"],
    "inventory": ["inventory", "stock", "stocktake", "cogs", "warehouse", "gudang", "roasting", "sangrai"],
    "roasting": ["roasting", "sangrai", "bom", "assembly", "cogs", "inventory"],
    "stok": ["inventory", "stock", "stocktake", "cogs", "warehouse", "gudang"],
    "hutang": ["payable", "purchase", "vendor", "ap", "supplier", "tagihan"],
    "piutang": ["receivable", "sales", "invoice", "ar", "customer", "biller"],
    "aset": ["asset", "fixed_asset", "depreciation", "disposal"],
    "tutup_buku": ["period", "close", "month_end", "golden_month", "fiscal"],
    "cabang": ["outlet", "location", "subsidiary", "intercompany", "perimeter"],
    "holding": ["consolidation", "subsidiary", "elimination", "perimeter"],
    "kurs": ["currency", "fx", "revaluation", "triangulation", "rate"],
    "loyalty": ["loyalty", "points", "reward", "member", "customer"],
    "member": ["loyalty", "points", "reward", "member", "customer"],
    "connect": ["connect", "connector", "hub", "sync", "marketplace", "webhook", "integration"],
    "webhook": ["webhook", "subscription", "dispatch", "relay", "event"],
}

def expand_search_terms(query: str) -> Set[str]:
    q_lower = query.lower()
    expanded = {q_lower}
    for key, synonyms in CONCEPT_THESAURUS.items():
        if key in q_lower or any(s in q_lower for s in synonyms):
            expanded.update(synonyms)
    return expanded

def cmd_search(spec, args):
    query = args.query.strip()
    search_terms = expand_search_terms(query)
    paths = spec.get("paths", {})
    schemas = spec.get("components", {}).get("schemas", {})
    matching_endpoints, matching_schemas = [], []

    for path, methods in paths.items():
        for method, op in methods.items():
            if method.lower() not in ("get", "post", "put", "delete", "patch"):
                continue
            op_str = f"{path} {method} {op.get('summary', '')} {op.get('description', '')} {op.get('operationId', '')} {' '.join(op.get('tags', []))}".lower()
            matched_terms = [t for t in search_terms if t in op_str]
            if matched_terms:
                matching_endpoints.append((method.upper(), path, op.get("summary", op.get("operationId", "N/A")), op.get("tags", ["Untagged"]), ", ".join(sorted(set(matched_terms)))))

    for schema_name, schema_spec in schemas.items():
        schema_str = f"{schema_name} {schema_spec.get('description', '')} {' '.join(schema_spec.get('properties', {}).keys())}".lower()
        matched_terms = [t for t in search_terms if t in schema_str]
        if matched_terms:
            props = list(schema_spec.get("properties", {}).keys())
            matching_schemas.append((schema_name, ", ".join(sorted(set(matched_terms))), props[:6]))

    print("=" * 75 + f"\n 🔍 HFE CAPABILITY SEARCH: '{query}'")
    if len(search_terms) > 1:
        print(f" 💡 Semantic Thesaurus Expansion: {', '.join(sorted(search_terms))}")
    print("=" * 75 + f"\n Found {len(matching_endpoints)} matching endpoint(s) & {len(matching_schemas)} matching schema(s):")
    if matching_endpoints:
        print("\n [ENDPOINTS]")
        for m, p, desc, tags, terms in matching_endpoints:
            print(f"  • [{m}] {p} [Semantic match via '{terms}']\n      Tag: {', '.join(tags)} | OpID: {desc}\n")
    if matching_schemas:
        print(" [SCHEMAS / DTOs]")
        for name, terms, sample_props in matching_schemas:
            prop_str = f" (fields: {', '.join(sample_props)}...)" if sample_props else ""
            print(f"  • {name} [Semantic: '{terms}']{prop_str}")
    print("=" * 75)

def cmd_schema(spec, args):
    name = args.name.strip()
    schemas = spec.get("components", {}).get("schemas", {})
    target, target_name = None, None
    for sname, sspec in schemas.items():
        if sname.lower() == name.lower() or name.lower() in sname.lower():
            target, target_name = sspec, sname
            break
    if not target:
        print(f"❌ Schema DTO '{name}' not found. Run 'hfe search {name}' to find matching types.", file=sys.stderr)
        sys.exit(1)

    print("=" * 70 + f"\n 📦 DTO SCHEMA: {target_name}\n Description: {target.get('description', 'No description provided')}\n" + "=" * 70)
    properties = target.get("properties", {})
    required = set(target.get("required", []))
    if not properties:
        print(" (No properties defined or primitive enum/alias)\n" + json.dumps(target, indent=2))
        return
    print(f" {'FIELD':<30} {'TYPE':<25} {'REQUIRED'}\n" + "-" * 70)
    for prop, prop_spec in properties.items():
        raw_type = prop_spec.get("type", "")
        ptype = "|".join(raw_type) if isinstance(raw_type, list) else str(raw_type)
        if "$ref" in prop_spec:
            ptype = f"-> {prop_spec['$ref'].split('/')[-1]}"
        elif ptype == "array":
            items = prop_spec.get("items", {})
            ptype = f"List[-> {items['$ref'].split('/')[-1]}]" if "$ref" in items else f"List[{items.get('type', 'any')}]"
        req_marker = "✓ REQUIRED" if prop in required else "optional"
        print(f" {prop:<30} {str(ptype):<25} {req_marker}")
    print("=" * 70)

def parse_yaml_frontmatter(file_path: str) -> Optional[Dict[str, Any]]:
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
    except Exception:
        return None
    base_name = os.path.basename(file_path)
    fm_match = re.search(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
    fm_text = fm_match.group(1) if fm_match else ""

    lvl_match = re.search(r"^level:\s*(\d+)", fm_text, re.MULTILINE)
    level = int(lvl_match.group(1)) if lvl_match else (0 if "level-0" in file_path else (1 if "level-1" in file_path else 2))
    id_m = re.search(r"^id:\s*([^\n\r]+)", fm_text, re.MULTILINE)
    plan_id = id_m.group(1).strip().strip("\"'") if id_m else os.path.splitext(base_name)[0]
    title_m = re.search(r"^title:\s*([^\n\r]+)", fm_text, re.MULTILINE) or re.search(r"^#\s*([^\n\r]+)", content, re.MULTILINE)
    title = title_m.group(1).strip().strip("\"'") if title_m else base_name
    desc_m = re.search(r"^description:\s*([^\n\r]+)", fm_text, re.MULTILINE)
    description = desc_m.group(1).strip().strip("\"'") if desc_m else ""
    status_m = re.search(r"^status:\s*([^\n\r#]+)", fm_text, re.MULTILINE)
    status = status_m.group(1).strip().upper() if status_m else ("IMPLEMENTED" if "status: implemented" in content.lower() else "PROPOSED")
    parent_m = re.search(r"^(?:parent_id|parent_level_1|parent):\s*([^\n\r]+)", fm_text, re.MULTILINE)
    parent_id = parent_m.group(1).strip().strip("\"'") if parent_m else None

    dimensions = {}
    dim_block = re.search(r"^dimensions:\s*\n((?:\s+[-a-zA-Z0-9_]+:\s*[^\n\r]+\n?)+)", fm_text, re.MULTILINE)
    if dim_block:
        for line in dim_block.group(1).splitlines():
            kv = line.strip().split(":", 1)
            if len(kv) == 2:
                dimensions[kv[0].strip().upper()] = kv[1].split("#")[0].strip().strip("\"'").upper()

    tags_m = re.search(r"^tags:\s*\[(.*?)\]", fm_text, re.MULTILINE)
    tags = [t.strip().strip("\"'") for t in tags_m.group(1).split(",") if t.strip()] if tags_m else []
    proof_m = re.search(r"^proof_ids:\s*\[(.*?)\]", fm_text, re.MULTILINE)
    proofs = [p.strip().strip("\"'") for p in proof_m.group(1).split(",") if p.strip()] if proof_m else []

    return {
        "id": plan_id, "title": title, "description": description, "level": level,
        "parent_id": parent_id, "status": status, "dimensions": dimensions,
        "tags": tags, "proof_ids": proofs, "path": os.path.relpath(file_path, REPO_ROOT),
        "body_preview": content[:1200]
    }

def load_all_plans() -> List[Dict[str, Any]]:
    files = glob.glob(os.path.join(PLANS_DIR, "**", "*.md"), recursive=True)
    plans = [p for f in files if "/templates/" not in f and not f.endswith("index.md") and not f.endswith("crosswalk.md") and (p := parse_yaml_frontmatter(f))]
    return sorted(plans, key=lambda x: (x.get("level", 0), str(x.get("id", ""))))

def cmd_plan(args):
    plans = load_all_plans()
    query = (args.search or args.query or "").strip()
    if query in ("search", "find") and args.extra_args:
        query = " ".join(args.extra_args).strip()
    elif query in ("inspect", "get", "show") and args.extra_args:
        target_id = args.extra_args[0].strip()
        matched = [p for p in plans if p["id"] == target_id or target_id.lower() in p["title"].lower() or target_id in p["path"]]
        if not matched:
            print(f"❌ Plan '{target_id}' not found.", file=sys.stderr)
            sys.exit(1)
        p = matched[0]
        print("=" * 70 + f"\n 📑 PLAN [L{p['level']}] {p['id']}: {p['title']}\n Status: {p['status']} | Parent: {p.get('parent_id') or 'None'} | Path: {p['path']}\n Dimensions: {p.get('dimensions')}\n" + "=" * 70)
        full_path = os.path.join(REPO_ROOT, p["path"])
        if os.path.exists(full_path):
            with open(full_path, "r", encoding="utf-8") as f:
                print(f.read())
        return

    dim_filters = {}
    if args.dim:
        for pair in args.dim.split(","):
            if "=" in pair:
                k, v = pair.split("=", 1)
                dim_filters[k.strip().upper()] = v.strip().upper()

    matched_plans = []
    search_terms = expand_search_terms(query) if query else set()
    for p in plans:
        if args.level is not None and p["level"] != args.level:
            continue
        if args.status and args.status.upper() not in p["status"]:
            continue
        if dim_filters and not all(p.get("dimensions", {}).get(k) == v for k, v in dim_filters.items()):
            continue
        if search_terms:
            blob = f"{p['id']} {p['title']} {p['description']} {' '.join(p['tags'])} {p['path']} {json.dumps(p['dimensions'])} {p['body_preview']}".lower()
            mterms = [t for t in search_terms if t in blob]
            if not mterms:
                continue
            p["matched_terms"] = ", ".join(sorted(set(mterms)))
        else:
            p["matched_terms"] = ""
        matched_plans.append(p)

    if args.json:
        print(json.dumps(matched_plans, indent=2))
        return

    print("=" * 80 + f"\n 📑 HFE PLAN DISCOVERY (L0..LN)" + (f" | Search: '{query}'" if query else "") + (f" | Dim: {dim_filters}" if dim_filters else "") + f"\n" + "=" * 80)
    print(f" Found {len(matched_plans)} matching plan document(s) across repository:")
    for p in matched_plans:
        dims = p.get("dimensions", {})
        dim_str = " | ".join(f"{k}: {v}" for k, v in dims.items()) if dims else "Standard"
        match_info = f" [Matched: '{p['matched_terms']}']" if p.get("matched_terms") else ""
        status_emoji = "✅" if p.get("status") == "IMPLEMENTED" else "⏳"
        print(f"\n {status_emoji} [L{p.get('level', 2)}] Plan #{p.get('id')}: {p.get('title')}{match_info}")
        print(f"      Status:     {p.get('status')} | Parent: {p.get('parent_id') or 'N/A'}\n      Dimensions: {dim_str}\n      Path:       {p.get('path')}")
    print("\n" + "=" * 80)

def cmd_scenario(args):
    action = (args.action or "list").strip().lower()
    runner = os.path.join(REPO_ROOT, "scripts", "e2e-master-runner.py")
    if action == "sync":
        from radar.story_sync import sync_scenarios
        res = sync_scenarios()
        print("=" * 70 + "\n 🔄 HFE SCENARIO CRYPTOGRAPHIC SYNC\n" + "=" * 70)
        print(f" • Total Scenarios Synced: {res['total_scenarios']}\n • Created: {len(res['created'])} | Updated: {len(res['updated'])} | In-Sync: {len(res['unchanged'])}\n • Ledger:  {res['ledger_path']} (Synced At: {res['synced_at']})\n" + "=" * 70 + "\n✅ Cryptographic state ledger is 100% up to date.")
    elif action == "audit":
        from radar.story_sync import audit_gaps
        res = audit_gaps()
        print("=" * 75 + "\n 🛡️  HFE SCENARIO 4-GATE AUDIT REPORT\n" + "=" * 75)
        for line in res.summary_lines: print(f" {line}")
        print("=" * 75)
        if res.is_healthy:
            print("✅ 0 GAPS DETECTED — All 17 scenarios satisfy 4-Gate Cryptographic Invariants.")
        else:
            print(f"❌ AUDIT FAILED — {len(res.gaps)} gap(s) detected.", file=sys.stderr)
            sys.exit(1)
    elif action == "diff":
        from radar.story_sync import diff_scenarios
        res = diff_scenarios()
        print("=" * 70 + f"\n 🔍 HFE SCENARIO CRYPTOGRAPHIC DRIFT & DIFF (Last: {res['ledger_last_synced'] or 'Never'})\n" + "=" * 70)
        if res['diff_count'] == 0:
            print("✅ Zero drift detected. Disk state matches cryptographic ledger exactly.")
        else:
            print(f"⚠️ Found {res['diff_count']} drift item(s):")
            for d in res['diffs']: print(f"  • [{d['type']}] {d['id']}: {d['title']} ({d['path']})")
        print("=" * 70)
    elif action == "list":
        subprocess.run([sys.executable, runner, "--list"])
    elif action in ("run", "exec"):
        target = args.query or (args.extra_args[0] if args.extra_args else "")
        cmd = [sys.executable, runner]
        if target:
            cmd.extend(["--scenario", target])
        subprocess.run(cmd)
    elif action in ("search", "find"):
        query = args.query or (" ".join(args.extra_args) if args.extra_args else "")
        search_terms = expand_search_terms(query) if query else set()
        matched = []
        for root, _, files in os.walk(SCENARIOS_DIR):
            if "/templates" in root or "\\templates" in root:
                continue
            for f in sorted(files):
                if not f.endswith(".md") or f in ("README.md", "crosswalk.md", "index.md"):
                    continue
                fpath = os.path.join(root, f)
                with open(fpath, "r", encoding="utf-8", errors="ignore") as fp:
                    content = fp.read()
                mterms = [t for t in search_terms if t in content.lower()]
                if mterms or not query:
                    id_m = re.search(r"^id:\s*([^\n\r]+)", content, re.MULTILINE)
                    title_m = re.search(r"^title:\s*([^\n\r]+)", content, re.MULTILINE)
                    lvl_m = re.search(r"^level:\s*(\d+)", content, re.MULTILINE)
                    sid = id_m.group(1).strip().strip("\"'") if id_m else f
                    stitle = title_m.group(1).strip().strip("\"'") if title_m else f
                    slvl = int(lvl_m.group(1)) if lvl_m else 2
                    matched.append((sid, stitle, slvl, os.path.relpath(fpath, REPO_ROOT), ", ".join(sorted(set(mterms)))))
        print("=" * 80 + f"\n 🌐 HFE SCENARIO SEARCH: '{query}'\n" + "=" * 80)
        print(f" Found {len(matched)} matching scenario(s) in SSOT repository:")
        for sid, title, lvl, path, terms in matched:
            term_str = f" [Matched: '{terms}']" if terms else ""
            print(f"\n • [L{lvl}] {sid}: {title}{term_str}\n      Path: {path}")
        print("\n" + "=" * 80)

def cmd_town(args):
    engine_path = os.path.join(REPO_ROOT, "scripts", "agent_town", "game_engine.py")
    action = (args.action or "sim").strip().lower()
    cmd = [sys.executable, engine_path]
    if action == "status":
        cmd.append("--status")
        if args.json:
            cmd.append("--json")
    else:
        if args.days is not None:
            cmd.extend(["--days", str(args.days)])
        if args.actors is not None:
            cmd.extend(["--actors", str(args.actors)])
        if args.speed:
            cmd.extend(["--speed", args.speed])
        if args.json:
            cmd.append("--json")
    if args.extra_args:
        cmd.extend(args.extra_args)
    subprocess.run(cmd)

def cmd_skill(args):
    skills_dir = os.path.join(REPO_ROOT, ".agents", "skills")
    action = (args.action or "list").strip().lower()
    skills = []
    if os.path.exists(skills_dir):
        for sname in sorted(os.listdir(skills_dir)):
            sfile = os.path.join(skills_dir, sname, "SKILL.md")
            if os.path.isfile(sfile):
                with open(sfile, "r", encoding="utf-8") as f:
                    content = f.read()
                desc_m = re.search(r'description:\s*["\']?(.*?)["\']?\s*\n', content)
                desc = desc_m.group(1) if desc_m else "No description available"
                skills.append((sname, desc, sfile))
    print("=" * 80 + "\n 🏪 HFE AGENT SKILL MARKETPLACE & CATALOG (.agents/skills/)\n" + "=" * 80)
    print(f" Registered Agent Skills: {len(skills)} skills available in ecosystem:")
    for name, desc, path in skills:
        print(f"\n • {name:22} : {desc}\n   Path: {os.path.relpath(path, REPO_ROOT)}")
    print("\n" + "=" * 80)

def main():
    parser = argparse.ArgumentParser(description="HFE Introspection & Capability Discovery CLI (Pure SSOT Derivation)")
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("stats", help="Show global API statistics and metrics")
    p_domains = subparsers.add_parser("domains", help="List all capability domains and tags")
    p_domains.add_argument("-v", "--verbose", action="store_true", help="List all endpoints per domain")
    p_search = subparsers.add_parser("search", help="Search endpoints and DTO schemas by keyword")
    p_search.add_argument("query", help="Keyword or semantic term (e.g. split, context, qris, invoice)")
    p_schema = subparsers.add_parser("schema", aliases=["inspect"], help="Inspect fields and types of a specific DTO schema")
    p_schema.add_argument("name", help="Exact or partial Schema DTO name (e.g. SubmitTransactionPayload)")
    p_plan = subparsers.add_parser("plan", help="Discover, search, and inspect Arbitrary Depth Plans (L0..LN)")
    p_plan.add_argument("query", nargs="?", default="", help="Query term, subcommand (search/inspect), or plan ID")
    p_plan.add_argument("extra_args", nargs="*", default=[], help="Additional search arguments")
    p_plan.add_argument("--search", "-s", type=str, default="", help="Search query string")
    p_plan.add_argument("--dim", "-D", type=str, default=None, help="Filter by dimension (e.g. --dim CAPABILITY=COMMERCE)")
    p_plan.add_argument("--level", "-l", type=int, default=None, help="Filter by plan level (0..N)")
    p_plan.add_argument("--status", type=str, default=None, help="Filter by status (IMPLEMENTED, PROPOSED, READY_TO_BUILD, BACKLOG)")
    p_plan.add_argument("--json", action="store_true", help="Output results as JSON")
    p_scen = subparsers.add_parser("scenario", help="Discover, search, and run Business Scenarios (L0..L2)")
    p_scen.add_argument("action", nargs="?", default="list", help="Action: list, search, run")
    p_scen.add_argument("query", nargs="?", default="", help="Search query or scenario ID to run")
    p_scen.add_argument("extra_args", nargs="*", default=[], help="Additional arguments")
    p_town = subparsers.add_parser("town", help="Headless Agent Town & Game Simulation Engine")
    p_town.add_argument("action", nargs="?", default="sim", choices=["sim", "status"], help="Action: sim, status")
    p_town.add_argument("--days", type=int, default=None, help="Number of virtual days to simulate")
    p_town.add_argument("--actors", type=int, default=None, help="Number of autonomous actors")
    p_town.add_argument("--speed", choices=["warp", "fast"], default=None, help="Simulation speed")
    p_town.add_argument("--json", action="store_true", help="Output raw telemetry JSON")
    p_town.add_argument("extra_args", nargs="*", default=[], help="Additional arguments")
    p_skill = subparsers.add_parser("skill", help="Explore HFE Agent Skills & Ecosystem Catalog")
    p_skill.add_argument("action", nargs="?", default="list", help="Action: list, info")
    p_skill.add_argument("query", nargs="?", default="", help="Skill name or query")

    args = parser.parse_args()
    if args.command == "plan":
        cmd_plan(args)
    elif args.command == "scenario":
        cmd_scenario(args)
    elif args.command == "town":
        cmd_town(args)
    elif args.command == "skill":
        cmd_skill(args)
    else:
        spec = load_spec()
        if args.command == "stats":
            cmd_stats(spec, args)
        elif args.command == "domains":
            cmd_domains(spec, args)
        elif args.command == "search":
            cmd_search(spec, args)
        elif args.command in ("schema", "inspect"):
            cmd_schema(spec, args)

if __name__ == "__main__":
    main()
