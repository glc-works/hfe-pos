"""
hfex-rad0 — Dimension Index, Bitmask Lookup & 2D Matrix ANSI Visualizer.
Provides sub-millisecond bitmask queries, multi-dimensional filtering,
and 2D Topological Depth x Dimension matrix rendering for hfe-pos.
"""

import os
import sys
import json
import time
from typing import List, Dict, Any, Optional, Set, Tuple
from .plan_scanner import scan_plans, get_plan_summary

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DAG_SPEC_PATH = os.path.join(SCRIPT_DIR, "semantic_dag.json")

# Available Dimensions and their canonical values
DIMENSIONS = {
    "PILLAR": {
        "name": "Pillar Dimension",
        "values": ["CORE", "BOARD", "ADMIN", "POS", "ORDER", "CARD", "BOOK"],
        "description": "Architectural governance and experience pillars"
    },
    "SURFACE": {
        "name": "Surface Experience",
        "values": ["MOBILE_360", "TABLET_768", "DESKTOP_1024", "KIOSK"],
        "description": "Hardware viewport and deployment surfaces"
    },
    "TIER": {
        "name": "6-Tier Atomic Architecture Layer",
        "values": ["TIER1_TOKENS", "TIER2_REACT_ARIA", "TIER3_DOMAIN_SLOTS", "TIER4_WIDGET_CLUSTERS", "TIER5_LAYOUTS", "TIER6_VIEWS"],
        "description": "Atomic UI layers from Tokens to Full Views"
    },
    "CADENCE": {
        "name": "Execution Cadence (Google Test Size)",
        "values": ["SMALL", "MEDIUM", "LARGE"],
        "description": "Google Test Size: Small (<0.5s in-memory), Medium (1-5s integration), Large (>5s build/e2e)"
    },
    "EXECUTION_LOOP": {
        "name": "Developer Feedback Loop Cadence",
        "values": ["INNER", "OUTER", "LIVE"],
        "description": "Developer Loop: Inner (hot loop), Outer (pre-commit/CI), Live (runtime/e2e)"
    }
}

DIMENSION_ALIASES = {
    "P": "PILLAR", "PIL": "PILLAR", "PILLARS": "PILLAR", "DOMAIN": "PILLAR", "EXPERIENCE": "PILLAR",
    "S": "SURFACE", "SURF": "SURFACE", "VIEWPORT": "SURFACE",
    "T": "TIER", "TIERS": "TIER", "LAYER": "TIER", "LAYERS": "TIER",
    "C": "CADENCE", "SIZE": "CADENCE", "SPEED": "CADENCE",
    "L": "EXECUTION_LOOP", "LOOP": "EXECUTION_LOOP", "CYCLE": "EXECUTION_LOOP", "PHASE": "EXECUTION_LOOP",
    "STATUS": "STATUS", "ST": "STATUS", "TYPE": "TYPE", "NODE_TYPE": "TYPE"
}

VALUE_ALIASES = {
    "FAST": "SMALL", "HOT": "INNER", "MID": "MEDIUM", "SLOW": "LARGE",
    "INTEGRITY": "OUTER", "CHAOS": "LIVE", "STRESS": "LARGE",
    "MOBILE": "MOBILE_360", "TABLET": "TABLET_768", "DESKTOP": "DESKTOP_1024",
    "TOKENS": "TIER1_TOKENS", "REACT_ARIA": "TIER2_REACT_ARIA", "ATOMS": "TIER2_REACT_ARIA",
    "SLOTS": "TIER3_DOMAIN_SLOTS", "WIDGETS": "TIER4_WIDGET_CLUSTERS", "LAYOUTS": "TIER5_LAYOUTS", "VIEWS": "TIER6_VIEWS",
    "PLAN": "PLAN", "TEST": "TEST", "TOOL": "TOOL", "HUB": "HUB", "PILLAR": "PILLAR"
}

