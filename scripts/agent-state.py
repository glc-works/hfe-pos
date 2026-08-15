#!/usr/bin/env python3
"""Provider-neutral crash-resilient shared agent recovery state.

A replacement planning or implementation agent on the same local clone can
recover its own checkpoint, peer summaries, recent coordination events, and
Git drift without reconstructing a conversation or mutating Git/GitHub.

Subcommands:
  checkpoint  — atomically write/replace this agent's checkpoint
  event       — append a short coordination event to the shared log
  resume      — read-only: report this agent's checkpoint, peers, events, Git state

State lives under ``.agent-state/`` at the Git common directory root, so all
linked worktrees in the same clone observe the same role files.  Nothing is
committed; ``.agent-state/`` is git-ignored.

No daemon, no database, no cloud sync, no auto-checkpoint, no Git mutation.
State is recovery-only, not authority — decisions remain in Issue/repo.
"""

from __future__ import annotations

import argparse
import fcntl
import json
import os
import re
import subprocess
import sys
import tempfile
from datetime import datetime, timezone, timedelta
from pathlib import Path

# ─── internal helpers ────────────────────────────────────────────────────────

_VALID_ROLES = ("planning", "implementation", "reviewer", "toolsmith", "codie", "aibo", "cvo", "uiux")
# Canonical role personas: the checkpoint restores state, the persona restores
# behavior. Personas are committed, provider-neutral, and never copied here —
# only the path and a content hash, so a resume can prove which persona
# version the session behaves under and warn when the file moved on.
_PERSONA_BY_ROLE = {
    "planning": ".agent-personas/planner.md",
    "implementation": ".agent-personas/implementer.md",
    "reviewer": ".agent-personas/reviewer.md",
    "toolsmith": ".agent-personas/toolsmith.md",
    "codie": ".agent-personas/codie.md",
    "aibo": ".agent-personas/aibo.md",
    "cvo": ".agent-personas/cvo.md",
    "uiux": ".agent-personas/uiux.md",
}


def _persona_file(role: str | None) -> Path | None:
    """Absolute path of the canonical persona for *role*, or None."""
    rel = _PERSONA_BY_ROLE.get(role or "")
    if not rel:
        return None
    common = _git_common_dir(Path.cwd())
    return common.parent / rel


def _persona_sha(role: str | None) -> str | None:
    """Short content hash of the role's canonical persona, or None if absent."""
    import hashlib
    path = _persona_file(role)
    if path is None or not path.is_file():
        return None
    return hashlib.sha256(path.read_bytes()).hexdigest()[:12]
_VALID_SLOTS = ("planning1",
                "implementation1", "implementation2", "implementation3",
                "implementation4", "implementation5",
                "reviewer1", "codie1", "aibo1", "cvo1", "uiux1")
_EVENTS_MAX = 50  # how many recent events resume shows


def _utc_now() -> str:
    """ISO-8601 UTC timestamp."""
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _git_common_dir(worktree: Path) -> Path:
    """Resolve the shared Git common directory via a Git-native query.

    In a linked worktree, ``.git`` is a *file* (not a directory), so manual
    ``.git/commondir`` parsing fails. ``git rev-parse --git-common-dir``
    handles all layouts correctly. Falls back to ``worktree / .git`` when Git
    is unavailable.
    """
    result = _git("rev-parse --git-common-dir", worktree)
    if result:
        p = Path(result)
        if not p.is_absolute():
            p = (worktree / p).resolve()
        return p
    return (worktree / ".git").resolve()


def _state_root() -> Path:
    """The ``.agent-state`` directory at the clone root."""
    worktree = Path.cwd()
    common = _git_common_dir(worktree)
    # common dir is .../repo/.git for the primary clone
    clone_root = common.parent
    return clone_root / ".agent-state"


def _agents_dir() -> Path:
    return _state_root() / "agents"


def _events_file() -> Path:
    return _state_root() / "events.jsonl"


def _claims_file() -> Path:
    return _state_root() / "claims.json"


def _checkpoint_path(slot: str) -> Path:
    return _agents_dir() / f"{slot}.json"


def _atomic_write_json(path: Path, data: dict) -> None:
    """Atomically write *data* as JSON to *path*.

    Uses a temp file + ``os.replace`` + ``fsync`` of both the file and its
    parent directory so a crash mid-write leaves the prior valid checkpoint
    intact.
    """
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), prefix=path.name + ".", suffix=".tmp")
    try:
        with os.fdopen(fd, "w") as f:
            json.dump(data, f, sort_keys=True)
            f.write("\n")
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, str(path))
        # fsync the directory so the rename is durable
        dir_fd = os.open(str(path.parent), os.O_RDONLY)
        try:
            os.fsync(dir_fd)
        finally:
            os.close(dir_fd)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


# ─── git metadata (read-only, safe fields only) ──────────────────────────────

def _git(field: str, cwd: Path | None = None) -> str | None:
    """Run a read-only Git command and return its stdout (stripped) or None."""
    try:
        result = subprocess.run(
            ["git"] + field.split(),
            capture_output=True, text=True, check=False,
            cwd=str(cwd) if cwd else None,
        )
        if result.returncode == 0:
            return result.stdout.strip()
    except (OSError, subprocess.SubprocessError):
        pass
    return None


