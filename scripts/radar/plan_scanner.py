"""
plan_scanner.py — Arbitrary Depth (L0..LN) Experience Plan Parser & Dimensional Classifier.
Scans docs/active/plans/ for Level 0 through Level N markdown plans, parses YAML frontmatter,
and indexes dynamic orthogonal dimensions (PILLAR, SURFACE, TIER, CADENCE, EXECUTION_LOOP).
"""

import os
import re
import json
from typing import List, Dict, Any, Optional, Tuple

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PLANS_DIR = os.path.join(ROOT_DIR, "docs", "active", "plans")

VALID_PILLARS = {"CORE", "BOARD", "ADMIN", "POS", "ORDER", "CARD", "BOOK"}
VALID_SURFACES = {"MOBILE_360", "TABLET_768", "DESKTOP_1024", "KIOSK"}
VALID_TIERS = {
    "TIER1_TOKENS", "TIER2_REACT_ARIA", "TIER3_DOMAIN_SLOTS",
    "TIER4_WIDGET_CLUSTERS", "TIER5_LAYOUTS", "TIER6_VIEWS"
}
VALID_CADENCES = {"SMALL", "MEDIUM", "LARGE"}
VALID_LOOPS = {"INNER", "OUTER", "LIVE"}
VALID_STATUSES = {"BACKLOG", "READY_TO_BUILD", "IN_PROGRESS", "IMPLEMENTED", "PROPOSED", "APPROVED"}

def parse_simple_yaml_frontmatter(content: str) -> Tuple[Dict[str, Any], str]:
    """Pure Python lightweight parser for YAML frontmatter block."""
    if not content.startswith("---"):
        return {}, content
    
    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content
    
    yaml_text = parts[1]
    body = parts[2]
    
    data: Dict[str, Any] = {}
    current_key: Optional[str] = None
    current_dict: Optional[Dict[str, Any]] = None
    current_list: Optional[List[Any]] = None
    
    for raw_line in yaml_text.splitlines():
        line = raw_line.rstrip()
        if not line or line.strip().startswith("#"):
            continue
        
        # Check indentation
        indent = len(line) - len(line.lstrip())
        stripped = line.strip()
        
        # Nested list item
        if stripped.startswith("- ") and indent > 0:
            val = stripped[2:].strip().strip("\"'")
            if current_list is not None:
                current_list.append(val)
            elif current_key and current_dict is not None and isinstance(current_dict.get(current_key), list):
                current_dict[current_key].append(val)
            continue
            
        # Nested dictionary key (indent >= 2)
        if indent >= 2 and ":" in stripped:
            sub_k, sub_v = stripped.split(":", 1)
            sub_k = sub_k.strip()
            sub_v = sub_v.strip()
            
            # Remove inline comments
            if "#" in sub_v and not (sub_v.startswith('"') or sub_v.startswith("'")):
                sub_v = sub_v.split("#")[0].strip()
                
            sub_v = sub_v.strip("\"'")
            if current_dict is not None:
                current_dict[sub_k] = sub_v
            continue
            
        # Top-level key: value
        if ":" in stripped:
            k, v = stripped.split(":", 1)
            k = k.strip()
            v = v.strip()
            
            # Inline comment removal
            if "#" in v and not (v.startswith('"') or v.startswith("'")):
                v = v.split("#")[0].strip()
                
            current_key = k
            
            if not v:
                # Could be start of nested dict or list
                if k == "dimensions":
                    data[k] = {}
                    current_dict = data[k]
                    current_list = None
                elif k in ("vitest_suites", "tags"):
                    data[k] = []
                    current_list = data[k]
                    current_dict = None
                else:
                    data[k] = None
                    current_dict = None
                    current_list = None
                continue
                
            # Inline list [a, b, c]
            if v.startswith("[") and v.endswith("]"):
                inner = v[1:-1].strip()
                items = [x.strip().strip("\"'") for x in inner.split(",") if x.strip()]
                data[k] = items
                current_dict = None
                current_list = None
                continue
                
            # String / Number / Boolean
            v_clean = v.strip("\"'")
            if v_clean.lower() == "null" or v_clean == "":
                data[k] = None
            elif v_clean.isdigit():
                data[k] = int(v_clean)
            elif v_clean.lower() in ("true", "false"):
                data[k] = v_clean.lower() == "true"
            else:
                data[k] = v_clean
                
            current_dict = None
            current_list = None
            
    return data, body