def load_dag_spec() -> Dict[str, Any]:
    spec = {"dimensions": DIMENSIONS, "nodes": []}
    if os.path.exists(DAG_SPEC_PATH):
        try:
            with open(DAG_SPEC_PATH, "r", encoding="utf-8") as f:
                spec = json.load(f)
        except Exception:
            pass

    # Dynamically discover plans from docs/active/plans/
    existing_ids = {n["id"] for n in spec.get("nodes", [])}
    try:
        scanned_plans = scan_plans()
        for p in scanned_plans:
            if p["id"] not in existing_ids:
                spec.setdefault("nodes", []).append(p)
                existing_ids.add(p["id"])
    except Exception:
        pass

    return spec

_spec = load_dag_spec()
POS_NODES: List[Dict[str, Any]] = _spec.get("nodes", [])

CI_SHARD_CONFIG = [
    {"shard": "CORE", "name": "Shard 1: CORE", "pillars": ["CORE"], "description": "Design tokens, atomic primitives, auth & offline"},
    {"shard": "POS", "name": "Shard 2: POS", "pillars": ["POS"], "description": "Retail cashier, 4-col tetris grid & cart math"},
    {"shard": "BOARD_ORDER", "name": "Shard 3: BOARD & ORDER", "pillars": ["BOARD", "ORDER"], "description": "KDS kitchen display, order channels & spotlight"},
    {"shard": "CARD_BOOK_ADMIN", "name": "Shard 4: CARD, BOOK & ADMIN", "pillars": ["CARD", "BOOK", "ADMIN"], "description": "Member card loyalty, financial ledger & onboarding"}
]

def parse_dimension_filter(filter_str: str) -> Dict[str, str]:
    result = {}
    if not filter_str:
        return result
    for pair in filter_str.split(","):
        if "=" in pair:
            k, v = pair.split("=", 1)
            result[k.strip()] = v.strip()
        else:
            result["CADENCE"] = pair.strip()
    return result