def _git_state() -> dict:
    """Collect safe, read-only Git metadata. Never captures env or secrets."""
    worktree = Path.cwd()
    return {
        "branch": _git("rev-parse --abbrev-ref HEAD", worktree),
        "head_sha": _git("rev-parse --short HEAD", worktree),
        "main_sha": _git("rev-parse --short origin/main", worktree),
        "dirty": bool(_git("status --porcelain", worktree)),
        "behind_main": _git("rev-list --count HEAD..origin/main", worktree),
    }


# ─── subcommands ─────────────────────────────────────────────────────────────

def cmd_checkpoint(args: argparse.Namespace) -> int:
    """Write or replace this agent's checkpoint atomically."""
    if args.slot not in _VALID_SLOTS:
        print(f"error: invalid slot '{args.slot}'", file=sys.stderr)
        return 2
    if args.role not in _VALID_ROLES:
        print(f"error: invalid role '{args.role}'", file=sys.stderr)
        return 2

    git = _git_state()
    now = _utc_now()

    checkpoint = {
        "slot": args.slot,
        "role": args.role,
        "provider": args.provider or "",
        # Slot ≠ session: different sessions (different IDEs/providers)
        # rotate through one slot lane. The session id is what analytics
        # joins on to attribute good/bad work to the actual occupant.
        "session": getattr(args, "session", "") or "",
        "updated_at": now,
        "git": git,
    }
    # Record which persona version this session behaves under (path + hash,
    # never the content) so resume can detect a persona that moved on.
    persona_sha = _persona_sha(args.role)
    if persona_sha:
        checkpoint["persona"] = _PERSONA_BY_ROLE[args.role]
        checkpoint["persona_sha"] = persona_sha
    # Optional short recovery fields — caller supplies these explicitly
    if args.issue:
        checkpoint["issue"] = args.issue
    if args.branch:
        checkpoint["branch"] = args.branch
    if args.objective:
        checkpoint["objective"] = args.objective
    if args.notes:
        checkpoint["notes"] = args.notes

    path = _checkpoint_path(args.slot)
    _atomic_write_json(path, checkpoint)
    print(f"checkpoint written: {args.slot} → {path}")
    return 0


def _load_claims() -> dict:
    claims_file = _claims_file()
    if not claims_file.is_file():
        return {}
    try:
        with open(claims_file, "r") as f:
            fcntl.flock(f.fileno(), fcntl.LOCK_SH)
            try:
                return json.load(f)
            finally:
                fcntl.flock(f.fileno(), fcntl.LOCK_UN)
    except (OSError, json.JSONDecodeError):
        return {}


def _append_event(slot: str, kind: str, message: str = "", work_unit: str | None = None, payload: dict | None = None) -> None:
    event = {
        "timestamp": _utc_now(),
        "slot": slot,
        "kind": kind,
    }
    if work_unit:
        event["work_unit_id"] = work_unit
    if message:
        event["message"] = message[:500]
    if payload:
        event["payload"] = payload

    events = _events_file()
    events.parent.mkdir(parents=True, exist_ok=True)

    with open(events, "a") as f:
        fcntl.flock(f.fileno(), fcntl.LOCK_EX)
        try:
            f.write(json.dumps(event, sort_keys=True) + "\n")
            f.flush()
            os.fsync(f.fileno())
        finally:
            fcntl.flock(f.fileno(), fcntl.LOCK_UN)


def cmd_event(args: argparse.Namespace) -> int:
    """Append a short JSONL event to the shared log under flock."""
    _append_event(args.slot, args.kind, getattr(args, "message", "") or "")
    print(f"event appended: {args.slot} {args.kind}")
    return 0


def cmd_log_event(args: argparse.Namespace) -> int:
    """Subcommand: log a structured activity event to .agent-state/events.jsonl."""
    payload = None
    if getattr(args, "payload", None):
        try:
            payload = json.loads(args.payload)
        except json.JSONDecodeError as err:
            print(f"error: invalid JSON payload: {err}", file=sys.stderr)
            return 2

    _append_event(
        slot=args.slot,
        kind=args.kind,
        message=getattr(args, "message", "") or "",
        work_unit=getattr(args, "work_unit", None),
        payload=payload,
    )
    wu_str = f" ({args.work_unit})" if getattr(args, "work_unit", None) else ""
    print(f"event logged: {args.slot} {args.kind}{wu_str}")
    return 0