def classify_pillar_from_text(name: str, text: str) -> str:
    combined = (name + " " + text).lower()
    if any(k in combined for k in ["financial", "ledger", "subledger", "warehouse", "branch", "outlet", "openapi", "cutover", "multi-tender", "consignment"]):
        return "BOOK"
    if any(k in combined for k in ["loyalty", "voucher", "member", "card", "crm", "contact"]):
        return "CARD"
    if any(k in combined for k in ["kds", "kitchen", "barista", "sommelier", "course", "firing", "board", "notification"]):
        return "BOARD"
    if any(k in combined for k in ["order", "cart", "journey", "self-order", "channel", "qr"]):
        return "ORDER"
    if any(k in combined for k in ["onboarding", "wizard", "team", "membership", "rbac", "pin", "shift", "void", "refund", "stocktake", "courier", "resi", "esg", "rl", "backoffice", "admin"]):
        return "ADMIN"
    if any(k in combined for k in ["token", "theme", "aria", "primitive", "idempotency", "auth", "offline", "indexeddb", "security", "typography", "design", "viewport", "core"]):
        return "CORE"
    return "POS"

def classify_surface_from_text(name: str, text: str) -> str:
    combined = (name + " " + text).lower()
    if any(k in combined for k in ["mobile", "phone", "qr", "360", "ios", "guest-login", "3row", "microbudget"]):
        return "MOBILE_360"
    if any(k in combined for k in ["kds", "tablet", "768", "sommelier", "waiter"]):
        return "TABLET_768"
    if any(k in combined for k in ["kiosk", "self-service"]):
        return "KIOSK"
    return "DESKTOP_1024"

def classify_tier_from_text(name: str, text: str) -> str:
    combined = (name + " " + text).lower()
    if any(k in combined for k in ["token", "color", "typography", "css", "theme"]):
        return "TIER1_TOKENS"
    if any(k in combined for k in ["aria", "primitive", "button", "input", "pricetag", "capacitybadge", "atom"]):
        return "TIER2_REACT_ARIA"
    if any(k in combined for k in ["context", "provider", "hook", "adapter", "idempotency", "slot", "storage", "sync"]):
        return "TIER3_DOMAIN_SLOTS"
    if any(k in combined for k in ["tablecard", "cartdrawer", "modaldrawer", "card", "widget", "assembly"]):
        return "TIER4_WIDGET_CLUSTERS"
    if any(k in combined for k in ["grid", "tetris", "layout", "viewport", "shell", "split", "canvas"]):
        return "TIER5_LAYOUTS"
    return "TIER6_VIEWS"