class DimensionIndex:
    def __init__(self, nodes: Optional[List[Dict[str, Any]]] = None):
        self.spec = load_dag_spec()
        self.dimensions = self.spec.get("dimensions", DIMENSIONS)
        self.nodes = nodes if nodes is not None else self.spec.get("nodes", POS_NODES)
        self.node_by_id: Dict[str, Dict[str, Any]] = {n["id"]: n for n in self.nodes}

        self.inverted_index: Dict[str, Set[str]] = {}
        for node in self.nodes:
            nid = node["id"]
            # Index dimensions
            for dim_code, val in node.get("dimensions", {}).items():
                resolved_dim = self.resolve_dimension_key(dim_code)
                resolved_val = self.resolve_dimension_value(val)
                key = f"{resolved_dim}={resolved_val}"
                self.inverted_index.setdefault(key, set()).add(nid)
                
            # Index status & node_type
            if "status" in node:
                st_key = f"STATUS={str(node['status']).upper()}"
                self.inverted_index.setdefault(st_key, set()).add(nid)
            nt = node.get("node_type", "PLAN" if node.get("path", "").endswith(".md") else "NODE")
            nt_key = f"TYPE={str(nt).upper()}"
            self.inverted_index.setdefault(nt_key, set()).add(nid)

    def resolve_dimension_key(self, raw_key: str) -> str:
        k = raw_key.upper().strip()
        return DIMENSION_ALIASES.get(k, k)

    def resolve_dimension_value(self, raw_val: str) -> str:
        v = raw_val.upper().strip()
        return VALUE_ALIASES.get(v, v)

    def query(self, filters: Dict[str, str], target_level: Optional[int] = None) -> List[Dict[str, Any]]:
        if not filters and target_level is None:
            return self.nodes

        sets = []
        for raw_dim, raw_val in filters.items():
            dim_key = self.resolve_dimension_key(raw_dim)
            dim_val = self.resolve_dimension_value(raw_val)
            lookup_key = f"{dim_key}={dim_val}"
            matching = self.inverted_index.get(lookup_key, set())
            sets.append(matching)

        matched_ids = set.intersection(*sets) if sets else set(self.node_by_id.keys())
        results = [self.node_by_id[nid] for nid in matched_ids if nid in self.node_by_id]
        
        if target_level is not None:
            results = [n for n in results if n.get("level") == target_level]
            
        return sorted(results, key=lambda x: (x.get("level", 0), x.get("id", "")))

    def filter_nodes(self, filters: Dict[str, str], target_level: Optional[int] = None) -> List[Dict[str, Any]]:
        return self.query(filters, target_level=target_level)

    def render_matrix(self, group_by_dimension: str = "PILLAR", as_json: bool = False, plan_only: bool = False) -> int:
        dim_key = self.resolve_dimension_key(group_by_dimension)
        if dim_key not in self.dimensions:
            valid_dims = ", ".join(self.dimensions.keys())
            print(f"❌ Unknown dimension '{group_by_dimension}'. Available: {valid_dims}", file=sys.stderr)
            return 1

        nodes_pool = [n for n in self.nodes if n.get("node_type") == "PLAN"] if plan_only else self.nodes
        dim_spec = self.dimensions[dim_key]
        dim_values = dim_spec["values"]

        # Discover all levels dynamically (L0..LN arbitrary depth)
        levels = sorted(list(set(n.get("level", 0) for n in nodes_pool)))
        if not levels:
            levels = [0, 1, 2]

        level_names = {
            0: "L0 (Master Hub)",
            1: "L1 (Domain Pillars)",
            2: "L2 (Suites & Features)",
            3: "L3 (Sub-tasks & Atoms)"
        }

        if as_json:
            matrix_data: Dict[str, Any] = {
                "dimension": dim_key,
                "dimension_name": dim_spec.get("name", dim_key),
                "values": dim_values,
                "plan_only": plan_only,
                "matrix": {}
            }
            for lvl in levels:
                row_label = level_names.get(lvl, f"Level {lvl} (LN)")
                matrix_data["matrix"][row_label] = {}
                for val in dim_values:
                    matching = [
                        n["id"] for n in nodes_pool
                        if n.get("level") == lvl and
                        self.resolve_dimension_value(n.get("dimensions", {}).get(dim_key, "")) == val
                    ]
                    matrix_data["matrix"][row_label][val] = {
                        "count": len(matching),
                        "nodes": matching
                    }
            print(json.dumps(matrix_data, indent=2))
            return 0

        # ANSI Text Matrix
        title_suffix = " (EXPERIENCE PLANS L0..LN)" if plan_only else ""
        print("\n" + "=" * 100)
        print(f" 🗺️  HFE-POS 2D ORTHOGONAL MATRIX: TOPOLOGICAL DEPTH × {dim_key}{title_suffix}")
        print("=" * 100)

        col_w = max(12, max(len(v) for v in dim_values) + 2) if dim_values else 12
        header_cols = [f"{v:^{col_w}}" for v in dim_values]
        header = f"{'TOPOLOGY LEVEL':<24} | " + " | ".join(header_cols) + " | Total"
        print(header)
        print("-" * len(header))

        grand_total = 0
        for lvl in levels:
            row_title = level_names.get(lvl, f"Level {lvl} (L{lvl})")
            cols = []
            row_sum = 0
            for val in dim_values:
                matched_nodes = [
                    n for n in nodes_pool
                    if n.get("level") == lvl and
                    self.resolve_dimension_value(n.get("dimensions", {}).get(dim_key, "")) == val
                ]
                cnt = len(matched_nodes)
                row_sum += cnt
                if cnt > 0:
                    cols.append(f"✅ {cnt:<{col_w-3}}")
                else:
                    cols.append(f"{'―':^{col_w}}")
            grand_total += row_sum
            print(f"{row_title:<24} | " + " | ".join(cols) + f" | {row_sum:^5}")

        print("-" * len(header))
        totals_cols = []
        for val in dim_values:
            total_v = sum(
                1 for n in nodes_pool
                if self.resolve_dimension_value(n.get("dimensions", {}).get(dim_key, "")) == val
            )
            totals_cols.append(f"{total_v:^{col_w}}")
        print(f"{'TOTAL NODES':<24} | " + " | ".join(totals_cols) + f" | {grand_total:^5}")
        print("=" * 100 + "\n")
        return 0