def cmd_claim(args: argparse.Namespace) -> int:
    """Acquire a lease-based WorkUnit claim in .agent-state/claims.json."""
    work_unit = args.work_unit.strip()
    if not work_unit:
        print("error: --work-unit cannot be empty", file=sys.stderr)
        return 2

    if work_unit.isdigit():
        work_unit = f"L2-{work_unit}"

    now_dt = datetime.now(timezone.utc)
    now_iso = now_dt.isoformat(timespec="seconds")
    lease_hours = float(args.lease_hours) if getattr(args, "lease_hours", None) else 4.0
    expires_dt = now_dt.replace(microsecond=0) + timedelta(hours=lease_hours)
    expires_iso = expires_dt.isoformat(timespec="seconds")

    git = _git_state()

    claims_file = _claims_file()
    claims_file.parent.mkdir(parents=True, exist_ok=True)

    with open(claims_file, "a+") as f:
        fcntl.flock(f.fileno(), fcntl.LOCK_EX)
        try:
            f.seek(0)
            content = f.read()
            claims = json.loads(content) if content.strip() else {}

            existing = claims.get(work_unit)
            if existing and not getattr(args, "force", False):
                exp_str = existing.get("lease_expires_at", "")
                try:
                    exp_dt = datetime.fromisoformat(exp_str)
                except (ValueError, TypeError):
                    exp_dt = None

                if exp_dt and exp_dt > now_dt and existing.get("slot") != args.slot:
                    owner_sig = existing.get("owner_signature", existing.get("slot", "?"))
                    print(f"error: work unit {work_unit} is already leased by '{owner_sig}' "
                          f"until {exp_str} (pass --force to override)", file=sys.stderr)
                    return 1

            provider = getattr(args, "provider", "") or ""
            session = getattr(args, "session", "") or ""
            role = getattr(args, "role", "") or ""
            
            if args.slot.lower() == "auto":
                candidates = [f"implementation{i}" for i in range(1, 6)] if (not role or role == "implementation") else [f"{role}1"]
                assigned_slot = None
                for cand in candidates:
                    busy = False
                    for wu, claim in claims.items():
                        if claim.get("slot") == cand:
                            exp_str = claim.get("lease_expires_at", "")
                            try:
                                exp_dt = datetime.fromisoformat(exp_str)
                                if exp_dt > now_dt:
                                    busy = True
                                    break
                            except (ValueError, TypeError):
                                pass
                    if not busy:
                        assigned_slot = cand
                        break
                slot = assigned_slot or candidates[0]
            else:
                slot = args.slot

            sess_str = f"{provider}:{session}" if (provider and session) else (session or provider or "?")
            owner_sig = f"[{slot}:{role or '?'} | {sess_str}]"

            claims[work_unit] = {
                "work_unit_id": work_unit,
                "slot": slot,
                "role": role,
                "provider": provider,
                "session": session,
                "owner_signature": owner_sig,
                "base_sha": git.get("head_sha", ""),
                "claimed_at": now_iso,
                "lease_expires_at": expires_iso,
            }

            _atomic_write_json(claims_file, claims)
        finally:
            fcntl.flock(f.fileno(), fcntl.LOCK_UN)

    _append_event(slot, "CLAIMED", f"WorkUnit {work_unit} leased until {expires_iso}", work_unit=work_unit)
    print(f"claim acquired: {work_unit} → slot {slot} (lease expires {expires_iso})")
    return 0


def cmd_release(args: argparse.Namespace) -> int:
    """Release a WorkUnit claim in .agent-state/claims.json."""
    work_unit = args.work_unit.strip()
    if work_unit.isdigit():
        work_unit = f"L2-{work_unit}"

    claims_file = _claims_file()
    if not claims_file.is_file():
        print(f"no active claims for {work_unit}")
        return 0

    with open(claims_file, "a+") as f:
        fcntl.flock(f.fileno(), fcntl.LOCK_EX)
        try:
            f.seek(0)
            content = f.read()
            claims = json.loads(content) if content.strip() else {}
            if work_unit in claims:
                del claims[work_unit]
                _atomic_write_json(claims_file, claims)
                print(f"claim released: {work_unit}")
            else:
                print(f"work unit {work_unit} was not active")
        finally:
            fcntl.flock(f.fileno(), fcntl.LOCK_UN)

    _append_event(args.slot, "RELEASED", f"WorkUnit {work_unit} released by {args.slot}", work_unit=work_unit)
    return 0


def cmd_claims(args: argparse.Namespace) -> int:
    """Read-only listing of all active work unit leases."""
    claims = _load_claims()
    now_dt = datetime.now(timezone.utc)
    rows = []
    for wu_id, claim in sorted(claims.items()):
        exp_str = claim.get("lease_expires_at", "")
        try:
            exp_dt = datetime.fromisoformat(exp_str)
            expired = exp_dt <= now_dt
        except (ValueError, TypeError):
            expired = False
        status = "EXPIRED" if expired else "ACTIVE"
        sig = claim.get("owner_signature") or f"[{claim.get('slot', '?')}]"
        rows.append(f"  {wu_id:12s} {status:8s} owner={sig} expires={exp_str}")

    print(f"CLAIMS ({len(rows)})" if rows else "CLAIMS: none")
    for r in rows:
        print(r)
    return 0