def scan_plans(root_dir: Optional[str] = None) -> List[Dict[str, Any]]:
    """Recursively scan docs/active/plans/ and parse all Markdown plans."""
    if root_dir is None:
        root_dir = ROOT_DIR
        
    plans_dir = os.path.join(root_dir, "docs", "active", "plans")
    if not os.path.exists(plans_dir):
        return []
        
    plan_nodes = []
    
    for root, dirs, files in os.walk(plans_dir):
        # Exclude templates directory
        if "templates" in root:
            continue
            
        for fname in sorted(files):
            if not fname.endswith(".md"):
                continue
                
            full_path = os.path.join(root, fname)
            rel_path = os.path.relpath(full_path, root_dir)
            
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                
            frontmatter, body = parse_simple_yaml_frontmatter(content)
            
            # 1. Determine Level (L0..LN)
            level = frontmatter.get("level")
            if level is None:
                # Infer from folder or type
                dir_name = os.path.basename(root)
                if dir_name.startswith("level-"):
                    try:
                        level = int(dir_name.replace("level-", ""))
                    except ValueError:
                        level = 1
                elif "level-0" in rel_path or "Level 0" in str(frontmatter.get("type", "")):
                    level = 0
                elif "level-1" in rel_path or "Level 1" in str(frontmatter.get("type", "")):
                    level = 1
                elif "level-2" in rel_path or "Level 2" in str(frontmatter.get("type", "")):
                    level = 2
                else:
                    level = 1
            else:
                level = int(level)
                
            # 2. Determine Plan ID
            plan_id = frontmatter.get("id")
            if not plan_id:
                clean_name = fname.replace(".md", "")
                plan_id = clean_name
            node_id = f"plan-{plan_id}"
            
            # 3. Determine Title
            title = frontmatter.get("title")
            if not title:
                # Try extracting H1
                m = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
                title = m.group(1).strip() if m else plan_id
                
            # 4. Determine Parent ID
            parent_id = frontmatter.get("parent_id")
            if not parent_id:
                parent_id = frontmatter.get("parent_level_1") or frontmatter.get("parent_level_0")
            
            parents = []
            if parent_id:
                parents.append(f"plan-{parent_id}")
            elif level == 1:
                parents.append("plan-000-hfex-master-experience-platform")
            elif level > 1:
                # Fallback to level-1 parent if available
                pass
                
            # 5. Determine Dimensions
            dims = frontmatter.get("dimensions", {})
            if not isinstance(dims, dict):
                dims = {}
                
            pillar = dims.get("PILLAR") or classify_pillar_from_text(fname, content[:500])
            surface = dims.get("SURFACE") or classify_surface_from_text(fname, content[:500])
            tier = dims.get("TIER") or classify_tier_from_text(fname, content[:500])
            cadence = dims.get("CADENCE", "MEDIUM" if level <= 1 else "SMALL")
            loop = dims.get("EXECUTION_LOOP", "OUTER" if level <= 1 else "INNER")
            
            # Normalize dimension values
            pillar = pillar.upper()
            if pillar not in VALID_PILLARS:
                pillar = classify_pillar_from_text(fname, content[:500])
            
            surface = surface.upper()
            if surface not in VALID_SURFACES:
                surface = classify_surface_from_text(fname, content[:500])
                
            tier = tier.upper()
            if tier not in VALID_TIERS:
                tier = classify_tier_from_text(fname, content[:500])
                
            cadence = cadence.upper()
            if cadence not in VALID_CADENCES:
                cadence = "SMALL"
                
            loop = loop.upper()
            if loop not in VALID_LOOPS:
                loop = "INNER"
                
            dimensions = {
                "PILLAR": pillar,
                "SURFACE": surface,
                "TIER": tier,
                "CADENCE": cadence,
                "EXECUTION_LOOP": loop
            }
            
            # 6. Status, Budgets & Test Suites
            raw_status = str(frontmatter.get("status", "IMPLEMENTED")).upper()
            status = raw_status if raw_status in VALID_STATUSES else "IMPLEMENTED"
            
            budget_tokens = frontmatter.get("budget_tokens", 50000)
            latency_sla_ms = frontmatter.get("latency_sla_ms", 100)
            vitest_suites = frontmatter.get("vitest_suites", [])
            if not isinstance(vitest_suites, list):
                vitest_suites = [vitest_suites] if vitest_suites else []
                
            plan_node = {
                "id": node_id,
                "plan_id": plan_id,
                "title": title,
                "level": level,
                "node_type": "PLAN",
                "path": rel_path,
                "parents": parents,
                "dimensions": dimensions,
                "status": status,
                "budget_tokens": budget_tokens,
                "latency_sla_ms": latency_sla_ms,
                "vitest_suites": vitest_suites,
                "tags": frontmatter.get("tags", [])
            }
            
            plan_nodes.append(plan_node)
            
    return sorted(plan_nodes, key=lambda x: (x["level"], x["id"]))

def get_plan_summary(plans: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generate statistical summary of all indexed plans across levels and dimensions."""
    by_level: Dict[int, int] = {}
    by_pillar: Dict[str, int] = {}
    by_surface: Dict[str, int] = {}
    by_status: Dict[str, int] = {}
    
    for p in plans:
        lvl = p.get("level", 0)
        by_level[lvl] = by_level.get(lvl, 0) + 1
        
        dims = p.get("dimensions", {})
        pil = dims.get("PILLAR", "UNKNOWN")
        by_pillar[pil] = by_pillar.get(pil, 0) + 1
        
        surf = dims.get("SURFACE", "UNKNOWN")
        by_surface[surf] = by_surface.get(surf, 0) + 1
        
        st = p.get("status", "UNKNOWN")
        by_status[st] = by_status.get(st, 0) + 1
        
    return {
        "total_plans": len(plans),
        "by_level": by_level,
        "by_pillar": by_pillar,
        "by_surface": by_surface,
        "by_status": by_status
    }