def query_dimensions(filter_str: str, target_level: Optional[int] = None, as_json: bool = False) -> int:
    idx = DimensionIndex()
    filters = parse_dimension_filter(filter_str)
    nodes = idx.query(filters, target_level=target_level)
    
    if as_json:
        print(json.dumps({
            "filter": filters,
            "target_level": target_level,
            "count": len(nodes),
            "nodes": nodes
        }, indent=2))
        return 0

    print(f"\n🏷️  [DIMENSIONAL QUERY] Filter: '{filter_str}' (Found: {len(nodes)} matching node(s))")
    print("=" * 100)
    for n in nodes:
        dim_str = " ".join([f"{k}:{v}" for k, v in n.get("dimensions", {}).items()])
        nt = n.get("node_type", "NODE")
        st = f" [{n['status']}]" if "status" in n else ""
        print(f" • [L{n.get('level', 0)}|{nt:<4}] {n.get('id'):<38} | {n.get('title', n.get('name', '')):<36} {st} | {dim_str}")
    print("=" * 100 + "\n")
    return 0

def render_dimension_matrix(group_by: str = "PILLAR", as_json: bool = False, plan_only: bool = False) -> int:
    idx = DimensionIndex()
    return idx.render_matrix(group_by_dimension=group_by, as_json=as_json, plan_only=plan_only)

def generate_ci_matrix(as_json: bool = True) -> int:
    idx = DimensionIndex()
    pillars = ["CORE", "POS", "BOARD", "ORDER", "CARD", "BOOK", "ADMIN"]
    shards = []
    for p in pillars:
        nodes = idx.filter_nodes({"PILLAR": p, "CADENCE": "SMALL", "TYPE": "TEST"}, target_level=2)
        shards.append({
            "shard": p,
            "test_count": len(nodes),
            "files": [n["path"] for n in nodes]
        })
        
    ci_payload = {"include": shards}
    if as_json:
        print(json.dumps(ci_payload, indent=2))
    return 0

def print_tools_directory(as_json: bool = False) -> int:
    idx = DimensionIndex()
    tool_nodes = [n for n in idx.nodes if n.get("node_type") == "TOOL" or (n.get("level") == 1 and str(n.get("id", "")).startswith("tool-"))]
    if as_json:
        print(json.dumps({"tools": tool_nodes}, indent=2))
        return 0
    print("\n🛠️  [HFE-POS TOOLS DIRECTORY]")
    print("=" * 80)
    for t in tool_nodes:
        print(f" • {t.get('id'):<26} | {t.get('title', t.get('name', '')):<40} | {t.get('path')}")
    print("=" * 80 + "\n")
    return 0

def print_plans_directory(target_level: Optional[int] = None, target_pillar: Optional[str] = None, as_json: bool = False) -> int:
    idx = DimensionIndex()
    filters = {"TYPE": "PLAN"}
    if target_pillar:
        filters["PILLAR"] = target_pillar
    plans = idx.query(filters, target_level=target_level)
    
    if as_json:
        print(json.dumps({"count": len(plans), "plans": plans}, indent=2))
        return 0
        
    summary = get_plan_summary(plans)
    print("\n📋 [HFE-POS EXPERIENCE PLANS DIRECTORY (L0..LN ARBITRARY DEPTH)]")
    print(f"   Total Indexed: {summary['total_plans']} plans across {len(summary['by_pillar'])} pillars")
    print("=" * 100)
    for p in plans:
        dims = p.get("dimensions", {})
        dim_str = f"P:{dims.get('PILLAR')} S:{dims.get('SURFACE')} T:{dims.get('TIER')}"
        print(f" • [L{p.get('level', 0)}] {p.get('id'):<40} | {p.get('title', ''):<36} [{p.get('status', 'PLAN')}] | {dim_str}")
    print("=" * 100 + "\n")
    return 0