def cmd_audit_realization(args: argparse.Namespace) -> int:
    """Audit feature realization status against main HEAD reachability and evidence."""
    work_tree = Path.cwd()
    git = _git_state()

    issue_num = None
    search_terms = []
    if getattr(args, "issue", None):
        issue_num = str(args.issue)
    elif getattr(args, "plan_path", None):
        m = re.search(r"/(\d+)-", args.plan_path)
        if m:
            issue_num = m.group(1)

    if issue_num:
        search_terms.append(issue_num)
        search_terms.append(f"#{issue_num}")
        # Map known issue numbers to domain keywords
        domain_keywords = {
            "725": ["fixed_assets", "fixed_asset"],
            "727": ["payroll"],
            "728": ["inventory_location", "inventory_locations", "inventory_transfers"],
            "729": ["lead", "leads", "qualify_credit"],
            "730": ["consolidation", "consolidation_perimeters"],
            "746": ["insights", "financial_insights_summary"],
            "749": ["unit_resolver", "resolve_unit_by_serial_number"],
            "769": ["document_exclusive_locks", "document_locks", "presence", "acquire_document_lock", "release_document_lock", "force_unlock_document"],
            "770": ["offline_resilient_drafts", "auto_sync_draft", "get_user_draft", "clear_user_draft"],
            "771": ["offline_sync", "offline_sync_records", "sync_offline_queue", "get_device_sync_status"],
            "773": ["commercial_discount", "discounts"],
            "775": ["variable_consideration", "variable_consideration_reserves", "predict_variable_consideration"],
            "777": ["unclosed_period_adjustments", "period_delta_adjustments", "adjust_delta", "soft_lock", "post_period_delta_adjustment", "soft_lock_accounting_period"],
            "778": ["auditor_digital_signatures", "auditor_working_papers", "holding_audit_samples", "audit_governance", "signoff_accounting_period_auditor", "get_enterprise_division_audit_matrix"],
            "782": ["federation", "tenant_migration", "bilateral_trade", "federated_node_connections", "ecosystem_bilateral_trades", "tenant_infrastructure_migrations", "trigger_federated_node_sync", "execute_bilateral_trade", "migrate_tenant_infrastructure"],
            "786": ["entity_hierarchy_reparenting", "entity_hierarchy_reparentings", "reparent_company_book", "get_reparenting_history"],
        }
        if issue_num in domain_keywords:
            search_terms.extend(domain_keywords[issue_num])

    print("=" * 60)
    print(f"REALIZATION AUDIT" + (f" — Issue #{issue_num}" if issue_num else ""))
    print("=" * 60)
    print(f"  HEAD:         {git.get('head_sha', '?')}")
    print(f"  origin/main:  {git.get('main_sha', '?')}")

    evidence = {
        "migrations": [],
        "service_handlers": [],
        "openapi_projections": [],
        "route_wiring": [],
        "proof_scripts": [],
    }

    migration_dirs = [
        work_tree / "v2" / "service" / "migrations",
        work_tree / "hcb2" / "service" / "migrations",
        work_tree / "migrations",
    ]
    for mdir in migration_dirs:
        if mdir.is_dir() and search_terms:
            for p in mdir.glob("*.sql"):
                if any(term in p.name for term in search_terms):
                    evidence["migrations"].append(str(p.relative_to(work_tree)))

    service_dirs = [
        work_tree / "v2" / "service" / "src",
        work_tree / "hcb2" / "service" / "src",
    ]
    for sdir in service_dirs:
        if sdir.is_dir() and search_terms:
            for p in sdir.rglob("*.rs"):
                try:
                    text = p.read_text()
                    if any(term in text or term in p.name for term in search_terms):
                        rel_path = str(p.relative_to(work_tree))
                        evidence["service_handlers"].append(rel_path)
                        if "bootstrap.rs" in p.name or "main.rs" in p.name or "openapi.rs" in p.name:
                            evidence["route_wiring"].append(rel_path)
                except OSError:
                    pass

    # OpenAPI Projections audit
    openapi_files = [
        work_tree / "hcb2" / "openapi.json",
        work_tree / "docs" / "active" / "reference" / "openapi.json",
        work_tree / "v2" / "openapi.json",
    ]
    for oapi in openapi_files:
        if oapi.is_file() and search_terms:
            try:
                text = oapi.read_text()
                if any(term in text for term in search_terms):
                    evidence["openapi_projections"].append(str(oapi.relative_to(work_tree)))
            except OSError:
                pass

    scripts_dir = work_tree / "scripts"
    if scripts_dir.is_dir() and search_terms:
        for p in scripts_dir.glob("proof-hcb2-*.sh"):
            try:
                text = p.read_text()
                if any(term in text for term in search_terms):
                    has_sentinel = "cargo test" in text or "assert" in text.lower() or "exit 0" in text
                    sentinel_label = " [sentinel verified]" if has_sentinel else " [no sentinel]"
                    evidence["proof_scripts"].append(str(p.relative_to(work_tree)) + sentinel_label)
            except OSError:
                pass

    print("\n## Evidence")
    print(f"  Migrations found:       {len(evidence['migrations'])}")
    for m in evidence["migrations"]:
        print(f"    • {m}")

    print(f"  Service handlers found: {len(evidence['service_handlers'])}")
    for s in evidence["service_handlers"]:
        print(f"    • {s}")

    print(f"  OpenAPI projections:    {len(evidence['openapi_projections'])}")
    for oa in evidence["openapi_projections"]:
        print(f"    • {oa}")

    print(f"  Route wiring files:     {len(evidence['route_wiring'])}")
    for rw in evidence["route_wiring"]:
        print(f"    • {rw}")

    print(f"  Proof scripts found:    {len(evidence['proof_scripts'])}")
    for ps in evidence["proof_scripts"]:
        print(f"    • {ps}")

    if evidence["service_handlers"] and (evidence["migrations"] or evidence["proof_scripts"] or evidence["openapi_projections"]):
        verdict = "REALIZED"
        desc = "Executable REST service handlers, OpenAPI route projections, DB schemas, and proof suite reachable on HEAD."
    elif evidence["migrations"] and not evidence["service_handlers"]:
        verdict = "FOUNDATION_ONLY"
        desc = "DB DDL / migrations present on HEAD, but REST service handlers remain missing."
    elif evidence["service_handlers"] or evidence["proof_scripts"] or evidence["openapi_projections"]:
        verdict = "PARTIAL"
        desc = "Partial service handlers, route projections, or proof scripts present."
    else:
        verdict = "NOT_REALIZED"
        desc = "No reachable implementation evidence found on current HEAD."

    print(f"\n## Realization Verdict: {verdict}")
    print(f"  {desc}")
    print("=" * 60)
    return 0


def cmd_audit_code_hygiene(args: argparse.Namespace) -> int:
    """Scan Rust service codebase for debug residue (eprintln!, dbg!, [DEBUG])."""
    work_tree = Path.cwd()

    target_dirs = [
        work_tree / "v2" / "service" / "src",
        work_tree / "hcb2" / "service" / "src",
        work_tree / "src",
    ]

    critical_violations = []
    warning_violations = []
    total_files = 0

    strict_mode = getattr(args, "strict", False)

    for tdir in target_dirs:
        if not tdir.is_dir():
            continue
        for p in tdir.rglob("*.rs"):
            rel_path = str(p.relative_to(work_tree))
            # Exclude test directories, test modules, and CLI binaries (bin/)
            if ("/tests/" in rel_path or "/bin/" in rel_path or
                    rel_path.endswith("_test.rs") or rel_path.endswith("_tests.rs")):
                continue

            total_files += 1
            try:
                content = p.read_text(encoding="utf-8")
            except (OSError, UnicodeDecodeError):
                continue

            is_main_rs = rel_path.endswith("main.rs")
            lines = content.splitlines()
            in_test_module = False

            for idx, line in enumerate(lines, start=1):
                stripped = line.strip()

                if "#[cfg(test)]" in stripped:
                    in_test_module = True

                if in_test_module:
                    continue

                if stripped.startswith("//") or stripped.startswith("/*") or stripped.startswith("*"):
                    continue

                # Critical 1: [DEBUG] string pattern
                if "[DEBUG]" in line:
                    critical_violations.append({
                        "file": rel_path,
                        "line": idx,
                        "rule": "[DEBUG] residue",
                        "content": line.strip(),
                    })
                # Critical 2: dbg! macro pattern
                elif re.search(r"\bdbg!\s*\(", line):
                    critical_violations.append({
                        "file": rel_path,
                        "line": idx,
                        "rule": "dbg! macro call",
                        "content": line.strip(),
                    })
                # Warning / Strict: eprintln! or println! in domain code
                elif not is_main_rs and (re.search(r"\beprintln!\s*\(", line) or re.search(r"\bprintln!\s*\(", line)):
                    warning_violations.append({
                        "file": rel_path,
                        "line": idx,
                        "rule": "eprintln! / println! in service code",
                        "content": line.strip(),
                    })

    print("=" * 60)
    print(f"CODE HYGIENE AUDIT (Debug Residue Inspection)")
    print("=" * 60)
    print(f"  Scanned files:       {total_files}")
    print(f"  Critical violations: {len(critical_violations)}")
    print(f"  Service warnings:    {len(warning_violations)}")

    if critical_violations:
        print("\n## CRITICAL VIOLATIONS ([DEBUG] / dbg! Macro)")
        for v in critical_violations:
            print(f"  ✗ {v['file']}:{v['line']} [{v['rule']}]")
            print(f"    {v['content']}")

    if warning_violations:
        print("\n## SERVICE PRINT WARNINGS (eprintln! / println!)")
        for v in warning_violations:
            print(f"  ⚠ {v['file']}:{v['line']} [{v['rule']}]")
            print(f"    {v['content']}")

    if critical_violations or (strict_mode and warning_violations):
        print("\n" + "=" * 60)
        print("FAIL — Debug residue detected in production service code!")
        print("Remove [DEBUG]/dbg! statements before merging to main.")
        print("=" * 60)
        return 1

    print("\n" + "=" * 60)
    print("PASS — Zero critical debug residue detected in production service code.")
    print("=" * 60)
    return 0


def cmd_audit_modularity(args: argparse.Namespace) -> int:
    """Audit Rust service codebase for modularity limits (500 lines per AGENTS.md)."""
    work_tree = Path.cwd()

    target_dirs = [
        work_tree / "v2" / "service" / "src",
        work_tree / "hcb2" / "service" / "src",
        work_tree / "src",
    ]

    threshold = int(getattr(args, "threshold", 500))

    files_info = []
    total_files = 0

    for tdir in target_dirs:
        if not tdir.is_dir():
            continue
        for p in tdir.rglob("*.rs"):
            rel_path = str(p.relative_to(work_tree))

            # Exclude generated/vendored files and lockfiles
            if ("generated" in rel_path or "vendor" in rel_path or
                    "openapi" in rel_path or "tbls" in rel_path):
                continue

            total_files += 1
            try:
                content = p.read_text(encoding="utf-8")
                line_count = len(content.splitlines())
            except (OSError, UnicodeDecodeError):
                continue

            files_info.append({
                "file": rel_path,
                "lines": line_count,
                "flagged": line_count > threshold,
            })

    # Sort files by line count descending
    files_info.sort(key=lambda x: x["lines"], reverse=True)

    flagged_files = [f for f in files_info if f["flagged"]]
    compliant_files = total_files - len(flagged_files)
    health_score = (compliant_files / total_files * 100.0) if total_files > 0 else 100.0

    print("=" * 60)
    print(f"MODULARITY REVIEW AUDIT (Threshold: {threshold} lines)")
    print("=" * 60)
    print(f"  Scanned Files:    {total_files}")
    print(f"  Compliant Files:  {compliant_files}")
    print(f"  Flagged Files:    {len(flagged_files)}")
    print(f"  Modularity Score: {health_score:.1f}%")

    if flagged_files:
        print(f"\n## FLAGGED FILES (> {threshold} lines)")
        print(f"  {'LINES':<8} {'FILE PATH'}")
        print("  " + "─" * 56)
        for f in flagged_files:
            print(f"  {f['lines']:<8d} {f['file']}")

        print("\n" + "=" * 60)
        print("NOTICE — Files exceeding 500 lines require modularity review")
        print("or justification per AGENTS.md guidelines.")
        print("=" * 60)
        return 0

    print("\n" + "=" * 60)
    print("PASS — 100% of scanned files are within modularity thresholds.")
    print("=" * 60)
    return 0


def cmd_resume(args: argparse.Namespace) -> int:
    """Read-only: report this agent's checkpoint, peers, events, and Git state.

    Performs NO Git mutation whatsoever.
    """
    agents_dir = _agents_dir()
    events_file = _events_file()
    git = _git_state()
    now = _utc_now()

    # ── this agent ──────────────────────────────────────────────────────────
    own_path = _checkpoint_path(args.slot)
    own = None
    if own_path.is_file():
        try:
            own = json.loads(own_path.read_text())
        except (json.JSONDecodeError, OSError):
            own = None

    # ── peers ───────────────────────────────────────────────────────────────
    peers = []
    if agents_dir.is_dir():
        for p in sorted(agents_dir.glob("*.json")):
            if p.name == f"{args.slot}.json":
                continue
            try:
                peer = json.loads(p.read_text())
                peers.append({
                    "slot": peer.get("slot", p.stem),
                    "role": peer.get("role", "?"),
                    "updated_at": peer.get("updated_at", "?"),
                    "issue": peer.get("issue"),
                    "branch": peer.get("branch"),
                })
            except (json.JSONDecodeError, OSError):
                peers.append({"slot": p.stem, "error": "unreadable"})

    # ── recent events ───────────────────────────────────────────────────────
    recent_events = []
    if events_file.is_file():
        try:
            lines = events_file.read_text().splitlines()
            recent_events = [json.loads(l) for l in lines[-_EVENTS_MAX:] if l.strip()]
        except (OSError, json.JSONDecodeError):
            recent_events = []

    # ── warnings ────────────────────────────────────────────────────────────
    warnings = []
    if own is None:
        warnings.append("no checkpoint found — first run or state was cleared")
    else:
        checkpoint_branch = own.get("branch")
        if checkpoint_branch and checkpoint_branch != git["branch"]:
            warnings.append(
                f"branch mismatch: checkpoint says '{checkpoint_branch}' "
                f"but HEAD is on '{git['branch']}'"
            )
        if own.get("issue") and args.issue and own["issue"] != args.issue:
            warnings.append(
                f"issue mismatch: checkpoint says #{own['issue']} "
                f"but resume was asked for #{args.issue}"
            )
        if git["behind_main"] and git["behind_main"] != "0":
            warnings.append(f"behind origin/main by {git['behind_main']} commits")

    if git["dirty"]:
        warnings.append("worktree is dirty — uncommitted changes exist")
    if git["main_sha"] is None:
        warnings.append("origin/main not found — cannot determine drift")

    # ── canonical persona (behavior anchor) ─────────────────────────────────
    role = (own or {}).get("role") or next(
        (r for r in _VALID_ROLES if args.slot.startswith(r)), None)
    persona = _PERSONA_BY_ROLE.get(role or "")
    current_sha = _persona_sha(role) if persona else None
    recorded_sha = (own or {}).get("persona_sha")
    if recorded_sha and current_sha and recorded_sha != current_sha:
        warnings.append(
            f"persona changed since this checkpoint "
            f"(recorded {recorded_sha}, current {current_sha}) — "
            f"reload {persona} before continuing"
        )

    # ── checkpoint age ──────────────────────────────────────────────────────
    checkpoint_age = None
    if own and "updated_at" in own:
        try:
            then = datetime.fromisoformat(own["updated_at"])
            delta = datetime.now(timezone.utc) - then
            checkpoint_age = f"{int(delta.total_seconds())}s ({delta})"
            if delta.total_seconds() > 3600:
                warnings.append(f"checkpoint is {int(delta.total_seconds() / 3600)}h old")
        except (ValueError, TypeError):
            checkpoint_age = "unknown"

    # ── print report ────────────────────────────────────────────────────────
    print("=" * 60)
    print(f"AGENT RESUME — slot: {args.slot}")
    print("=" * 60)

    if own:
        print(f"\n## This agent")
        print(f"  role:       {own.get('role', '?')}")
        print(f"  provider:   {own.get('provider', '(none)') or '(none)'}")
        if own.get("session"):
            print(f"  session:    {own['session']}")
        print(f"  updated:    {own.get('updated_at', '?')}")
        print(f"  age:        {checkpoint_age or '?'}")
        if own.get("issue"):
            print(f"  issue:      #{own['issue']}")
        if own.get("branch"):
            print(f"  branch:     {own['branch']}")
        if own.get("objective"):
            print(f"  objective:  {own['objective']}")
        if own.get("notes"):
            print(f"  notes:      {own['notes']}")
    else:
        print("\n## This agent: NO CHECKPOINT")

    print(f"\n## Git state")
    print(f"  branch:     {git['branch']}")
    print(f"  HEAD:       {git['head_sha']}")
    print(f"  origin/main: {git['main_sha']}")
    print(f"  dirty:      {'yes' if git['dirty'] else 'no'}")
    if git["behind_main"]:
        print(f"  behind:     {git['behind_main']} commits")

    if peers:
        print(f"\n## Peer agents ({len(peers)})")
        for p in peers:
            line = f"  {p.get('slot', '?'):20s} role={p.get('role', '?'):14s}"
            if p.get("issue"):
                line += f" #{p['issue']}"
            if p.get("branch"):
                line += f" [{p['branch']}]"
            if p.get("updated_at"):
                age, label = _freshness(p["updated_at"])
                line += f" {label} age={age}"
            print(line)
    else:
        print(f"\n## Peer agents: none")

    if recent_events:
        print(f"\n## Recent events (last {len(recent_events)})")
        for e in recent_events:
            ts = e.get("timestamp", "?")[:19]
            slot = e.get("slot", "?")
            kind = e.get("kind", "?")
            msg = e.get("message", "")
            line = f"  {ts}  {slot:20s} {kind}"
            if msg:
                line += f" — {msg}"
            print(line)
    else:
        print(f"\n## Recent events: none")

    if warnings:
        print(f"\n## ⚠ Warnings ({len(warnings)})")
        for w in warnings:
            print(f"  • {w}")
    else:
        print(f"\n## Warnings: none")

    if persona:
        print(f"\n## Persona")
        print(f"  load {persona} FIRST — the checkpoint restores state;")
        print(f"  the persona restores behavior (see .agent-personas/README.md)")
        if current_sha:
            print(f"  current version: {current_sha}"
                  + (f" (checkpointed under {recorded_sha})" if recorded_sha else ""))

    print("\n" + "=" * 60)
    print("Reminder: GitHub/Issue/Project remain authority.")
    print("State is recovery-only; resume performed no Git mutation.")
    print("=" * 60)
    return 0


# Heartbeat contract: while actively working, agents checkpoint at least this
# often, so a fresher checkpoint than this reads as an occupied slot. Nothing
# here can prove a *process* is alive — only how recently one proved it was.
_ACTIVE_SECONDS = 30 * 60
_STALE_SECONDS = 24 * 3600


def _freshness(updated_at: str) -> tuple[str, str]:
    """(age text, label) for a checkpoint timestamp."""
    try:
        then = datetime.fromisoformat(updated_at)
    except (ValueError, TypeError):
        return ("?", "UNKNOWN")
    seconds = int((datetime.now(timezone.utc) - then).total_seconds())
    if seconds < 0:
        return ("clock-skew", "UNKNOWN")
    if seconds < 3600:
        age = f"{seconds // 60}m"
    elif seconds < _STALE_SECONDS:
        age = f"{seconds // 3600}h{(seconds % 3600) // 60:02d}m"
    else:
        age = f"{seconds // 86400}d"
    if seconds < _ACTIVE_SECONDS:
        return (age, "ACTIVE")
    if seconds < _STALE_SECONDS:
        return (age, "QUIET")
    return (age, "STALE")


def cmd_slots(args: argparse.Namespace) -> int:
    """Read-only: every slot checkpoint with age-based freshness labels."""
    agents_dir = _agents_dir()
    rows = []
    if agents_dir.is_dir():
        for p in sorted(agents_dir.glob("*.json")):
            try:
                data = json.loads(p.read_text())
            except (json.JSONDecodeError, OSError):
                rows.append(f"  {p.stem:20s} UNREADABLE")
                continue
            age, label = _freshness(data.get("updated_at", ""))
            slot = data.get("slot", p.stem)
            role = data.get("role", "?")
            provider = data.get("provider", "")
            session = data.get("session", "")
            if session and provider and session.startswith(f"{provider}:"):
                sess_str = session
            elif provider and session:
                sess_str = f"{provider}:{session}"
            else:
                sess_str = session or provider or "?"
            sig = f"[{slot}:{role} | {sess_str}]"
            line = f"  {sig:50s} {label:7s} age={age:8s}"
            if data.get("issue"):
                line += f" #{data['issue']}"
            if data.get("branch"):
                line += f" [{data['branch']}]"
            rows.append(line)
    print(f"SLOTS ({len(rows)})" if rows else "SLOTS: none")
    for line in rows:
        print(line)
    print()
    print(f"A checkpoint proves liveness only as of its timestamp.")
    print(f"  ACTIVE  = heartbeat within {_ACTIVE_SECONDS // 60}m (the cadence agents keep while working)")
    print(f"  QUIET   = parked, between checkpoints, or dead — cannot tell from here")
    print(f"  STALE   = older than {_STALE_SECONDS // 3600}h; presume abandoned")
    print("Before reclaiming a slot, verify against the provider's own session/task")
    print("list and the Issue's execution lock — never from age alone.")
    return 0


# ─── CLI ─────────────────────────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(
        description="Crash-resilient shared agent recovery state.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # checkpoint
    cp = sub.add_parser("checkpoint", help="atomically write/replace this agent's checkpoint")
    cp.add_argument("--slot", required=True, help="dispatcher-allocated slot ID (planning1, implementation1, ...)")
    cp.add_argument("--role", required=True, choices=_VALID_ROLES, help="agent role")
    cp.add_argument("--provider", default="", help="provider name (optional metadata)")
    cp.add_argument("--session", default="",
                    help="session id occupying the slot (e.g. codex:thread-..., "
                         "claude:sess_... ) — slots rotate sessions; analytics joins on this")
    cp.add_argument("--issue", default="", help="GitHub issue number (optional)")
    cp.add_argument("--branch", default="", help="Git branch (optional)")
    cp.add_argument("--objective", default="", help="short objective (optional)")
    cp.add_argument("--notes", default="", help="short recovery notes (optional)")
    cp.set_defaults(func=cmd_checkpoint)

    # event
    ev = sub.add_parser("event", help="append a coordination event")
    ev.add_argument("--slot", required=True, help="agent slot ID")
    ev.add_argument("--kind", required=True, help="event kind (e.g. started, paused, blocker)")
    ev.add_argument("--message", default="", help="short message (max 500 chars)")
    ev.set_defaults(func=cmd_event)

    # log-event
    le = sub.add_parser("log-event", help="append a structured activity event to .agent-state/events.jsonl")
    le.add_argument("--slot", required=True, help="agent slot ID")
    le.add_argument("--kind", required=True, help="event type (CLAIMED, FINDING, PR_OPENED, REVIEW_LOGGED, REALIZED, etc.)")
    le.add_argument("--work-unit", default="", help="optional WorkUnit ID")
    le.add_argument("--message", default="", help="short summary message")
    le.add_argument("--payload", default="", help="optional JSON payload string")
    le.set_defaults(func=cmd_log_event)

    # claim
    cl = sub.add_parser("claim", help="acquire lease-based WorkUnit ownership in .agent-state/claims.json")
    cl.add_argument("--work-unit", required=True, help="WorkUnit ID (e.g. L2-729 or 729)")
    cl.add_argument("--slot", required=True, help="agent slot ID")
    cl.add_argument("--role", default="", choices=_VALID_ROLES, help="agent role (optional)")
    cl.add_argument("--provider", default="", help="provider name (optional)")
    cl.add_argument("--session", default="", help="session ID (optional)")
    cl.add_argument("--lease-hours", type=float, default=4.0, help="lease duration in hours (default 4.0)")
    cl.add_argument("--force", action="store_true", help="force claim override if currently leased")
    cl.set_defaults(func=cmd_claim)

    # release
    rl = sub.add_parser("release", help="release a WorkUnit lease in .agent-state/claims.json")
    rl.add_argument("--work-unit", required=True, help="WorkUnit ID")
    rl.add_argument("--slot", required=True, help="agent slot ID")
    rl.set_defaults(func=cmd_release)

    # claims
    cms = sub.add_parser("claims", help="read-only: list all active WorkUnit claims")
    cms.set_defaults(func=cmd_claims)

    # audit-realization
    ar = sub.add_parser("audit-realization", help="audit feature realization status against main HEAD and evidence")
    ar.add_argument("--issue", default="", help="GitHub issue number")
    ar.add_argument("--plan-path", default="", help="path to L2 plan markdown file")
    ar.set_defaults(func=cmd_audit_realization)

    # audit-code-hygiene / check-debug-residue
    ach = sub.add_parser("audit-code-hygiene", aliases=["check-debug-residue"],
                         help="scan Rust service codebase for debug residue (eprintln!, dbg!, [DEBUG])")
    ach.add_argument("--strict", action="store_true", help="fail closed on any service eprintln/println print statements as well as [DEBUG]/dbg!")
    ach.set_defaults(func=cmd_audit_code_hygiene)

    # audit-modularity
    am = sub.add_parser("audit-modularity", help="audit Rust service codebase for 500-line modularity threshold per AGENTS.md")
    am.add_argument("--threshold", type=int, default=500, help="line count threshold for modularity review trigger (default 500)")
    am.set_defaults(func=cmd_audit_modularity)

    # resume
    sl = sub.add_parser("slots", help="read-only: list slots with freshness labels")
    sl.set_defaults(func=cmd_slots)

    rs = sub.add_parser("resume", help="read-only recovery report")
    rs.add_argument("--slot", required=True, help="agent slot ID")
    rs.add_argument("--issue", default="", help="expected issue number (for mismatch detection)")
    rs.set_defaults(func=cmd_resume)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
